import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, MessageCircle, Phone, Send, Sparkles, X } from "lucide-react";
import ReactMarkdown from "react-markdown";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { askCoreIpAssistant, type ChatTurn } from "@/lib/chat.functions";
import { QuoteDialog } from "@/components/site/QuoteDialog";
import assistantAvatar from "@/assets/assistant-avatar.jpg";

const SUGGESTIONS = [
  "Which IP phones do you offer?",
  "Tell me about your NMS software",
  "Which industries do you serve?",
  "How do I contact the sales team?",
];

export function ChatWidget() {
  const ask = useServerFn(askCoreIpAssistant);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<ChatTurn[]>([
    {
      role: "assistant",
      content:
        "Hi, I'm Aria — the CoreIP virtual assistant. Ask me about our products, solutions, industries or how to reach our team.",
    },
  ]);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
  }, [messages, open]);

  const send = async (question: string) => {
    const text = question.trim();
    if (!text || busy) return;
    const history = messages.slice(-6);
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setBusy(true);
    try {
      const reply = await ask({ data: { question: text, history } });
      setMessages((prev) => [...prev, { role: "assistant", content: reply.content }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I couldn't reach the assistant. Please try again, or use the enquiry form and our team will respond.",
        },
      ]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open CoreIP assistant"
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-full bg-[image:var(--gradient-brand)] py-2 pl-2 pr-5 text-cyan-foreground shadow-2xl transition-transform hover:scale-105"
        >
          <img
            src={assistantAvatar}
            alt=""
            width={512}
            height={512}
            loading="lazy"
            className="size-10 rounded-full object-cover ring-2 ring-cyan-foreground/40"
          />
          <span className="text-sm font-semibold">Chat with us</span>
        </button>
      )}

      <aside
        aria-hidden={!open}
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-[min(24rem,100vw)] flex-col border-l border-border bg-card shadow-2xl transition-transform duration-300",
          open ? "translate-x-0" : "pointer-events-none translate-x-full",
        )}
      >
        <header className="relative overflow-hidden bg-[image:var(--gradient-navy)] px-5 pb-5 pt-6 text-navy-foreground">
          <div className="bg-grid-faint absolute inset-0 opacity-40" />
          <button
            onClick={() => setOpen(false)}
            aria-label="Close CoreIP assistant"
            className="absolute right-3 top-3 rounded-full p-1.5 text-navy-foreground/70 transition-colors hover:bg-navy-foreground/10 hover:text-navy-foreground"
          >
            <X className="size-5" />
          </button>
          <div className="relative flex items-center gap-3">
            <img
              src={assistantAvatar}
              alt="CoreIP virtual assistant"
              width={512}
              height={512}
              loading="lazy"
              className="size-14 rounded-full object-cover ring-2 ring-cyan/50"
            />
            <div>
              <p className="font-display text-base font-bold">Aria — CoreIP Assistant</p>
              <p className="mt-0.5 flex items-center gap-1.5 text-xs text-navy-foreground/70">
                <span className="size-2 rounded-full bg-cyan" /> Online · answers from our product
                knowledge
              </p>
            </div>
          </div>
        </header>

        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                "max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap",
                message.role === "user"
                  ? "ml-auto bg-primary text-primary-foreground"
                  : "border border-border bg-surface text-foreground",
              )}
            >
              {message.role === "assistant" ? (
                <div className="space-y-2 [&_a]:font-medium [&_a]:text-accent [&_a]:underline [&_li]:ml-4 [&_li]:list-disc [&_strong]:font-semibold">
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
              ) : (
                message.content
              )}
            </div>
          ))}
          {busy && (
            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="size-3.5 animate-spin" /> Aria is typing…
            </p>
          )}
          <div ref={endRef} />
        </div>

        {messages.length <= 1 && (
          <div className="px-4 pb-3">
            <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
              <Sparkles className="size-3.5 text-accent" /> Suggested questions
            </p>
            <div className="grid gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => void send(s)}
                  className="rounded-xl border border-border px-3 py-2 text-left text-sm text-foreground transition-colors hover:border-accent hover:text-accent"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 border-t border-border px-4 py-3">
          <QuoteDialog
            source="chat-widget"
            title="Talk to sales"
            trigger={
              <Button variant="hero" size="sm">
                <Phone className="size-3.5" /> Talk to sales
              </Button>
            }
          />
          <Button variant="outline" size="sm" asChild>
            <a href="/#contact">
              <MessageCircle className="size-3.5" /> Contact options
            </a>
          </Button>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            void send(input);
          }}
          className="flex items-center gap-2 border-t border-border p-3"
        >
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Type your question…"
            aria-label="Message"
            className="min-w-0 flex-1 rounded-full border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent"
          />
          <Button type="submit" size="icon" variant="hero" disabled={busy || !input.trim()}>
            <Send className="size-4" />
          </Button>
        </form>
      </aside>
    </>
  );
}
