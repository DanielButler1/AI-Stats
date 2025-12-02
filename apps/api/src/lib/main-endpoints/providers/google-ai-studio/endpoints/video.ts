// lib/gateway/providers/google-ai-studio/endpoints/video.ts
import type { ProviderExecuteArgs, AdapterResult } from "../../types";
import { VideoGenerationSchema, type VideoGenerationRequest } from "../../../../schemas";
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

function mapGatewayToGoogleVideo(body: VideoGenerationRequest) {
    return {
        contents: [
            {
                role: "user",
                parts: [{ text: body.prompt }],
            },
        ],
        generationConfig: {
            responseModalities: ["VIDEO"],
            ...(body.duration || body.ratio
                ? {
                    videoConfig: {
                        ...(typeof body.duration === "number" ? { durationSeconds: body.duration } : {}),
                        ...(body.ratio ? { aspectRatio: body.ratio } : {}),
                    },
                }
                : {}),
        },
    };
}

function buildGatewayMeta(args: ProviderExecuteArgs) {
    return {
        requestId: args.meta.requestId,
        provider: "google-ai-studio",
        endpoint: args.endpoint,
        model: args.model,
        appTitle: args.meta.appTitle ?? undefined,
        referer: args.meta.referer ?? undefined,
    };
}

function mapGoogleToGatewayVideo(json: any, args: ProviderExecuteArgs, request: VideoGenerationRequest): any {
    const usageSeconds =
        json?.videoMetadata?.durationSeconds ??
        json?.response?.videoMetadata?.durationSeconds ??
        request.duration ??
        null;

    const usage = typeof usageSeconds === "number"
        ? { output_video_seconds: usageSeconds }
        : undefined;

    return {
        nativeResponseId: json?.responseId ?? json?.id ?? null,
        provider: "google-ai-studio",
        meta: buildGatewayMeta(args),
        result: json,
        ...(usage ? { usage } : {}),
    };
}

export async function exec(args: ProviderExecuteArgs): Promise<AdapterResult> {
    const keyInfo = await resolveApiKey(args);
    const key = keyInfo.key;
    const sanitizedBody = sanitizePayload(VideoGenerationSchema, args.body);
    const modifiedBody: VideoGenerationRequest = {
        ...sanitizedBody,
        model: args.providerModelSlug || args.model,
    };
    const modelForUrl = args.providerModelSlug || args.model;
    const req = mapGatewayToGoogleVideo(modifiedBody);
    const res = await fetch(`${BASE_URL}/v1beta/models/${modelForUrl}:generateContent?key=${key}`, {
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
    const normalized = json ? mapGoogleToGatewayVideo(json, args, modifiedBody) : undefined;
    
    // Calculate pricing
    if (normalized?.usage) {
        const pricedUsage = computeBill(normalized.usage, args.pricingCard);
        bill.cost_cents = pricedUsage.pricing.total_cents;
        bill.currency = pricedUsage.pricing.currency;
        bill.usage = pricedUsage;
    }
    
    return { kind: "completed", upstream: res, bill, normalized, keySource: keyInfo.source, byokKeyId: keyInfo.byokId };
}
