import { createServerFn } from "@tanstack/react-start";

export interface QuoteInput {
  name: string;
  email: string;
  company?: string | undefined;
  phone?: string | undefined;
  country?: string | undefined;
  requirement_type?: string | undefined;
  product_interest?: string | undefined;
  message: string;
  source?: string | undefined;
}

const clean = (value: unknown, max: number) => String(value ?? "").trim().slice(0, max);
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const submitQuoteRequest = createServerFn({ method: "POST" })
  .inputValidator((data: QuoteInput) => {
    const name = clean(data.name, 120);
    const email = clean(data.email, 200).toLowerCase();
    const message = clean(data.message, 2000);
    if (name.length < 2) throw new Error("Please enter your name");
    if (!EMAIL.test(email)) throw new Error("Please enter a valid email address");
    if (message.length < 5) throw new Error("Please describe your requirement");
    return {
      name,
      email,
      message,
      company: clean(data.company, 160) || null,
      phone: clean(data.phone, 40) || null,
      country: clean(data.country, 80) || null,
      requirement_type: clean(data.requirement_type, 80) || null,
      product_interest: clean(data.product_interest, 160) || null,
      source: clean(data.source, 80) || "website",
    };
  })
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("contact_inquiries").insert({
      ...data,
      status: "new",
    });
    if (error) {
      console.error("Failed to store enquiry", error.message);
      throw new Error("We couldn't submit your request. Please try again.");
    }
    return { ok: true as const };
  });
