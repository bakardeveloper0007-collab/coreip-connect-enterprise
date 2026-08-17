import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Bot, Loader2, MessageCircle, Send, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { askCoreIpAssistant, type ChatTurn } from "@/lib/chat.functions";

const SUGGESTIONS = [
  "Which IP phones do you offer?",
  "Tell me about your NMS software",
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
        "Hi! I'm the CoreIP assistant. Ask me about our products, solutions, industries or how to reach our team.",
    },
  ]);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
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
            "I couldn't reach the assistant. Please try again, or use the contact form and our team will respond.",
        },
      ]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close CoreIP assistant" : "Open CoreIP assistant"}
        className="fixed bottom-5 right-5 z-50 grid size-14 place-items-center rounded-full bg-[image:var(--gradient-brand)] text-cyan-foreground shadow-lg transition-transform hover:scale-105"
      >
        {open ? <X className="size-6" /> : <MessageCircle className="size-6" />}
      </button>

      <div
        className={cn(
          "fixed bottom-24 right-5 z-50 flex w-[min(23rem,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl transition-all duration-300",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none translate-y-3 opacity-0",
        )}
      >
        <div className="flex items-center gap-2.5 bg-[image:var(--gradient-navy)] px-4 py-3 text-navy-foreground">
          <span className="grid size-8 place-items-center rounded-full bg-cyan/20 text-cyan">
            <Bot className="size-4" />
          </span>
          <div>
            <p className="font-display text-sm font-semibold">CoreIP Assistant</p>
            <p className="text-xs text-navy-foreground/60">Answers from our product knowledge</p>
          </div>
        </div>

        <div className="max-h-80 space-y-3 overflow-y-auto p-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                "max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap",
                message.role === "user"
                  ? "ml-auto bg-primary text-primary-foreground"
                  : "bg-surface text-foreground",
              )}
            >
              {message.content}
            </div>
          ))}
          {busy && (
            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="size-3.5 animate-spin" /> Thinking…
            </p>
          )}
          <div ref={endRef} />
        </div>

        {messages.length <= 1 && (
          <div className="flex flex-wrap gap-2 px-4 pb-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => void send(s)}
                className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-accent hover:text-accent"
              >
                {s}
              </button>
            ))}
          </div>
        )}

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
            placeholder="Ask about products, solutions…"
            aria-label="Message"
            className="min-w-0 flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
          />
          <Button type="submit" size="icon" variant="hero" disabled={busy || !input.trim()}>
            <Send className="size-4" />
          </Button>
        </form>
      </div>
    </>
  );
}