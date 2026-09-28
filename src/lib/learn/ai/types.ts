export type AIProviderId = "anthropic" | "openai" | "google";

export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface ModelConfig {
  provider: AIProviderId;
  model: string;
  temperature: number;
  maxOutputTokens: number;
}

export interface ChatRequest extends ModelConfig {
  system: string;
  messages: ChatMessage[];
  signal?: AbortSignal;
}

export interface Usage {
  inputTokens: number;
  outputTokens: number;
}

/** A single streamed event from any provider, normalised. */
export type StreamEvent =
  | { type: "text"; text: string }
  | { type: "usage"; usage: Usage }
  | { type: "error"; message: string };

export interface AIProvider {
  id: AIProviderId;
  /** True when the server has credentials for this provider. */
  isConfigured(): boolean;
  stream(req: ChatRequest): AsyncGenerator<StreamEvent>;
}

export class AIError extends Error {
  constructor(
    message: string,
    readonly code:
      | "not_configured"
      | "rate_limited"
      | "provider_error"
      | "bad_output"
      | "quota_exceeded" = "provider_error",
    readonly status = 500
  ) {
    super(message);
    this.name = "AIError";
  }
}
