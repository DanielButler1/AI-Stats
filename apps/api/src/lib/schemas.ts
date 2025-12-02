import { z } from "zod";
import type { Endpoint } from "./types";

// Batch schema
export const BatchSchema = z.object({
    requests: z.array(z.any()).min(1), // Each item should be a valid request for the target endpoint
    endpoint: z.string().min(1), // The endpoint to batch (e.g., "chat.completions")
});
export type BatchRequest = z.infer<typeof BatchSchema>;

// Embeddings schema
export const EmbeddingsSchema = z.object({
    model: z.string().min(1),
    input: z.union([
        z.string(),
        z.array(z.string())
    ]),
    encoding_format: z.string().optional(),
    dimensions: z.number().int().positive().optional(),
    user: z.string().optional(),
});
export type EmbeddingsRequest = z.infer<typeof EmbeddingsSchema>;

// Chat Completions schema
const TextPartSchema = z.object({
    type: z.literal("text"),
    text: z.string(),
});

const ImageUrlPartSchema = z.object({
    type: z.literal("image_url"),
    image_url: z.object({
        url: z.string().url(),
    }),
});

const InputAudioPartSchema = z.object({
    type: z.literal("input_audio"),
    input_audio: z.object({
        data: z.string(),
        format: z.enum(["wav", "mp3", "flac", "m4a", "ogg", "pcm16", "pcm24"]),
    }),
});

const InputVideoPartSchema = z.object({
    type: z.literal("input_video"),
    video_url: z.string().url(),
});

const ToolCallPartSchema = z.object({
    type: z.literal("tool_call"),
    id: z.string(),
    function: z.object({
        name: z.string(),
        arguments: z.string(),
    }),
});

const MessageContentPartSchema = z.union([
    TextPartSchema,
    ImageUrlPartSchema,
    InputAudioPartSchema,
    InputVideoPartSchema,
    ToolCallPartSchema,
]);

const MessageContentSchema = z.union([
    z.string(),
    z.array(MessageContentPartSchema),
]);

const ResponseFormatSchema = z.union([
    z.string(),
    z.object({
        type: z.string(),
        schema: z.any().optional(),
    }),
]);

const ToolCallSchema = z.object({
    id: z.string(),
    type: z.literal("function"),
    function: z.object({
        name: z.string(),
        arguments: z.string(),
        description: z.string().optional(),
        parameters: z.any().optional(),
    }),
});

export const ChatCompletionsSchema = z.object({
    model: z.string().min(1),
    system: z.string().optional(),
    messages: z.array(
        z.discriminatedUnion("role", [
            z.object({
                role: z.literal("system"),
                content: MessageContentSchema,
                name: z.string().optional(),
            }),
            z.object({
                role: z.literal("user"),
                content: MessageContentSchema,
                name: z.string().optional(),
            }),
            z.object({
                role: z.literal("assistant"),
                content: MessageContentSchema.optional(),
                name: z.string().optional(),
                tool_calls: z.array(ToolCallSchema).optional(),
            }),
            z.object({
                role: z.literal("tool"),
                content: MessageContentSchema,
                name: z.string().optional(),
                tool_call_id: z.string(),
            }),
        ])
    ).min(1),
    reasoning: z
        .union([
            z.object({
                effort: z.enum(["none", "minimal", "low", "medium", "high"]).optional().default("medium"),
                summary: z.enum(["auto", "concise", "detailed"]).optional().default("auto"),
            }),
            z.array(
                z.object({
                    effort: z.enum(["none", "minimal", "low", "medium", "high"]).optional().default("medium"),
                    summary: z.enum(["auto", "concise", "detailed"]).optional().default("auto"),
                })
            ),
        ])
        .optional()
        .transform((value) => {
            if (!value) return undefined;
            if (Array.isArray(value)) {
                return value[0] ?? undefined;
            }
            return value;
        }),
    frequency_penalty: z.number().min(-2).max(2).optional(),
    logit_bias: z.record(z.number()).optional(),
    max_output_tokens: z.number().int().positive().optional(),
    meta: z.boolean().optional().default(false),
    presence_penalty: z.number().min(-2).max(2).optional(),
    seed: z.number().int().min(-9223372036854776000).max(9223372036854776000).optional(),
    stream: z.boolean().optional().default(false),
    temperature: z.number().min(0).max(2).optional().default(1),

    // Tools
    tools: z.array(z.object({
        type: z.literal("function")
    })).optional(),

    max_tool_calls: z.number().int().positive().optional(),
    parallel_tool_calls: z.boolean().optional().default(true),
    tool_choice: z.union([z.string(), z.record(z.any())]).optional(),

    top_k: z.number().int().positive().optional(),
    logprobs: z.boolean().optional().default(false),
    top_logprobs: z.number().int().min(0).max(20).optional(),
    top_p: z.number().min(0).max(1).optional(),
    response_format: ResponseFormatSchema.optional(),
    usage: z.boolean().optional(),

    // This is used as the safety identifer/userid across providers
    user_id: z.string().optional(),

    // Will be implemented in future, for now, standard tier only
    service_tier: z.enum(["flex", "standard", "priority"]).optional().default("standard"),
});

