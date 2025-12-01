// lib/gateway/providers/index.ts
import type { Endpoint } from "../../types";
import type { ProviderAdapter } from "./types";
import { OpenAIAdapter } from "./openai/index";
import { GoogleAIStudioAdapter } from "./google-ai-studio/index";
import { AnthropicAdapter } from "./anthropic/index";
import { XAIAdapter } from "./x-ai/index";
import { getSupabaseAdmin } from "@/runtime/env";

// Adapter registry
const ADAPTERS: Record<string, ProviderAdapter> = {
    openai: OpenAIAdapter,
    "google-ai-studio": GoogleAIStudioAdapter,
    anthropic: AnthropicAdapter,
    "x-ai": XAIAdapter,
    // groq: GroqAdapter,
};

type CapabilityRow = { api_provider_id: string };

async function loadCapsFromDB(model: string, endpoint: Endpoint): Promise<CapabilityRow[]> {
    const supabase = getSupabaseAdmin();
    const nowISO = new Date().toISOString();
    const { data, error } = await supabase
        .from("data_api_provider_models")
        .select("api_provider_id")
        .eq("model_id", model)
        .eq("endpoint", endpoint)
        .eq("is_active_gateway", true)
        .or([
            "and(effective_from.is.null,effective_to.is.null)",
            `and(effective_from.is.null,effective_to.gt.${nowISO})`,
            `and(effective_from.lte.${nowISO},effective_to.is.null)`,
            `and(effective_from.lte.${nowISO},effective_to.gt.${nowISO})`,
        ].join(","));

    if (error) {
        console.error("Error loading capabilities from DB:", error);
        return [];
    }
    return (data ?? []) as CapabilityRow[];
}

export async function providersFor(model: string, endpoint: Endpoint): Promise<ProviderAdapter[]> {
    const rows = await loadCapsFromDB(model, endpoint);
    return rows
        .map(r => ADAPTERS[r.api_provider_id])
        .filter((a): a is ProviderAdapter => Boolean(a));
}

export function allProviderNames(): string[] {
    return Object.keys(ADAPTERS);
}

export function adapterById(providerId: string): ProviderAdapter | null {
    return ADAPTERS[providerId] ?? null;
}
