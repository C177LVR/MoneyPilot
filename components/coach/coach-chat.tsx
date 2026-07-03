"use client";

import * as React from "react";
import { Bot, User, Send, Loader2, AlertCircle, Sparkles } from "lucide-react";
import { GlassCard, Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Message = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Can I afford a $35,000 car?",
  "Should I rent or buy?",
  "How much vacation can I afford this year?",
  "If I retire at 62 instead of 67, what changes?",
  "Should I pay off my mortgage early or invest?",
  "What's the impact of refinancing?",
  "Can I afford to quit my job and start a business?",
];

export function CoachChat({
  configured,
  initialConversationId,
  initialMessages,
}: {
  configured: boolean;
  initialConversationId: string | null;
  initialMessages: Message[];
}) {
  const [messages, setMessages] = React.useState<Message[]>(initialMessages);
  const [conversationId, setConversationId] = React.useState(initialConversationId);
  const [input, setInput] = React.useState("");
  const [sending, setSending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const bottomRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    setError(null);
    setMessages((m) => [...m, { role: "user", content: trimmed }]);
    setInput("");
    setSending(true);
    try {
      const res = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId, message: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setConversationId(data.conversationId);
      setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSending(false);
    }
  }

  if (!configured) {
    return (
      <GlassCard className="p-8 text-center">
        <span className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-brand-500/10 text-brand-600">
          <Bot className="h-7 w-7" />
        </span>
        <h2 className="font-display text-lg font-semibold">
          AI Coach isn&apos;t configured yet
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Add an <code className="rounded bg-muted px-1.5 py-0.5">ANTHROPIC_API_KEY</code>{" "}
          to your environment to enable real-time coaching powered by Claude.
        </p>
      </GlassCard>
    );
  }

  return (
    <div className="flex h-[calc(100vh-220px)] min-h-[520px] flex-col">
      <Card className="flex-1 overflow-y-auto p-4 sm:p-6">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <span className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-brand text-white">
              <Sparkles className="h-7 w-7" />
            </span>
            <h2 className="font-display text-lg font-semibold">
              Ask your AI Coach anything
            </h2>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Grounded in your real numbers. Try one of these to get started:
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  className="rounded-full border border-border bg-card px-4 py-2 text-sm transition-colors hover:bg-muted"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn("flex gap-3", m.role === "user" && "flex-row-reverse")}
              >
                <span
                  className={cn(
                    "grid h-8 w-8 shrink-0 place-items-center rounded-full",
                    m.role === "user"
                      ? "bg-muted text-muted-foreground"
                      : "bg-gradient-brand text-white"
                  )}
                >
                  {m.role === "user" ? (
                    <User className="h-4 w-4" />
                  ) : (
                    <Bot className="h-4 w-4" />
                  )}
                </span>
                <div
                  className={cn(
                    "max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm",
                    m.role === "user" ? "bg-gradient-brand text-white" : "bg-muted"
                  )}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {sending && (
              <div className="flex gap-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-brand text-white">
                  <Bot className="h-4 w-4" />
                </span>
                <div className="flex items-center gap-2 rounded-2xl bg-muted px-4 py-3 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" /> Thinking…
                </div>
              </div>
            )}
          </div>
        )}
        <div ref={bottomRef} />
      </Card>

      {error && (
        <div className="mt-3 flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="mt-3 flex items-end gap-2"
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send(input);
            }
          }}
          rows={1}
          placeholder="Ask about affording something, debt vs. investing, retirement timing..."
          className="max-h-32 flex-1 resize-none rounded-2xl border border-border bg-card px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
        <button
          type="submit"
          disabled={sending || !input.trim()}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-brand text-white shadow-lg disabled:opacity-50"
          aria-label="Send"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>

      <p className="mt-2 text-center text-xs text-muted-foreground">
        Money Pilot&apos;s AI Coach provides educational information, not licensed
        financial, tax, or legal advice.
      </p>
    </div>
  );
}