export type ChatCompletionsRequest = z.infer<typeof ChatCompletionsSchema>;

// Images Generation schema
export const ImagesGenerationSchema = z.object({
    model: z.string().min(1),
    prompt: z.string().min(1),
    size: z.string().optional(),
    n: z.number().int().min(1).max(10).optional(),
    quality: z.string().optional(),
    response_format: z.string().optional(),
    style: z.string().optional(),
    user: z.string().optional(),
});
export type ImagesGenerationRequest = z.infer<typeof ImagesGenerationSchema>;

// Moderations schema
export const ModerationsSchema = z.object({
    model: z.string().min(1),
    meta: z.boolean().optional().default(false),
    input: z.union([
        z.string(),
        z.array(
            z.discriminatedUnion("type", [
                z.object({
                    type: z.literal("text"),
                    text: z.string(),
                }),
                z.object({
                    type: z.literal("image_url"),
                    image_url: z.object({
                        url: z.string().refine(
                            (val) => {
                                // Accepts http(s) URLs or data URLs
                                return /^https?:\/\//.test(val) || /^data:image\/(png|jpeg|jpg|gif|webp);base64,/.test(val);
                            },
                            {
                                message: "Must be a valid image URL or data URL (base64-encoded image)",
                            }
                        ),
                    })
                })
            ])
        )
    ]),
});
export type ModerationsRequest = z.infer<typeof ModerationsSchema>;

// Audio Speech schema
export const AudioSpeechSchema = z.object({
    model: z.string().min(1),
    input: z.string().min(1),
    voice: z.string().optional(),
    format: z.enum(["mp3", "wav", "ogg", "aac"]).optional(),
});
export type AudioSpeechRequest = z.infer<typeof AudioSpeechSchema>;

// Audio Transcription schema
export const AudioTranscriptionSchema = z.object({
    model: z.string().min(1),
    audio_url: z.string().url().optional(),
    audio_b64: z.string().optional(),
    language: z.string().optional(),
});
export type AudioTranscriptionRequest = z.infer<typeof AudioTranscriptionSchema>;

// Video Generation schema
export const VideoGenerationSchema = z.object({
    model: z.string().min(1),
    prompt: z.string().min(1),
    duration: z.number().int().min(1).max(120).optional(),
    ratio: z.string().optional(),
});
export type VideoGenerationRequest = z.infer<typeof VideoGenerationSchema>;

// Function to get schema for a given endpoint
export function schemaFor(endpoint: Endpoint) {
    switch (endpoint) {
        case "chat.completions": return ChatCompletionsSchema;
        case "moderations": return ModerationsSchema;
        case "audio.speech": return AudioSpeechSchema;
        case "audio.transcription": return AudioTranscriptionSchema;
        case "images.generations": return ImagesGenerationSchema;
        case "video.generation": return VideoGenerationSchema;
        case "batch": return BatchSchema;
        case "embeddings": return EmbeddingsSchema;
    }
}
