import "server-only";
import type { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import { fallbackModels, resolveProvider } from "./providers";
import { extractJSON } from "./json";
import { STRUCTURED_SYSTEM } from "./prompts";
import { AIError, type ChatMessage, type ModelConfig, type Usage } from "./types";

type DB = SupabaseClient<Database>;
export type AIFeature = "assistant" | "structured" | "interview";

const DEFAULTS: Record<AIFeature, Omit<ModelConfig, "model"> & { model?: string }> = {
  assistant: { provider: "anthropic", temperature: 0.4, maxOutputTokens: 2000 },
  structured: { provider: "anthropic", temperature: 0.2, maxOutputTokens: 3000 },
  interview: { provider: "anthropic", temperature: 0.5, maxOutputTokens: 1200 },
};

/** Model config: admin-managed row in learn_ai_config, else code defaults. */
export async function getModelConfig(supabase: DB, feature: AIFeature): Promise<ModelConfig> {
  const { data } = await supabase.from("learn_ai_config").select("*").eq("feature", feature).eq("is_active", true).maybeSingle();
  const d = DEFAULTS[feature];
  const provider = (data?.provider as ModelConfig["provider"]) ?? d.provider;
  return {
    provider,
    model: data?.model ?? d.model ?? fallbackModels[provider],
    temperature: data ? Number(data.temperature) : d.temperature,
    maxOutputTokens: data?.max_output_tokens ?? d.maxOutputTokens,
  };
}

export async function getPromptOverride(supabase: DB, key: string) {
  const { data } = await supabase.from("learn_prompts").select("system_prompt").eq("key", key).maybeSingle();
  return data?.system_prompt ?? null;
}

export function aiAvailable() {
  return resolveProvider("anthropic") !== null;
}

/** Throws AIError('quota_exceeded') when the learner is over their plan's daily AI allowance. */
export async function assertQuota(supabase: DB, dailyLimit: number) {
  const { data, error } = await supabase.rpc("learn_ai_calls_today");
  if (error) return; // never block learning on a metering read failure
  if ((data ?? 0) >= dailyLimit) {
    throw new AIError(
      `You've used today's ${dailyLimit} AI requests on your plan. They refresh over the next 24 hours, or you can upgrade for more.`,
      "quota_exceeded",
      429
    );
  }
}

async function logUsage(supabase: DB, userId: string, feature: string, cfg: ModelConfig, usage: Usage) {
  await supabase.from("learn_ai_usage").insert({
    user_id: userId,
    feature,
    provider: cfg.provider,
    model: cfg.model,
    input_tokens: usage.inputTokens,
    output_tokens: usage.outputTokens,
  });
}

interface RunArgs {
  supabase: DB;
  userId: string;
  feature: AIFeature;
  /** Label stored in usage for analytics, e.g. 'chat:study', 'ats'. */
  usageLabel: string;
  system: string;
  messages: ChatMessage[];
  signal?: AbortSignal;
  onFinish?: (fullText: string, cfg: ModelConfig) => Promise<void> | void;
}

/**
 * Streams plain text deltas as a web ReadableStream. Usage is logged and
 * `onFinish` runs after the stream completes (for persisting the reply).
 */
export async function streamText(args: RunArgs): Promise<ReadableStream<Uint8Array>> {
  const cfg = await getModelConfig(args.supabase, args.feature);
  const provider = resolveProvider(cfg.provider);
  if (!provider) throw new AIError("AI is not configured on this server yet.", "not_configured", 503);
  const effective = provider.id === cfg.provider ? cfg : { ...cfg, provider: provider.id, model: fallbackModels[provider.id] };

  const iterator = provider.stream({ ...effective, system: args.system, messages: args.messages, signal: args.signal });
  const encoder = new TextEncoder();
  let full = "";
  let usage: Usage = { inputTokens: 0, outputTokens: 0 };

  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      try {
        const { value, done } = await iterator.next();
        if (done) {
          await logUsage(args.supabase, args.userId, args.usageLabel, effective, usage);
          await args.onFinish?.(full, effective);
          controller.close();
          return;
        }
        if (value.type === "text") {
          full += value.text;
          controller.enqueue(encoder.encode(value.text));
        } else if (value.type === "usage") {
          usage = value.usage;
        } else if (value.type === "error") {
          throw new AIError(value.message);
        }
      } catch (err) {
        console.error("[ai:stream]", err);
        controller.enqueue(encoder.encode("\n\n_The response was interrupted. Please try again._"));
        if (full) await args.onFinish?.(full + "\n\n_(interrupted)_", effective);
        controller.close();
      }
    },
    async cancel() {
      await iterator.return?.(undefined);
    },
  });
}

/** Non-streaming completion that returns the full text. */
export async function completeText(args: Omit<RunArgs, "onFinish">): Promise<string> {
  const cfg = await getModelConfig(args.supabase, args.feature);
  const provider = resolveProvider(cfg.provider);
  if (!provider) throw new AIError("AI is not configured on this server yet.", "not_configured", 503);
  const effective = provider.id === cfg.provider ? cfg : { ...cfg, provider: provider.id, model: fallbackModels[provider.id] };
  let text = "";
  let usage: Usage = { inputTokens: 0, outputTokens: 0 };
  for await (const evt of provider.stream({ ...effective, system: args.system, messages: args.messages, signal: args.signal })) {
    if (evt.type === "text") text += evt.text;
    else if (evt.type === "usage") usage = evt.usage;
    else if (evt.type === "error") throw new AIError(evt.message);
  }
  await logUsage(args.supabase, args.userId, args.usageLabel, effective, usage);
  return text;
}

/**
 * Structured output validated with zod. Retries once with the validation
 * error fed back to the model, then fails loudly rather than returning junk.
 */
export async function completeJSON<S extends z.ZodTypeAny>(
  args: Omit<RunArgs, "onFinish" | "feature" | "system"> & { schema: S; instructions: string }
): Promise<z.infer<S>> {
  const messages: ChatMessage[] = [...args.messages];
  for (let attempt = 0; attempt < 2; attempt++) {
    const text = await completeText({
      ...args,
      feature: "structured",
      system: `${STRUCTURED_SYSTEM}\n\n${args.instructions}`,
      messages,
    });
    try {
      return args.schema.parse(extractJSON(text));
    } catch (err) {
      messages.push({ role: "assistant", content: text });
      messages.push({
        role: "user",
        content: `That did not match the required JSON shape (${err instanceof Error ? err.message.slice(0, 400) : "invalid"}). Return only the corrected JSON.`,
      });
    }
  }
  throw new AIError("The AI returned an unexpected format. Please try again.", "bad_output", 502);
}
