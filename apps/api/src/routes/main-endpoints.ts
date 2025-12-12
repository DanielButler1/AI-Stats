import type { Hono } from "hono";
import type { GatewayBindings } from "@/runtime/env";
import { makeEndpointHandler } from "@/lib/gateway/pipeline";
import { ChatCompletionsSchema, EmbeddingsSchema, ModerationsSchema, ResponsesSchema, AudioSpeechSchema, AudioTranscriptionSchema, AudioTranslationSchema, ImagesGenerationSchema, ImagesEditSchema, VideoGenerationSchema } from "@gateway/schemas";
import { withRuntime } from "./utils";

const chatHandler = makeEndpointHandler({ endpoint: "chat.completions", schema: ChatCompletionsSchema });
const responsesHandler = makeEndpointHandler({ endpoint: "responses", schema: ResponsesSchema });
const embeddingsHandler = makeEndpointHandler({ endpoint: "embeddings", schema: EmbeddingsSchema });
const moderationHandler = makeEndpointHandler({ endpoint: "moderations", schema: ModerationsSchema });
const audioSpeechHandler = makeEndpointHandler({ endpoint: "audio.speech", schema: AudioSpeechSchema });
const audioTranscriptionHandler = makeEndpointHandler({ endpoint: "audio.transcription", schema: AudioTranscriptionSchema });
const audioTranslationHandler = makeEndpointHandler({ endpoint: "audio.translations", schema: AudioTranslationSchema });
const imagesGenerationHandler = makeEndpointHandler({ endpoint: "images.generations", schema: ImagesGenerationSchema });
const imagesEditHandler = makeEndpointHandler({ endpoint: "images.edits", schema: ImagesEditSchema });
const videoHandler = makeEndpointHandler({ endpoint: "video.generation", schema: VideoGenerationSchema });

export function registerMainEndpoints(app: Hono<{ Bindings: GatewayBindings }>) {
    app.post("/v1/chat/completions", withRuntime(chatHandler));
    app.post("/v1/responses", withRuntime(responsesHandler));
    app.post("/v1/embeddings", withRuntime(embeddingsHandler));
    app.post("/v1/moderations", withRuntime(moderationHandler));
    app.post("/v1/audio/speech", withRuntime(audioSpeechHandler));
    app.post("/v1/audio/transcriptions", withRuntime(audioTranscriptionHandler));
    app.post("/v1/audio/translations", withRuntime(audioTranslationHandler));
    app.post("/v1/images/generations", withRuntime(imagesGenerationHandler));
    app.post("/v1/images/edits", withRuntime(imagesEditHandler));
    app.post("/v1/videos", withRuntime(videoHandler));
}
