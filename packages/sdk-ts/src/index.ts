import {
  Configuration,
  CompletionsApi,
  ImagesApi,
  ModerationsApi,
  VideoApi,
  AnalyticsApi,
  ModelId,
} from "./gen";
import { ModelsApi } from "./gen/apis/ModelsApi";
import type {
  ChatCompletionsRequest,
  ChatCompletionsResponse,
  ImageGenerationRequest,
  ImageGenerationResponse,
  ModerationRequest,
  ModerationResponse,
  VideoGenerationRequest,
  VideoGenerationResponse,
  ModerationsPostRequest,
  ChatMessage,
  GatewayHealthResponse,
  ModelListResponse,
} from "./gen";

type Options = {
  apiKey: string;
  baseUrl?: string;
  timeoutMs?: number;
};

type ModelIdEnumValues = (typeof ModelId)[keyof typeof ModelId];
export type ModelIdLiteral = `${ModelIdEnumValues}`;
export const MODEL_IDS = Object.values(ModelId) as ModelIdLiteral[];
export const MODEL_ID_SET = new Set<ModelIdLiteral>(MODEL_IDS);

type MessageContentPartInput =
  | Record<string, unknown>
  | string;

type ChatMessageInput =
  | { role: "system"; content: string | MessageContentPartInput[]; name?: string }
  | { role: "user"; content: string | MessageContentPartInput[]; name?: string }
  | { role: "assistant"; content?: string | MessageContentPartInput[]; name?: string; tool_calls?: Array<Record<string, unknown>> }
  | { role: "tool"; content: string | MessageContentPartInput[]; name?: string; tool_call_id: string };

export type ChatCompletionsParams = Omit<ChatCompletionsRequest, "model" | "messages"> & {
  model: ModelIdLiteral;
  messages: ChatMessageInput[];
};

const DEFAULT_BASE_URL = "https://api.ai-stats.phaseo.app/v1";

export { ModelId };
export type {
  ChatCompletionsRequest,
  ChatCompletionsResponse,
  ImageGenerationRequest,
  ImageGenerationResponse,
  ModerationRequest,
  ModerationResponse,
  VideoGenerationRequest,
  VideoGenerationResponse,
};

export class AIStats {
  private readonly chatApi: CompletionsApi;
  private readonly imagesApi: ImagesApi;
  private readonly moderationsApi: ModerationsApi;
  private readonly videoApi: VideoApi;
  private readonly modelsApi: ModelsApi;
  private readonly analyticsApi: AnalyticsApi;
  private readonly basePath: string;
  private readonly fetchImpl: typeof fetch;
  private readonly headers: Record<string, string>;
  private readonly timeoutMs: number;

  constructor(private readonly opts: Options) {
    this.fetchImpl = globalThis.fetch;
    if (!this.fetchImpl) {
      throw new Error("Global fetch is not available. Provide a fetch implementation.");
    }

    this.basePath = (opts.baseUrl ?? DEFAULT_BASE_URL).replace(/\/+$/, "");
    this.timeoutMs = opts.timeoutMs ?? 60_000;
    this.headers = { Authorization: `Bearer ${opts.apiKey}` };

    const configuration = new Configuration({
      basePath: this.basePath,
      headers: this.headers,
      fetchApi: (input: RequestInfo, init?: RequestInit) => {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), this.timeoutMs);
        return this.fetchImpl(input, { ...(init ?? {}), signal: controller.signal }).finally(() => {
          clearTimeout(timeout);
        });
      },
    });

    this.chatApi = new CompletionsApi(configuration);
    this.imagesApi = new ImagesApi(configuration);
    this.moderationsApi = new ModerationsApi(configuration);
    this.videoApi = new VideoApi(configuration);
    this.modelsApi = new ModelsApi(configuration);
    this.analyticsApi = new AnalyticsApi(configuration);
  }

  async generateText(req: ChatCompletionsParams): Promise<ChatCompletionsResponse> {
    const { model, messages, ...rest } = req;
    if (!MODEL_ID_SET.has(model)) {
      throw new Error(`Unknown model id "${model}". Import and use a value from MODEL_IDS for autocomplete.`);
    }

    const response = await this.chatApi.createChatCompletion({
      chatCompletionsRequest: { ...rest, model, messages: messages.map(normalizeMessage) },
    });
    return response;
  }

  async *streamText(req: ChatCompletionsParams): AsyncGenerator<string> {
    const body = JSON.stringify({ ...req, stream: true, messages: req.messages.map(normalizeMessage) });
    const res = await this.fetchImpl(`${this.basePath}/chat/completions`, {
      method: "POST",
      headers: {
        ...this.headers,
        "Content-Type": "application/json",
      },
      body,
    });
    if (!res.ok || !res.body) {
      const text = await res.text();
      throw new Error(`Stream request failed: ${res.status} ${res.statusText} - ${text}`);
    }
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        let idx;
        while ((idx = buffer.indexOf("\n")) !== -1) {
          const line = buffer.slice(0, idx).trim();
          buffer = buffer.slice(idx + 1);
          if (!line) continue;
          yield line;
        }
      }
      if (buffer.trim()) {
        yield buffer.trim();
      }
    } finally {
      reader.releaseLock();
    }
  }

  generateImage(req: ImageGenerationRequest) {
    return this.imagesApi.imagesGenerationsPost({ imageGenerationRequest: req });
  }

  async generateEmbedding(body: Record<string, unknown>): Promise<any> {
    const res = await this.fetchImpl(`${this.basePath}/embeddings`, {
      method: "POST",
      headers: { ...this.headers, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Embedding failed: ${res.status} ${res.statusText} - ${text}`);
    }
    return res.json();
  }

  generateModeration(req: ModerationRequest): Promise<ModerationResponse> {
    const payload: ModerationsPostRequest = { moderationRequest: req };
    return this.moderationsApi.moderationsPost(payload);
  }

  generateVideo(req: VideoGenerationRequest): Promise<VideoGenerationResponse> {
    return this.videoApi.videoGenerationPost({ videoGenerationRequest: req });
  }

  async generateTranscription(body: Record<string, unknown>): Promise<any> {
    const res = await this.fetchImpl(`${this.basePath}/audio/transcriptions`, {
      method: "POST",
      headers: { ...this.headers, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Transcription failed: ${res.status} ${res.statusText} - ${text}`);
    }
    return res.json();
  }

  async generateSpeech(body: Record<string, unknown>): Promise<any> {
    const res = await this.fetchImpl(`${this.basePath}/audio/speech`, {
      method: "POST",
      headers: { ...this.headers, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Speech generation failed: ${res.status} ${res.statusText} - ${text}`);
    }
    return res.json();
  }

  getModels(params: Parameters<ModelsApi["modelsGet"]>[0] = {}): Promise<ModelListResponse> {
    return this.modelsApi.modelsGet(params);
  }

  getHealth(params: Parameters<AnalyticsApi["healthGet"]>[0] = {}): Promise<GatewayHealthResponse> {
    return this.analyticsApi.healthGet(params as any);
  }

  // GET /v1/generation?id=...
  async getGeneration(id: string): Promise<any> {
    const url = new URL(`${this.basePath}/generation`);
    url.searchParams.set("id", id);
    const res = await this.fetchImpl(url.toString(), { headers: this.headers });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`getGeneration failed: ${res.status} ${res.statusText} - ${text}`);
    }
    return res.json();
  }
}

function normalizeMessage(msg: ChatMessageInput): ChatMessage {
  return msg as unknown as ChatMessage;
}
