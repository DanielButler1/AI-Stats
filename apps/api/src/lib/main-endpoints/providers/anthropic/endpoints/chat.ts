// lib/gateway/providers/anthropic/endpoints/chat.ts
import type { ProviderExecuteArgs, AdapterResult } from "../../types";
import { ChatCompletionsSchema, type ChatCompletionsRequest } from "../../../../schemas";
import { sanitizePayload } from "../../utils";
import { getBindings } from "@/runtime/env";
import { loadByokKey } from "../../byok";
import { computeBill } from "../../../pricing/engine";

const BASE_URL = "https://api.anthropic.com";

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
    const fallback = getBindings().ANTHROPIC_API_KEY;
    if (!fallback) throw new Error("anthropic_key_missing");
    return { key: fallback, source: "gateway", byokId: null };
}

function baseHeaders(key: string) {
    return {
        "x-api-key": key,
        "Content-Type": "application/json",
        "anthropic-version": "2023-06-01",
    };
}

function mapGatewayToAnthropicChat(body: ChatCompletionsRequest) {
    const messages = [];
    let system = body.system || "";
    const maxTokens = body.max_output_tokens;

    for (const m of body.messages || []) {
        if (m.role === "system") {
            system += (system ? "\n\n" : "") + (typeof m.content === "string" ? m.content : "");
        } else {
            messages.push({
                role: m.role === "assistant" ? "assistant" : "user",
                content: typeof m.content === "string" ? m.content : String(m.content || ""),
            });
        }
    }

    return {
        model: body.model,
        max_tokens: maxTokens,
        messages,
        system: system || undefined,
        temperature: body.temperature,
        top_p: body.top_p,
        top_k: body.top_k,
        stream: Boolean(body.stream),
        tools: body.tools,
    };
}

function mapAnthropicToGatewayChat(json: any): any {
    const content = json.content || [];
    let text = "";
    for (const block of content) {
        if (block.type === "text" && typeof block.text === "string") {
            text += block.text;
        }
    }

    const finishReasonMap: { [key: string]: string } = {
        "end_turn": "stop",
        "max_tokens": "length",
        "stop_sequence": "stop",
        "tool_use": "tool_calls",
    };

    const finish_reason = finishReasonMap[json.stop_reason] || "stop";

    return {
        nativeResponseId: json.id,
        created: Math.floor(Date.now() / 1000), // Anthropic doesn't provide created timestamp
        model: json.model,
        provider: "anthropic",
        choices: [{
            index: 0,
            message: {
                role: "assistant",
                content: text,
            },
            finish_reason,
            reasoning: false, // Anthropic doesn't separate reasoning
        }],
        usage: {
            input_text_tokens: json.usage?.input_tokens || 0,
            output_text_tokens: json.usage?.output_tokens || 0,
            total_tokens: (json.usage?.input_tokens || 0) + (json.usage?.output_tokens || 0),
        },
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
    const req = mapGatewayToAnthropicChat(modifiedBody);
    const res = await fetch(`${BASE_URL}/v1/messages`, {
        method: "POST",
        headers: baseHeaders(key),
        body: JSON.stringify(req),
    });
    const bill = {
        cost_cents: 0,
        currency: "USD" as const,
        usage: undefined as any,
        upstream_id: res.headers.get("request-id"),
        finish_reason: null,
    };
    const json = await res.clone().json().catch(() => null);
    const normalized = json ? mapAnthropicToGatewayChat(json) : undefined;
    
    // Calculate pricing
    if (normalized?.usage) {
        const pricedUsage = computeBill(normalized.usage, args.pricingCard);
        bill.cost_cents = pricedUsage.pricing.total_cents;
        bill.currency = pricedUsage.pricing.currency;
        bill.usage = pricedUsage;
    }
    
    return { kind: "completed", upstream: res, bill, normalized, keySource: keyInfo.source, byokKeyId: keyInfo.byokId };
}
