import { createServerFn } from "@tanstack/react-start";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const clean = (value: unknown, max: number) => String(value ?? "").trim().slice(0, max);

async function hashCode(code: string) {
  const bytes = new TextEncoder().encode(`coreip-datasheet:${code}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Step 1 — visitor gives their details, we email a 6-digit one-time code. */
export const requestDatasheetCode = createServerFn({ method: "POST" })
  .inputValidator((data: {
    productSlug: string;
    email: string;
    name?: string;
    company?: string;
    phone?: string;
  }) => {
    const email = clean(data.email, 200).toLowerCase();
    const productSlug = clean(data.productSlug, 160);
    if (!EMAIL.test(email)) throw new Error("Please enter a valid work email address");
    if (!productSlug) throw new Error("Product is required");
    return {
      email,
      productSlug,
      name: clean(data.name, 120) || null,
      company: clean(data.company, 160) || null,
      phone: clean(data.phone, 40) || null,
    };
  })
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: product } = await supabaseAdmin
      .from("products")
      .select("id,name,brochure_url,datasheet_access,status")
      .eq("slug", data.productSlug)
      .eq("status", "published")
      .maybeSingle();

    if (!product?.brochure_url) throw new Error("No datasheet is available for this product.");

    // Public datasheets never need verification.
    if (product.datasheet_access !== "gated") {
      return { gated: false as const, url: product.brochure_url, delivered: false };
    }

    const since = new Date(Date.now() - 10 * 60_000).toISOString();
    const { count } = await supabaseAdmin
      .from("datasheet_requests")
      .select("id", { count: "exact", head: true })
      .eq("email", data.email)
      .gte("created_at", since);
    if ((count ?? 0) >= 3) {
      throw new Error("Too many requests. Please wait a few minutes and try again.");
    }

    const code = String(Math.floor(100000 + Math.random() * 900000));
    const { data: row, error } = await supabaseAdmin
      .from("datasheet_requests")
      .insert({
        product_id: product.id,
        product_name: product.name,
        email: data.email,
        name: data.name,
        company: data.company,
        phone: data.phone,
        code_hash: await hashCode(code),
        expires_at: new Date(Date.now() + 10 * 60_000).toISOString(),
      })
      .select("id")
      .single();

    if (error || !row) {
      console.error("Failed to create datasheet request", error?.message);
      throw new Error("We couldn't start the download. Please try again.");
    }

    const { sendOtpMail } = await import("./mailer.server");
    const delivered = await sendOtpMail(data.email, code, product.name);

    return { gated: true as const, requestId: row.id, delivered };
  });

/** Step 2 — verify the code and hand back the datasheet link. */
export const verifyDatasheetCode = createServerFn({ method: "POST" })
  .inputValidator((data: { requestId: string; code: string }) => ({
    requestId: clean(data.requestId, 60),
    code: clean(data.code, 10).replace(/\D/g, ""),
  }))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row } = await supabaseAdmin
      .from("datasheet_requests")
      .select("id,product_id,code_hash,expires_at,attempts")
      .eq("id", data.requestId)
      .maybeSingle();

    if (!row) throw new Error("This request has expired. Please start again.");
    if (row.attempts >= 5) throw new Error("Too many incorrect attempts. Please start again.");
    if (new Date(row.expires_at).getTime() < Date.now()) {
      throw new Error("This code has expired. Please request a new one.");
    }

    if ((await hashCode(data.code)) !== row.code_hash) {
      await supabaseAdmin
        .from("datasheet_requests")
        .update({ attempts: row.attempts + 1 })
        .eq("id", row.id);
      throw new Error("That code is incorrect. Please check your email and try again.");
    }

    await supabaseAdmin
      .from("datasheet_requests")
      .update({ verified_at: new Date().toISOString() })
      .eq("id", row.id);

    const { data: product } = await supabaseAdmin
      .from("products")
      .select("brochure_url")
      .eq("id", row.product_id!)
      .maybeSingle();

    if (!product?.brochure_url) throw new Error("The datasheet is no longer available.");
    return { url: product.brochure_url };
  });
