import { useEffect, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { MessageCircle, X, Send } from "lucide-react";
import { SuraMascot } from "./SuraMascot";
import { triggerMascotFormSent, triggerMascotFormError } from "@/lib/mascot-events";
import { useIsLightTheme } from "@/lib/use-theme";

type Msg = { role: "user" | "assistant"; content: string };

const starters = [
  "What does Surajit specialize in?",
  "Show me his best projects",
  "How can I hire him?",
  "What tools does he use?",
];

// ─── Client-side rate limiter (mirrors server: 20 req / 5 min) ───────────────
const WINDOW_MS = 5 * 60 * 1000; // 5 minutes
const MAX_REQUESTS = 20;
const MAX_INPUT_CHARS = 500;

let requestTimestamps: number[] = [];

function clientIsRateLimited(): boolean {
  const now = Date.now();
  requestTimestamps = requestTimestamps.filter((t) => now - t < WINDOW_MS);
  return requestTimestamps.length >= MAX_REQUESTS;
}

function recordClientRequest() {
  requestTimestamps.push(Date.now());
}

function remainingRequests(): number {
  const now = Date.now();
  const active = requestTimestamps.filter((t) => now - t < WINDOW_MS);
  return Math.max(0, MAX_REQUESTS - active.length);
}

function retryAfterSeconds(): number {
  if (requestTimestamps.length === 0) return 0;
  const oldest = requestTimestamps[0];
  return Math.ceil((oldest + WINDOW_MS - Date.now()) / 1000);
}
// ─────────────────────────────────────────────────────────────────────────────

function useDecode(target: string, enabled: boolean) {
  const [text, setText] = useState(enabled ? "" : target);
  useEffect(() => {
    if (!enabled) {
      setText(target);
      return;
    }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setText(target);
      return;
    }
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ01#/*";
    let frame = 0;
    const total = 14;
    const id = setInterval(() => {
      frame++;
      const progress = frame / total;
      const revealed = Math.floor(target.length * progress);
      const scrambled = target
        .split("")
        .map((c, i) =>
          i < revealed || c === " " || c === "\n"
            ? c
            : chars[Math.floor(Math.random() * chars.length)],
        )
        .join("");
      setText(scrambled);
      if (frame >= total) {
        setText(target);
        clearInterval(id);
      }
    }, 22);
    return () => clearInterval(id);
  }, [target, enabled]);
  return text;
}

function AssistantBubble({
  content,
  animate,
  isError,
}: {
  content: string;
  animate: boolean;
  isError?: boolean;
}) {
  const decoded = useDecode(content, animate);
  return (
    <div className="flex flex-col items-start gap-1">
      <div className="flex items-center gap-1.5 pl-1">
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--accent)]">
          SURA
        </span>
      </div>
      <div
        className={`max-w-[85%] rounded-2xl rounded-tl-sm border border-[var(--border)] bg-[var(--background)]/90 px-4 py-2.5 text-sm leading-relaxed ${
          isError ? "border-red-500/30 text-red-400/90" : "text-[var(--foreground)]/90"
        }`}
      >
        {decoded}
      </div>
    </div>
  );
}

