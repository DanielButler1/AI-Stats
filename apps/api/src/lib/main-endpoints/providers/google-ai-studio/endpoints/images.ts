// lib/gateway/providers/google-ai-studio/endpoints/images.ts
import type { ProviderExecuteArgs, AdapterResult } from "../../types";
import { ImagesGenerationSchema, type ImagesGenerationRequest } from "../../../../schemas";
import { sanitizePayload } from "../../utils";
import { getBindings } from "@/runtime/env";
import { loadByokKey } from "../../byok";
import { computeBill } from "../../../pricing/engine";

const BASE_URL = "https://generativelanguage.googleapis.com";

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
    const fallback = getBindings().GOOGLE_AI_STUDIO_API_KEY;
    if (!fallback) throw new Error("google_ai_studio_key_missing");
    return { key: fallback, source: "gateway", byokId: null };
}

function baseHeaders(key: string) {
    return {
        "Content-Type": "application/json",
    };
}

function mapGatewayToGoogleImages(body: ImagesGenerationRequest) {
    return {
        prompt: body.prompt,
        // Add other parameters as needed
    };
}

function mapGoogleToGatewayImages(json: any): any {
    // Placeholder mapping
    return {
        created: Date.now(),
        data: json.candidates?.map((c: any) => ({ url: c.output })) || [],
    };
}

export async function exec(args: ProviderExecuteArgs): Promise<AdapterResult> {
    const keyInfo = await resolveApiKey(args);
    const key = keyInfo.key;
    const sanitizedBody = sanitizePayload(ImagesGenerationSchema, args.body);
    const modifiedBody: ImagesGenerationRequest = {
        ...sanitizedBody,
        model: args.providerModelSlug || args.model,
    };
    const modelForUrl = args.providerModelSlug || args.model;
    const req = mapGatewayToGoogleImages(modifiedBody);
    const res = await fetch(`${BASE_URL}/v1beta/models/${modelForUrl}:generateImage?key=${key}`, {
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
    const normalized = json ? mapGoogleToGatewayImages(json) : undefined;
    
    // Calculate pricing
    if (normalized?.usage) {
        const pricedUsage = computeBill(normalized.usage, args.pricingCard);
        bill.cost_cents = pricedUsage.pricing.total_cents;
        bill.currency = pricedUsage.pricing.currency;
        bill.usage = pricedUsage;
    }
    
    return { kind: "completed", upstream: res, bill, normalized, keySource: keyInfo.source, byokKeyId: keyInfo.byokId };
}
