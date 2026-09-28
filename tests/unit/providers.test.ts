import { afterEach, describe, expect, it, vi } from "vitest";
import { providers, resolveProvider } from "@/lib/learn/ai/providers";
import type { StreamEvent } from "@/lib/learn/ai/types";

function sse(events: string[]) {
  const enc = new TextEncoder();
  return new Response(
    new ReadableStream({
      start(c) {
        for (const e of events) c.enqueue(enc.encode(`data: ${e}\n\n`));
        c.close();
      },
    }),
    { status: 200 }
  );
}

async function collect(gen: AsyncGenerator<StreamEvent>) {
  const out: StreamEvent[] = [];
  for await (const e of gen) out.push(e);
  return out;
}

const req = { provider: "anthropic" as const, model: "m", temperature: 0.2, maxOutputTokens: 100, system: "sys", messages: [{ role: "user" as const, content: "hi" }] };

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("AI providers", () => {
  it("parses Anthropic streaming events and usage", async () => {
    vi.stubEnv("ANTHROPIC_API_KEY", "k");
    const fetchMock = vi.fn().mockResolvedValue(
      sse([
        JSON.stringify({ type: "message_start", message: { usage: { input_tokens: 12 } } }),
        JSON.stringify({ type: "content_block_delta", delta: { type: "text_delta", text: "Hel" } }),
        JSON.stringify({ type: "content_block_delta", delta: { type: "text_delta", text: "lo" } }),
        JSON.stringify({ type: "message_delta", usage: { output_tokens: 3 } }),
      ])
    );
    vi.stubGlobal("fetch", fetchMock);
    const out = await collect(providers.anthropic.stream(req));
    expect(out.filter((e) => e.type === "text").map((e) => (e as { text: string }).text).join("")).toBe("Hello");
    expect(out.at(-1)).toEqual({ type: "usage", usage: { inputTokens: 12, outputTokens: 3 } });
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.system).toBe("sys");
    expect(fetchMock.mock.calls[0][1].headers["x-api-key"]).toBe("k");
  });

  it("parses OpenAI streaming chunks and stops at [DONE]", async () => {
    vi.stubEnv("OPENAI_API_KEY", "k");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        sse([
          JSON.stringify({ choices: [{ delta: { content: "A" } }] }),
          JSON.stringify({ choices: [{ delta: { content: "B" } }] }),
          JSON.stringify({ choices: [], usage: { prompt_tokens: 5, completion_tokens: 2 } }),
          "[DONE]",
        ])
      )
    );
    const out = await collect(providers.openai.stream(req));
    expect(out).toEqual([
      { type: "text", text: "A" },
      { type: "text", text: "B" },
      { type: "usage", usage: { inputTokens: 5, outputTokens: 2 } },
    ]);
  });

  it("parses Gemini SSE and maps assistant role to model", async () => {
    vi.stubEnv("GOOGLE_AI_API_KEY", "k");
    const fetchMock = vi.fn().mockResolvedValue(sse([JSON.stringify({ candidates: [{ content: { parts: [{ text: "Hi" }] } }], usageMetadata: { promptTokenCount: 4, candidatesTokenCount: 1 } })]));
    vi.stubGlobal("fetch", fetchMock);
    const out = await collect(providers.google.stream({ ...req, messages: [{ role: "user", content: "q" }, { role: "assistant", content: "a" }, { role: "user", content: "q2" }] }));
    expect(out[0]).toEqual({ type: "text", text: "Hi" });
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.contents.map((c: { role: string }) => c.role)).toEqual(["user", "model", "user"]);
  });

  it("maps 429 to a friendly rate-limit error without leaking provider bodies", async () => {
    vi.stubEnv("ANTHROPIC_API_KEY", "k");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("secret internal detail", { status: 429 })));
    const err = vi.spyOn(console, "error").mockImplementation(() => {});
    await expect(collect(providers.anthropic.stream(req))).rejects.toMatchObject({ code: "rate_limited", status: 429 });
    await expect(collect(providers.anthropic.stream(req))).rejects.not.toThrow(/secret/);
    err.mockRestore();
  });

  it("falls back to any configured provider", () => {
    vi.stubEnv("ANTHROPIC_API_KEY", "");
    vi.stubEnv("OPENAI_API_KEY", "k");
    vi.stubEnv("GOOGLE_AI_API_KEY", "");
    expect(resolveProvider("anthropic")?.id).toBe("openai");
    vi.stubEnv("OPENAI_API_KEY", "");
    expect(resolveProvider("anthropic")).toBeNull();
  });
});
