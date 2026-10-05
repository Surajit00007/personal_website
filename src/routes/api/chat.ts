import { createFileRoute } from "@tanstack/react-router";
import { generateText } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { buildContextFromData } from "@/lib/portfolio-context";
import { getPortfolioDataFromDb } from "@/lib/db.server";

// ─── Rate Limiter ────────────────────────────────────────────────────────────
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000; // 5 minutes
const RATE_LIMIT_MAX_REQUESTS = 20; // max requests per window per IP
const MAX_INPUT_CHARS = 500; // max characters per user message

const ipRequestLog = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const timestamps = (ipRequestLog.get(ip) ?? []).filter((t) => t > windowStart);
  if (timestamps.length >= RATE_LIMIT_MAX_REQUESTS) return true;
  timestamps.push(now);
  ipRequestLog.set(ip, timestamps);
  return false;
}

/** Return approximate seconds until the oldest request expires from the window */
function retryAfterSeconds(ip: string): number {
  const now = Date.now();
  const timestamps = ipRequestLog.get(ip) ?? [];
  const oldest = timestamps[0] ?? now;
  return Math.ceil((oldest + RATE_LIMIT_WINDOW_MS - now) / 1000);
}
// ─────────────────────────────────────────────────────────────────────────────

function getSystemPrompt(portfolioContextText: string): string {
  return `You are SURA — Surajit's personal AI assistant, embedded in his portfolio site.
You speak confidently, concisely, and strictly to the point.
You know everything about Surajit: his skills, projects, education, certifications, interests, and how to contact him.

When answering questions about Surajit:
- Use only the facts in the context block below. Never fabricate project names, dates, or credentials.
- If you genuinely don't know something, say "Surajit hasn't shared that publicly — reach him directly via the contact links in the footer."

When answering general, creative, or off-topic questions (unrelated to Surajit):
- DO NOT answer the question itself.
- Instead, politely decline and redirect the conversation back to Surajit. Acknowledge the user's curiosity about the specific topic they asked about (e.g., "baking bread", "history", "math") and state that you are only here to answer questions related to Surajit.
- Vary your phrasing naturally for each refusal so it doesn't sound repetitive (e.g., "It seems you're curious about [topic], but I can only answer questions related to Surajit.", "I see you're interested in [topic]! However, my expertise is limited to questions about Surajit.", "That sounds like a question about [topic], but I'm configured to only talk about Surajit's work and background.", etc.).

CRITICAL RULES FOR CONCISENESS & STYLE:
- Answer ONLY the specific question asked. Do not add extra details, background info, or unrelated facts.
- Keep replies extremely short: 1–2 sentences max. Speak directly and to the point.
- If the user asks for a specific social/contact link or his resume (like LinkedIn, GitHub, email, portfolio, or resume/CV), provide the exact link/URL directly instead of referring them to the footer.
- Do not list coursework or side information unless specifically asked.
- Natural, direct language. No bullet points. No emoji unless the user uses them first.
- Never break character. You ARE SURA.

--- PORTFOLIO CONTEXT ---
${portfolioContextText}
--- END CONTEXT ---`;
}

type Msg = { role: "user" | "assistant"; content: string };

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          // ── 1. Identify caller ─────────────────────────────────────────────
          const ip =
            request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
            request.headers.get("x-real-ip") ??
            "unknown";

          // ── 2. Rate-limit check ────────────────────────────────────────────
          if (isRateLimited(ip)) {
            const retryAfter = retryAfterSeconds(ip);
            return new Response(
              JSON.stringify({
                error: `Too many requests. You've reached the limit of ${RATE_LIMIT_MAX_REQUESTS} questions per 5 minutes. Please try again in ${retryAfter}s.`,
              }),
              {
                status: 429,
                headers: {
                  "Content-Type": "application/json",
                  "Retry-After": String(retryAfter),
                },
              },
            );
          }

          // ── 3. Parse body ──────────────────────────────────────────────────
          const { messages } = (await request.json()) as { messages: Msg[] };
          if (!Array.isArray(messages) || messages.length === 0) {
            return new Response("Messages required", { status: 400 });
          }

          // ── 4. Validate input length ───────────────────────────────────────
          const lastUserMsg = messages.filter((m) => m.role === "user").at(-1);
          if (lastUserMsg && lastUserMsg.content.length > MAX_INPUT_CHARS) {
            return new Response(
              JSON.stringify({
                error: `Your message is too long (max ${MAX_INPUT_CHARS} characters). Please keep it concise.`,
              }),
              { status: 413, headers: { "Content-Type": "application/json" } },
            );
          }

          // ── 5. Resolve API provider ────────────────────────────────────────
          const lovableKey = process.env.LOVABLE_API_KEY;
          const groqKey = process.env.GROQ_API_KEY;
          const geminiKey = process.env.GEMINI_API_KEY;

          console.log("SURA Chat API keys:", {
            lovableKey: !!lovableKey,
            groqKey: !!groqKey,
            geminiKey: !!geminiKey,
          });

          if (!lovableKey && !groqKey && !geminiKey) {
            return Response.json(
              {
                error:
                  "No API key configured. Set GROQ_API_KEY in Netlify environment variables (Site settings → Environment variables).",
              },
              { status: 500 },
            );
          }

          let model;
          if (lovableKey) {
            const gateway = createLovableAiGatewayProvider(lovableKey);
            model = gateway("google/gemini-3-flash-preview");
          } else if (groqKey) {
            const groq = createOpenAICompatible({
              name: "groq",
              baseURL: "https://api.groq.com/openai/v1",
              apiKey: groqKey,
            });
            model = groq("openai/gpt-oss-120b");
          } else {
            const google = createGoogleGenerativeAI({ apiKey: geminiKey });
            model = google("gemini-flash-latest");
          }

          // ── 6. Generate response ───────────────────────────────────────────
          const portfolioData = await getPortfolioDataFromDb();
          const portfolioContextText = buildContextFromData(portfolioData);

          const { text } = await generateText({
            model,
            system: getSystemPrompt(portfolioContextText),
            messages: messages.map((m) => ({ role: m.role, content: m.content })),
            maxOutputTokens: 250, // ~200 words — keeps replies tight
          });

          return Response.json({ text });
        } catch (err) {
          console.error("SURA Chat API Exception:", err);
          const message = err instanceof Error ? err.message : "Unknown error";
          return Response.json({ error: message }, { status: 500 });
        }
      },
    },
  },
});
