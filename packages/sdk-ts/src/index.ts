import { Configuration, DefaultApi, ModelId } from "./gen/index.js";
import type {
  ChatCompletionsRequest,
  ChatCompletionsResponse,
  ImagesGenerationRequest as ImageGenerationRequest,
  ImagesGenerationResponse as ImageGenerationResponse,
  ModerationsRequest as ModerationRequest,
  ModerationsResponse as ModerationResponse,
  VideoGenerationRequest,
  VideoGenerationResponse,
  ChatMessage,
  ResponsesRequest,
  ResponsesResponse,
  AudioSpeechRequest,
  AudioTranscriptionResponse,
  BatchRequest,
  BatchResponse,
  FileResponse as FileObject,
  ListFilesResponse as FileListResponse,
  Healthz200Response as HealthzGet200Response,
  ListModels200Response as ModelListResponse,
  AudioTranslationResponse,
} from "./gen";
import type {
  CreateBatchRequest,
  CreateImageRequest,
  CreateImageEditRequest,
  UploadFileRequest,
  CreateTranscriptionRequest,
  CreateTranslationRequest,
  CreateEmbeddingRequest,
  ListModelsRequest,
  RetrieveBatchRequest,
  RetrieveFileRequest,
} from "./gen/apis/DefaultApi";

type AudioTranscriptionRequest = CreateTranscriptionRequest;
type AudioTranslationRequest = CreateTranslationRequest;

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
  ModelListResponse,
  ResponsesRequest,
  ResponsesResponse,
  AudioSpeechRequest,
  AudioTranscriptionRequest,
  AudioTranscriptionResponse,
  AudioTranslationRequest,
  AudioTranslationResponse,
  BatchRequest,
  BatchResponse,
  FileObject,
  FileListResponse,
  HealthzGet200Response,
};

export class AIStats {
  private readonly api: DefaultApi;
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

