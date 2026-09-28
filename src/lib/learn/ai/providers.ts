import "server-only";
import { readSSE } from "./sse";
import { AIError, type AIProvider, type AIProviderId, type ChatRequest, type StreamEvent } from "./types";

/* ------------------------------------------------------------------ */
/* Anthropic — Messages API                                            */
/* ------------------------------------------------------------------ */
const anthropic: AIProvider = {
  id: "anthropic",
  isConfigured: () => Boolean(process.env.ANTHROPIC_API_KEY),
  async *stream(req: ChatRequest): AsyncGenerator<StreamEvent> {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      signal: req.signal,
      headers: {
        "content-type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: req.model,
        system: req.system,
        max_tokens: req.maxOutputTokens,
        temperature: req.temperature,
        stream: true,
        messages: req.messages,
      }),
    });
    await assertOk(res, "anthropic");
    let input = 0;
    let output = 0;
    for await (const data of readSSE(res.body!)) {
      const evt = safeJSON(data);
      if (!evt) continue;
      if (evt.type === "content_block_delta" && evt.delta?.type === "text_delta") {
        yield { type: "text", text: evt.delta.text };
      } else if (evt.type === "message_start") {
        input = evt.message?.usage?.input_tokens ?? 0;
      } else if (evt.type === "message_delta") {
        output = evt.usage?.output_tokens ?? output;
      } else if (evt.type === "error") {
        yield { type: "error", message: evt.error?.message ?? "Provider error" };
      }
    }
    yield { type: "usage", usage: { inputTokens: input, outputTokens: output } };
  },
};

/* ------------------------------------------------------------------ */
/* OpenAI — Chat Completions API                                       */
/* ------------------------------------------------------------------ */
const openai: AIProvider = {
  id: "openai",
  isConfigured: () => Boolean(process.env.OPENAI_API_KEY),
  async *stream(req: ChatRequest): AsyncGenerator<StreamEvent> {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      signal: req.signal,
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: req.model,
        temperature: req.temperature,
        max_completion_tokens: req.maxOutputTokens,
        stream: true,
        stream_options: { include_usage: true },
        messages: [{ role: "system", content: req.system }, ...req.messages],
      }),
    });
    await assertOk(res, "openai");
    for await (const data of readSSE(res.body!)) {
      if (data === "[DONE]") break;
      const evt = safeJSON(data);
      if (!evt) continue;
      const text = evt.choices?.[0]?.delta?.content;
      if (text) yield { type: "text", text };
      if (evt.usage) {
        yield {
          type: "usage",
          usage: { inputTokens: evt.usage.prompt_tokens ?? 0, outputTokens: evt.usage.completion_tokens ?? 0 },
        };
      }
    }
  },
};

/* ------------------------------------------------------------------ */
/* Google — Gemini generateContent (SSE)                               */
/* ------------------------------------------------------------------ */
const google: AIProvider = {
  id: "google",
  isConfigured: () => Boolean(process.env.GOOGLE_AI_API_KEY),
  async *stream(req: ChatRequest): AsyncGenerator<StreamEvent> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
      req.model
    )}:streamGenerateContent?alt=sse`;
    const res = await fetch(url, {
      method: "POST",
      signal: req.signal,
      headers: { "content-type": "application/json", "x-goog-api-key": process.env.GOOGLE_AI_API_KEY! },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: req.system }] },
        contents: req.messages.map((m) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }],
        })),
        generationConfig: { temperature: req.temperature, maxOutputTokens: req.maxOutputTokens },
      }),
    });
    await assertOk(res, "google");
    let usage = { inputTokens: 0, outputTokens: 0 };
    for await (const data of readSSE(res.body!)) {
      const evt = safeJSON(data);
      if (!evt) continue;
      const parts: Array<{ text?: string }> = evt.candidates?.[0]?.content?.parts ?? [];
      for (const p of parts) if (p.text) yield { type: "text", text: p.text };
      if (evt.usageMetadata) {
        usage = {
          inputTokens: evt.usageMetadata.promptTokenCount ?? 0,
          outputTokens: evt.usageMetadata.candidatesTokenCount ?? 0,
        };
      }
    }
    yield { type: "usage", usage };
  },
};

export const providers: Record<AIProviderId, AIProvider> = { anthropic, openai, google };

/** First provider that has credentials, preferring the requested one. */
export function resolveProvider(preferred: AIProviderId): AIProvider | null {
  if (providers[preferred].isConfigured()) return providers[preferred];
  return Object.values(providers).find((p) => p.isConfigured()) ?? null;
}

/** Sensible default model per provider when falling back from the configured one. */
export const fallbackModels: Record<AIProviderId, string> = {
  anthropic: process.env.ANTHROPIC_MODEL || "claude-sonnet-5",
  openai: process.env.OPENAI_MODEL || "gpt-5-mini",
  google: process.env.GOOGLE_AI_MODEL || "gemini-2.5-flash",
};

async function assertOk(res: Response, provider: AIProviderId) {
  if (res.ok && res.body) return;
  const body = await res.text().catch(() => "");
  // Never leak provider bodies to the client; log server-side only.
  console.error(`[ai:${provider}] ${res.status} ${body.slice(0, 500)}`);
  if (res.status === 429) throw new AIError("The AI service is busy. Please try again in a moment.", "rate_limited", 429);
  throw new AIError("The AI service could not complete this request.", "provider_error", 502);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function safeJSON(s: string): any | null {
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}
