import { createServerFn } from "@tanstack/react-start";

export const LANGUAGES = [
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "ja", label: "Japanese", native: "日本語" },
  { code: "de", label: "German", native: "Deutsch" },
  { code: "fr", label: "French", native: "Français" },
  { code: "it", label: "Italian", native: "Italiano" },
] as const;

export type LanguageCode = (typeof LANGUAGES)[number]["code"];

const NAMES: Record<string, string> = {
  hi: "Hindi",
  ja: "Japanese",
  de: "German",
  fr: "French",
  it: "Italian",
  en: "English",
};

export const translateTexts = createServerFn({ method: "POST" })
  .inputValidator((data: { texts: string[]; target: string }) => {
    const target = String(data.target ?? "").slice(0, 5);
    if (!NAMES[target]) throw new Error("Unsupported language");
    const texts = (data.texts ?? []).slice(0, 80).map((t) => String(t).slice(0, 600));
    return { texts, target };
  })
  .handler(async ({ data }) => {
    if (data.target === "en" || data.texts.length === 0) {
      return { translations: data.texts };
    }
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) return { translations: data.texts };

    const prompt = [
      `Translate each string in the JSON array into ${NAMES[data.target]}.`,
      "Rules: keep product names, brand names (CoreIP), model numbers, URLs and numbers unchanged.",
      "Preserve leading/trailing spacing and punctuation. Do not add explanations.",
      'Reply with ONLY a JSON object: {"translations": ["...", "..."]} with exactly the same number of items, in order.',
      JSON.stringify(data.texts),
    ].join("\n");

    try {
      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "google/gemini-3.5-flash",
          messages: [
            { role: "system", content: "You are a precise website localisation engine." },
            { role: "user", content: prompt },
          ],
          response_format: { type: "json_object" },
        }),
      });
      if (!response.ok) return { translations: data.texts };
      const payload = (await response.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      const raw = payload.choices?.[0]?.message?.content ?? "{}";
      const parsed = JSON.parse(raw) as { translations?: unknown };
      const list = Array.isArray(parsed.translations) ? parsed.translations : [];
      return {
        translations: data.texts.map((original, index) => {
          const value = list[index];
          return typeof value === "string" && value.trim() ? value : original;
        }),
      };
    } catch {
      return { translations: data.texts };
    }
  });