    this.api = new DefaultApi(configuration);
  }

  async generateText(req: ChatCompletionsParams): Promise<ChatCompletionsResponse> {
    const { model, messages, ...rest } = req;
    if (!MODEL_ID_SET.has(model)) {
      throw new Error(`Unknown model id "${model}". Import and use a value from MODEL_IDS for autocomplete.`);
    }

    const normalizedMessages = messages.map(normalizeMessage);
    const payload = { ...rest, model, messages: normalizedMessages };

    try {
      const response = await this.api.createChatCompletionRaw({
        chatCompletionsRequest: payload,
      });
      const cloned = response.raw.clone();
      const responseBody = await cloned.json().catch(() => undefined);
      const value = await response.value();
      return value;
    } catch (err) {
      throw err;
    }
  }

  async *streamText(req: ChatCompletionsParams): AsyncGenerator<string> {
    const normalizedMessages = req.messages.map(normalizeMessage);
    const payload = { ...req, stream: true, messages: normalizedMessages };

    let eventCount = 0;
    let status: number | undefined;
    let responseHeaders: Record<string, string> | undefined;
    const body = JSON.stringify(payload);
    let reader: ReadableStreamDefaultReader<Uint8Array> | null = null;
    const decoder = new TextDecoder();
    let buffer = "";

    try {
      const res = await this.fetchImpl(`${this.basePath}/chat/completions`, {
        method: "POST",
        headers: {
          ...this.headers,
          "Content-Type": "application/json",
        },
        body,
      });
      status = res.status;
      responseHeaders = headersToRecord(res.headers);
      if (!res.ok || !res.body) {
        const text = await res.text();
        throw new Error(`Stream request failed: ${res.status} ${res.statusText} - ${text}`);
      }

      reader = res.body.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        let idx;
        while ((idx = buffer.indexOf("\n")) !== -1) {
          const line = buffer.slice(0, idx).trim();
          buffer = buffer.slice(idx + 1);
          if (!line) continue;
          eventCount += 1;
          yield line;
        }
      }
      if (buffer.trim()) {
        eventCount += 1;
        yield buffer.trim();
      }
    } catch (err) {
      throw err;
    } finally {
      if (reader) {
        reader.releaseLock();
      }
    }
  }

  generateImage(req: ImageGenerationRequest) {
    return this.api.createImage({ imagesGenerationRequest: req } satisfies CreateImageRequest);
  }

  generateImageEdit(req: ImageGenerationRequest) {
    return this.api.createImageEdit({ ...(req as any) } satisfies CreateImageEditRequest);
  }

  async generateEmbedding(body: Record<string, unknown>): Promise<any> {
    return this.api.createEmbedding({ embeddingsRequest: body as any } satisfies CreateEmbeddingRequest);
  }

  generateModeration(req: ModerationRequest): Promise<ModerationResponse> {
    return this.api.createModeration({ moderationsRequest: req });
  }

  generateVideo(req: VideoGenerationRequest): Promise<VideoGenerationResponse> {
    return this.api.createVideo({ videoGenerationRequest: req });
  }

  async generateTranscription(body: AudioTranscriptionRequest): Promise<AudioTranscriptionResponse> {
    return this.api.createTranscription(body);
  }

  async generateSpeech(body: AudioSpeechRequest): Promise<Blob> {
    return this.api.createSpeech({ audioSpeechRequest: body });
  }

  async generateTranslation(body: AudioTranslationRequest): Promise<AudioTranslationResponse> {
    return this.api.createTranslation(body);
  }

  async generateResponse(req: ResponsesRequest): Promise<ResponsesResponse> {
    try {
      const response = await this.api.createResponseRaw({ responsesRequest: req });
      const cloned = response.raw.clone();
      const responseBody = await cloned.json().catch(() => undefined);
      const value = await response.value();
      return value;
    } catch (err) {
      throw err;
    }
  }

  async *streamResponse(req: ResponsesRequest): AsyncGenerator<string> {
    const payload = { ...req, stream: true };
    const body = JSON.stringify(payload);

    let status: number | undefined;
    let responseHeaders: Record<string, string> | undefined;
    let eventCount = 0;

    try {
      const res = await this.fetchImpl(`${this.basePath}/responses`, {
        method: "POST",
        headers: { ...this.headers, "Content-Type": "application/json" },
        body,
      });
      status = res.status;
      responseHeaders = headersToRecord(res.headers);
      if (!res.ok || !res.body) {
        const text = await res.text();
        throw new Error(`Stream request failed: ${res.status} ${res.statusText} - ${text}`);
      }
      for await (const line of readSseLines(res)) {
        eventCount += 1;
        yield line;
      }
    } catch (err) {
      throw err;
    }
  }

  createBatch(req: BatchRequest): Promise<BatchResponse> {
    return this.api.createBatch({ batchRequest: req } as CreateBatchRequest);
  }

  getBatch(batchId: string): Promise<BatchResponse> {
    return this.api.retrieveBatch({ batchId } as RetrieveBatchRequest);
  }

  listFiles(): Promise<FileListResponse> {
    return this.api.listFiles();
  }

  getFile(fileId: string): Promise<FileObject> {
    return this.api.retrieveFile({ fileId } as RetrieveFileRequest);
  }

  /**
   * Upload a file using multipart/form-data. Accepts a File/Blob/BufferSource in the `file` field.
   */
  uploadFile(params: Omit<UploadFileRequest, "file"> & { file: Blob | File | BufferSource | string }): Promise<FileObject> {
    const { purpose, file } = params;
    return this.api.uploadFile({ purpose: purpose as any, file: file as any } as UploadFileRequest);
  }

  getModels(params: ListModelsRequest = {}): Promise<ModelListResponse> {
    return this.api.listModels(params);
  }

  getHealth(): Promise<HealthzGet200Response> {
    return this.api.healthz();
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

function headersToRecord(headers?: Headers): Record<string, string> {
  if (!headers) return {};
  const result: Record<string, string> = {};
  headers.forEach((value, key) => {
    result[key] = value;
  });
  return result;
}

async function* readSseLines(res: Response): AsyncGenerator<string> {
  const reader = res.body!.getReader();
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
