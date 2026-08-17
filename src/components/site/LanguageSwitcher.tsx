import { useCallback, useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useRouterState } from "@tanstack/react-router";
import { Globe, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { LANGUAGES, translateTexts, type LanguageCode } from "@/lib/translate.functions";

const STORAGE_KEY = "coreip-language";
const SKIP = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "CODE", "PRE", "TEXTAREA"]);

interface Tracked {
  node: Text;
  original: string;
}

function collectTextNodes(): Tracked[] {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const text = node.nodeValue ?? "";
      if (!text.trim() || text.trim().length < 2) return NodeFilter.FILTER_REJECT;
      const parent = (node as Text).parentElement;
      if (!parent || SKIP.has(parent.tagName)) return NodeFilter.FILTER_REJECT;
      if (parent.closest("[data-no-translate]")) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  const nodes: Tracked[] = [];
  let current = walker.nextNode();
  while (current) {
    const node = current as Text;
    nodes.push({ node, original: node.nodeValue ?? "" });
    current = walker.nextNode();
  }
  return nodes;
}

function readCache(lang: string): Record<string, string> {
  try {
    return JSON.parse(sessionStorage.getItem(`coreip-t-${lang}`) ?? "{}") as Record<string, string>;
  } catch {
    return {};
  }
}

function writeCache(lang: string, cache: Record<string, string>) {
  try {
    sessionStorage.setItem(`coreip-t-${lang}`, JSON.stringify(cache));
  } catch {
    /* quota — ignore */
  }
}

export function LanguageSwitcher({ className }: { className?: string }) {
  const translate = useServerFn(translateTexts);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [lang, setLang] = useState<LanguageCode>("en");
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState(false);
  const originals = useRef(new Map<Text, string>());

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as LanguageCode | null;
    if (saved && LANGUAGES.some((l) => l.code === saved)) setLang(saved);
  }, []);

  const applyLanguage = useCallback(
    async (target: LanguageCode) => {
      document.documentElement.lang = target;
      if (target === "en") {
        originals.current.forEach((value, node) => {
          node.nodeValue = value;
        });
        originals.current.clear();
        return;
      }

      setBusy(true);
      try {
        const cache = readCache(target);
        const tracked = collectTextNodes().map((entry) => {
          const stored = originals.current.get(entry.node);
          const original = stored ?? entry.original;
          originals.current.set(entry.node, original);
          return { node: entry.node, original };
        });

        const pending: string[] = [];
        for (const item of tracked) {
          const key = item.original.trim();
          if (cache[key]) {
            item.node.nodeValue = item.original.replace(key, cache[key]);
          } else if (!pending.includes(key)) {
            pending.push(key);
          }
        }

        for (let i = 0; i < pending.length; i += 60) {
          const chunk = pending.slice(i, i + 60);
          const { translations } = await translate({ data: { texts: chunk, target } });
          chunk.forEach((source, index) => {
            cache[source] = translations[index] ?? source;
          });
          for (const item of tracked) {
            const key = item.original.trim();
            if (chunk.includes(key) && cache[key]) {
              item.node.nodeValue = item.original.replace(key, cache[key]);
            }
          }
        }
        writeCache(target, cache);
      } finally {
        setBusy(false);
      }
    },
    [translate],
  );

  // Re-apply after language change and on every route change.
  useEffect(() => {
    if (lang === "en") return;
    const timer = setTimeout(() => void applyLanguage(lang), 350);
    return () => clearTimeout(timer);
  }, [lang, pathname, applyLanguage]);

  const choose = (code: LanguageCode) => {
    setOpen(false);
    localStorage.setItem(STORAGE_KEY, code);
    originals.current.clear();
    setLang(code);
    if (code === "en") window.location.reload();
  };

  const active = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0];

  return (
    <div className={cn("relative", className)} data-no-translate>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Change language"
        aria-expanded={open}
        className="flex items-center gap-1.5 rounded-md px-2.5 py-2 text-sm font-medium text-navy-foreground/80 transition-colors hover:text-navy-foreground"
      >
        {busy ? <Loader2 className="size-4 animate-spin" /> : <Globe className="size-4" />}
        <span className="hidden sm:inline">{active.native}</span>
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-40 overflow-hidden rounded-lg border border-border bg-card shadow-xl">
          {LANGUAGES.map((option) => (
            <button
              key={option.code}
              onClick={() => choose(option.code)}
              className={cn(
                "flex w-full items-center justify-between px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-surface",
                option.code === lang && "text-accent",
              )}
            >
              <span>{option.native}</span>
              <span className="text-xs text-muted-foreground">{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
