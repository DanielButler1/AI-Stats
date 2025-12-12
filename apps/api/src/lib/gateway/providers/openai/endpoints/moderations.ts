// lib/gateway/providers/openai/endpoints/moderations.ts
import type { ProviderExecuteArgs, AdapterResult } from "../../types";
import { ModerationsSchema, type ModerationsRequest } from "../../../../schemas";
import { buildAdapterPayload } from "../../utils";
import { getBindings } from "@/runtime/env";
import { computeBill } from "../../../pricing/engine";
import { resolveProviderKey, type ResolvedKey } from "../../keys";

const BASE_URL = "https://api.openai.com";

async function resolveApiKey(args: ProviderExecuteArgs): Promise<ResolvedKey> {
    return resolveProviderKey(args, () => getBindings().OPENAI_API_KEY);
}

function baseHeaders(key: string) {
    return {
        "Authorization": `Bearer ${key}`,
        "Content-Type": "application/json",
    };
}

function mapGatewayToOpenAIModerations(body: ModerationsRequest) {
    return {
        input: body.input,
        model: body.model,
        // meta is only for gateway response shaping; not forwarded upstream
    };
}

type ModerationContext = {
    requestId?: string | null;
    providerId: string;
    model: string;
    generationMs: number | null;
    latencyMs: number | null;
};

function mapOpenAIToGatewayModerations(json: any, ctx: ModerationContext): any {
    return {
        ...json,
        // Always expose the gateway-generated id; keep the upstream id in nativeResponseId
        id: ctx.requestId ?? json?.id ?? null,
        model: ctx.model ?? json?.model,
        provider: ctx.providerId,
        meta: {
            generation_ms: ctx.generationMs,
            latency_ms: ctx.latencyMs,
        },
    };
}

export async function exec(args: ProviderExecuteArgs): Promise<AdapterResult> {
    const keyInfo = await resolveApiKey(args);
    const key = keyInfo.key;
    const { adapterPayload } = buildAdapterPayload(ModerationsSchema, args.body, ["meta"]);
    const modifiedBody: ModerationsRequest = {
        ...adapterPayload,
        model: args.providerModelSlug || args.model,
    };
    const req = mapGatewayToOpenAIModerations(modifiedBody);
    const startedAt = Date.now();
    const res = await fetch(`${BASE_URL}/v1/moderations`, {
        method: "POST",
        headers: baseHeaders(key),
        body: JSON.stringify(req),
    });
    const latencyMs = Date.now() - startedAt;
    const generationHeader = res.headers.get("openai-processing-ms");
    const generationMs = Number.isFinite(Number(generationHeader)) ? Number(generationHeader) : latencyMs;
    const bill = {
        cost_cents: 0,
        currency: "USD" as const,
        usage: undefined as any,
        upstream_id: res.headers.get("x-request-id"),
        finish_reason: null,
    };
    const json = await res.clone().json().catch(() => null);
    const normalized = json
        ? mapOpenAIToGatewayModerations(json, {
            requestId: args.meta.requestId,
            providerId: args.providerId,
            model: args.model,
            generationMs: generationMs ?? null,
            latencyMs: latencyMs ?? null,
        })
        : undefined;
    
    // Calculate pricing
    if (normalized?.usage) {
        const pricedUsage = computeBill(normalized.usage, args.pricingCard);
        bill.cost_cents = pricedUsage.pricing.total_cents;
        bill.currency = pricedUsage.pricing.currency;
        bill.usage = pricedUsage;
    }
    
    return { kind: "completed", upstream: res, bill, normalized, keySource: keyInfo.source, byokKeyId: keyInfo.byokId };
}
