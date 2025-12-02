// src/lib/providers/x-ai/index.ts
import type { ProviderAdapter, ProviderExecuteArgs, AdapterResult } from "../types";
import * as chat from "./endpoints/chat";

export const XAIAdapter: ProviderAdapter = {
    name: "x-ai",
    async execute(args: ProviderExecuteArgs): Promise<AdapterResult> {
        switch (args.endpoint) {
            case "chat.completions":
                return chat.exec(args);
            default:
                throw new Error(`x-ai: unsupported endpoint ${args.endpoint}`);
        }
    },
};