export function SuraWidget() {
  const isLight = useIsLightTheme();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<(Msg & { isError?: boolean })[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [firstIndex, setFirstIndex] = useState<number | null>(null);
  const [remaining, setRemaining] = useState(MAX_REQUESTS);
  const [vpHeight, setVpHeight] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync remaining quota
  useEffect(() => {
    setRemaining(remainingRequests());
  }, [open]);

  // Keep mobile keyboard from pushing header off-screen
  useEffect(() => {
    if (!open) return;
    const vv = window.visualViewport;
    if (!vv) return;
    const update = () => setVpHeight(vv.height);
    update();
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
      setVpHeight(null);
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 120);
    }
  }, [open]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    if (clientIsRateLimited()) {
      const wait = retryAfterSeconds();
      setRemaining(0);
      triggerMascotFormError();
      setMessages((prev) => [
        ...prev,
        { role: "user", content: trimmed },
        {
          role: "assistant",
          isError: true,
          content: `Rate limit reached. Please wait ${wait}s before asking again.`,
        },
      ]);
      setInput("");
      return;
    }

    recordClientRequest();
    setRemaining(remainingRequests());

    const next: Msg[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    setLoading(true);
    setFirstIndex(next.length);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (res.status === 429) {
        const data = await res.json().catch(() => ({}));
        const retryAfter = res.headers.get("Retry-After") || data.retryAfter || "a few";
        setRemaining(0);
        triggerMascotFormError();
        throw new Error(`Too many questions! Please wait ${retryAfter}s before asking again.`);
      }

      if (!res.ok) {
        triggerMascotFormError();
        throw new Error("Could not reach SURA");
      }

      const data = await res.json();
      setMessages([...next, { role: "assistant", content: data.text ?? "…" }]);
      // Reaction: Form sent successfully -> "celebrate"
      triggerMascotFormSent();
    } catch (err: unknown) {
      triggerMascotFormError();
      const errorMsg =
        err instanceof Error
          ? err.message
          : "SURA is offline — reach Surajit directly via the contact links in the footer.";
      setMessages([
        ...next,
        {
          role: "assistant",
          isError: true,
          content: errorMsg,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    send(input);
  };
  const inputOverLimit = input.length > MAX_INPUT_CHARS;
  const rateLimitedOut = remaining === 0;

  return (
    <>
      {/* Trigger */}
      <motion.button
        onClick={() => setOpen(true)}
        aria-label="Chat with SURA"
        className="group fixed bottom-6 right-6 z-40 flex flex-col items-center"
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: open ? 0 : 1, y: open ? 20 : 0 }}
      >
        {/* Hover tooltip bubble */}
        <div className="mb-2 flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)]/95 px-3 py-1.5 text-xs font-medium text-[var(--foreground)] opacity-0 shadow-lg backdrop-blur-md transition-opacity group-hover:opacity-100">
          <span className="inline-flex h-2 w-2 rounded-full bg-[var(--accent)]" />
          SURA AI
        </div>

        {/* Chat bubble - Frosted Card matching UI */}
        <div
          className="relative flex flex-col items-center gap-1 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/95 px-4 py-3 backdrop-blur-2xl transition-all group-hover:border-[var(--accent)]/50 group-hover:scale-105"
          style={{
            boxShadow: isLight
              ? "0 18px 40px -10px rgba(0, 0, 0, 0.12), 0 0 20px -5px rgba(0, 0, 0, 0.06)"
              : "0 20px 45px -10px rgba(0, 0, 0, 0.8), 0 0 25px -5px var(--accent-glow)",
          }}
        >
          {/* Subtle pedestal spotlight so the mascot stands out with depth */}
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl opacity-60"
            style={{
              background: isLight
                ? "radial-gradient(circle at 50% 40%, rgba(0, 0, 0, 0.03), transparent 70%)"
                : "radial-gradient(circle at 50% 40%, rgba(255, 255, 255, 0.06), transparent 70%)",
            }}
          />

          {/* Online dot */}
          <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent)] opacity-60" />
            <span className="relative inline-flex h-full w-full rounded-full border border-[var(--surface)] bg-[var(--accent)]" />
          </span>

          {/* Procedural 3D SURA Mascot */}
          <div className="relative flex h-12 w-12 items-center justify-center overflow-visible">
            <SuraMascot size={54} reactive={!open} animation={open ? "curious" : undefined} />
          </div>

          {/* Label */}
          <span className="relative font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--foreground)]">
            Ask SURA
          </span>
        </div>

        {/* Bubble tail matching card */}
        <svg width="18" height="10" viewBox="0 0 18 10" className="-mt-px text-[var(--surface)]">
          <path d="M0 0 L9 10 L18 0 Z" fill="currentColor" fillOpacity="0.95" />
        </svg>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ type: "spring", damping: 24, stiffness: 260 }}
            className="fixed z-50 flex flex-col overflow-hidden border border-[var(--border)] bg-[var(--surface)]/95 text-[var(--foreground)] shadow-2xl backdrop-blur-2xl
                       inset-x-0 bottom-0 sm:inset-auto sm:bottom-6 sm:right-6 sm:top-auto sm:h-[600px] sm:max-h-[85vh] sm:w-[420px] sm:rounded-2xl"
            style={{
              boxShadow: isLight
                ? "0 25px 60px -15px rgba(0, 0, 0, 0.18), 0 0 0 1px var(--border)"
                : "0 30px 80px -20px var(--accent-glow), 0 0 0 1px var(--border)",
              ...(vpHeight != null ? { height: vpHeight, top: "auto" } : { top: 0 }),
            }}
            role="dialog"
            aria-label="SURA chat"
          >
            {/* Top Scanline */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)]/60 to-transparent" />
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg, var(--foreground) 0 1px, transparent 1px 3px)",
              }}
            />

            {/* Header */}
            <div className="relative flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface)]/85 px-5 py-3.5 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--background)]/80 shadow-inner">
                  <SuraMascot
                    size={42}
                    reactive={false}
                    animation={loading ? "thinking" : "listening"}
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent)] opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full border border-[var(--surface)] bg-[var(--accent)]" />
                  </span>
                </div>
                <div>
                  <div className="font-display text-lg leading-none tracking-tight text-[var(--foreground)]">
                    SURA <span className="text-[var(--muted-foreground)]">/ AI</span>
                  </div>
                </div>
              </div>

              {/* Rate limit badge */}
              <div
                className={`mr-2 font-mono text-[10px] tabular-nums ${remaining <= 5 ? "font-semibold text-red-400" : "text-[var(--muted-foreground)]"}`}
              >
                {remaining}/{MAX_REQUESTS} left
              </div>

              <button
                onClick={() => setOpen(false)}
                className="rounded-full p-2 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--foreground)]/10 hover:text-[var(--foreground)]"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="relative flex-1 space-y-4 overflow-y-auto px-5 py-5">
              {messages.length === 0 && (
                <div className="space-y-4">
                  <AssistantBubble
                    animate
                    content="Hey — I'm SURA, Surajit's AI. Ask me about his projects, skills, or how to work with him."
                  />
                  <div className="flex flex-wrap gap-2 pt-2">
                    {starters.map((s) => (
                      <button
                        key={s}
                        onClick={() => send(s)}
                        className="rounded-full border border-[var(--border)] bg-[var(--foreground)]/5 px-3 py-1.5 text-xs text-[var(--foreground)]/80 transition-all hover:border-[var(--accent)]/60 hover:text-[var(--foreground)]"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m, i) =>
                m.role === "user" ? (
                  <div key={i} className="flex justify-end">
                    <div className="max-w-[85%] rounded-2xl rounded-br-sm border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-4 py-2 text-sm text-[var(--foreground)] backdrop-blur">
                      {m.content}
                    </div>
                  </div>
                ) : (
                  <AssistantBubble
                    key={i}
                    content={m.content}
                    animate={firstIndex === i}
                    isError={m.isError}
                  />
                ),
              )}

              {loading && (
                <div className="flex items-center gap-2 pl-8">
                  <span
                    className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--accent)]"
                    style={{ animationDelay: "0ms" }}
                  />
                  <span
                    className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--accent)]"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--accent)]"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={onSubmit}
              className="relative flex flex-col border-t border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-md"
            >
              <div className="flex items-center gap-2 px-4 py-3">
                <MessageCircle className="h-4 w-4 shrink-0 text-[var(--muted-foreground)]" />
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    rateLimitedOut
                      ? "Rate limit reached — try again shortly…"
                      : "Ask about Surajit…"
                  }
                  maxLength={MAX_INPUT_CHARS + 50}
                  className="flex-1 bg-transparent text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]/70 focus:outline-none"
                  disabled={loading || rateLimitedOut}
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim() || inputOverLimit || rateLimitedOut}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--foreground)]/5 text-[var(--accent)] transition-all hover:border-[var(--accent)]/60 hover:bg-[var(--accent)]/10 disabled:opacity-40"
                  aria-label="Send"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Character counter */}
              {input.length > MAX_INPUT_CHARS * 0.8 && (
                <div
                  className={`pb-2 pr-4 text-right font-mono text-[10px] ${inputOverLimit ? "text-red-400" : "text-[var(--muted-foreground)]"}`}
                >
                  {input.length}/{MAX_INPUT_CHARS}
                </div>
              )}
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
