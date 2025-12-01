// src/lib/gateway/providers/openai/index.ts
import type { ProviderAdapter, ProviderExecuteArgs, AdapterResult } from "../types";
import * as chat from "./endpoints/chat";
import * as moderations from "./endpoints/moderations";
import * as embeddings from "./endpoints/embeddings";
import * as images from "./endpoints/images";

export const OpenAIAdapter: ProviderAdapter = {
    name: "openai",
    async execute(args: ProviderExecuteArgs): Promise<AdapterResult> {
        switch (args.endpoint) {
            case "chat.completions": return chat.exec(args);        // non-stream for now
            case "moderations": return moderations.exec(args);
            case "embeddings": return embeddings.exec(args);
            case "images.generations": return images.exec(args);

            // Other endpoints to be implemented

            default: throw new Error(`OpenAI: unsupported endpoint ${args.endpoint}`);
        }
    },
};
