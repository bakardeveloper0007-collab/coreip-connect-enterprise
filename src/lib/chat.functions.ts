import { createServerFn } from "@tanstack/react-start";

export interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

export const askCoreIpAssistant = createServerFn({ method: "POST" })
  .inputValidator((data: { question: string; history?: ChatTurn[] }) => {
    const question = (data.question ?? "").trim();
    if (!question) throw new Error("Question is required");
    if (question.length > 800) throw new Error("Question is too long");
    const history = (data.history ?? []).slice(-6).map((turn) => ({
      role: turn.role === "assistant" ? ("assistant" as const) : ("user" as const),
      content: String(turn.content).slice(0, 2000),
    }));
    return { question, history };
  })
  .handler(async ({ data }) => {
    const { createPublicClient } = await import("./public-content.server");
    const client = createPublicClient();

    const [articles, products, services, contactRow] = await Promise.all([
      client
        .from("knowledge_articles")
        .select("title,category,content,link_url,link_label,keywords")
        .eq("status", "published")
        .limit(60),
      client
        .from("products")
        .select("name,slug,short_description,features,category:product_categories(slug)")
        .eq("status", "published")
        .limit(60),
      client
        .from("services")
        .select("name,slug,short_description")
        .eq("status", "published")
        .limit(30),
      client.from("website_settings").select("value").eq("key", "contact_info").maybeSingle(),
    ]);

    const contact = (contactRow.data?.value ?? {}) as Record<string, string>;

    const knowledge = [
      ...(articles.data ?? []).map(
        (a) =>
          `[Article] ${a.title} (${a.category ?? "general"}): ${String(a.content).slice(0, 900)}${
            a.link_url ? ` | link: ${a.link_url}` : ""
          }`,
      ),
      ...(products.data ?? []).map((p) => {
        const cat = (p as { category?: { slug?: string } | null }).category?.slug ?? "all";
        const features = Array.isArray(p.features) ? (p.features as string[]).join("; ") : "";
        return `[Product] ${p.name}: ${p.short_description ?? ""} ${features} | link: /products/${cat}/${p.slug}`;
      }),
      ...(services.data ?? []).map(
        (s) => `[Solution] ${s.name}: ${s.short_description ?? ""} | link: /solutions/${s.slug}`,
      ),
      `[Contact] Phone: ${contact["primary_phone"] ?? ""}, Sales: ${contact["sales_email"] ?? ""}, Email: ${
        contact["email"] ?? ""
      }, Address: ${contact["address"] ?? ""}, Hours: ${contact["business_hours"] ?? ""}`,
    ].join("\n");

    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) {
      return {
        content:
          "I'm unable to reach the assistant service right now. Please use the contact form and our team will get back to you.",
        grounded: false,
      };
    }

    const systemPrompt = [
      "You are the CoreIP website assistant for coreip.co.in, an Indian enterprise technology company.",
      "Answer ONLY using the CoreIP knowledge below. Never invent products, prices, specifications, clients or contact details.",
      "If the answer is not in the knowledge, say you don't have that detail and invite the visitor to contact the CoreIP team.",
      "Be concise (max ~90 words), professional and helpful. Suggest the relevant page path when useful.",
      "Never discuss competitors, and never claim capabilities not listed.",
      "",
      "CoreIP knowledge:",
      knowledge.slice(0, 24000),
    ].join("\n");

    try {
      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3.5-flash",
          messages: [
            { role: "system", content: systemPrompt },
            ...data.history,
            { role: "user", content: data.question },
          ],
        }),
      });

      if (!response.ok) {
        const status = response.status;
        return {
          content:
            status === 429
              ? "I'm handling a lot of questions right now — please try again in a moment, or reach our team through the contact form."
              : "I couldn't process that just now. Please try again, or contact the CoreIP team directly.",
          grounded: false,
        };
      }

      const payload = (await response.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      const content = payload.choices?.[0]?.message?.content?.trim();
      return {
        content:
          content ||
          "I don't have that detail. Please share your requirement through the contact form and our team will respond.",
        grounded: true,
      };
    } catch {
      return {
        content:
          "Something went wrong reaching the assistant. Please try again shortly or contact our team.",
        grounded: false,
      };
    }
  });