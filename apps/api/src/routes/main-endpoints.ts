import type { Hono } from "hono";
import type { GatewayBindings } from "@/runtime/env";
import { makeEndpointHandler } from "@/lib/main-endpoints/route-factory";
import { ChatCompletionsSchema, ModerationsSchema, ImagesGenerationSchema, VideoGenerationSchema } from "@gateway/schemas";
import { withRuntime } from "./utils";

const chatHandler = makeEndpointHandler({ endpoint: "chat.completions", schema: ChatCompletionsSchema });
const moderationHandler = makeEndpointHandler({ endpoint: "moderations", schema: ModerationsSchema });
const imagesHandler = makeEndpointHandler({ endpoint: "images.generations", schema: ImagesGenerationSchema });
const videoHandler = makeEndpointHandler({ endpoint: "video.generation", schema: VideoGenerationSchema });

export function registerMainEndpoints(app: Hono<{ Bindings: GatewayBindings }>) {
    app.post("/v1/chat/completions", withRuntime(chatHandler));
    app.post("/v1/moderations", withRuntime(moderationHandler));
    app.post("/v1/images/generations", withRuntime(imagesHandler));
    app.post("/v1/video/generation", withRuntime(videoHandler));
}
