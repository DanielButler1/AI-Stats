// lib/gateway/providers/x-ai/endpoints/chat.ts
import type { ProviderExecuteArgs, AdapterResult } from "../../types";
import { ChatCompletionsSchema, type ChatCompletionsRequest } from "../../../../schemas";
import { sanitizePayload } from "../../utils";
import { getBindings } from "@/runtime/env";
import { loadByokKey } from "../../byok";
import { computeBill } from "../../../pricing/engine";

const BASE_URL = "https://api.x.ai";

type ResolvedKey = {
    key: string;
    source: "gateway" | "byok";
    byokId: string | null;
};

async function resolveApiKey(args: ProviderExecuteArgs): Promise<ResolvedKey> {
    const byok = await loadByokKey({
        teamId: args.teamId,
        providerId: args.providerId,
        metaList: args.byokMeta,
    });
    if (byok) {
        return { key: byok.key, source: "byok", byokId: byok.keyId };
    }
    const fallback = getBindings().XAI_API_KEY;
    if (!fallback) throw new Error("xai_key_missing");
    return { key: fallback, source: "gateway", byokId: null };
}

function baseHeaders(key: string) {
    return {
        "Authorization": `Bearer ${key}`,
        "Content-Type": "application/json",
    };
}

function mapGatewayToXAIChat(body: ChatCompletionsRequest) {
    const maxTokens = body.max_output_tokens;
    return {
        model: body.model,
        messages: body.messages,
        max_tokens: maxTokens,
        temperature: body.temperature,
        top_p: body.top_p,
        stream: Boolean(body.stream),
        tools: body.tools,
    };
}

function mapXAIToGatewayChat(json: any): any {
    const choices = json.choices?.map((choice: any) => ({
        index: choice.index,
        message: {
            role: "assistant",
            content: choice.message?.content || "",
        },
        finish_reason: choice.finish_reason || "stop",
        reasoning: false, // xAI doesn't separate reasoning in response
    })) || [];

    return {
        nativeResponseId: json.id,
        created: json.created,
        model: json.model,
        provider: "x-ai",
        choices,
        usage: json.usage ? {
            input_text_tokens: json.usage.prompt_tokens || 0,
            output_text_tokens: json.usage.completion_tokens || 0,
            total_tokens: json.usage.total_tokens || 0,
        } : undefined,
    };
}

export async function exec(args: ProviderExecuteArgs): Promise<AdapterResult> {
    const keyInfo = await resolveApiKey(args);
    const key = keyInfo.key;
    const sanitizedBody = sanitizePayload(ChatCompletionsSchema, args.body);
    const modifiedBody: ChatCompletionsRequest = {
        ...sanitizedBody,
        model: args.providerModelSlug || args.model,
    };
    const req = mapGatewayToXAIChat(modifiedBody);
    const res = await fetch(`${BASE_URL}/v1/chat/completions`, {
        method: "POST",
        headers: baseHeaders(key),
        body: JSON.stringify(req),
    });
    const bill = {
        cost_cents: 0,
        currency: "USD" as const,
        usage: undefined as any,
        upstream_id: res.headers.get("x-request-id"),
        finish_reason: null,
    };
    const json = await res.clone().json().catch(() => null);
    const normalized = json ? mapXAIToGatewayChat(json) : undefined;
    
    // Calculate pricing
    if (normalized?.usage) {
        const pricedUsage = computeBill(normalized.usage, args.pricingCard);
        bill.cost_cents = pricedUsage.pricing.total_cents;
        bill.currency = pricedUsage.pricing.currency;
        bill.usage = pricedUsage;
    }
    
    return { kind: "completed", upstream: res, bill, normalized, keySource: keyInfo.source, byokKeyId: keyInfo.byokId };
}
