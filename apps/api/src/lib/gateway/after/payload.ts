// lib/gateway/after/payload.ts
import type { PipelineContext } from "../before/types";
import type { RequestResult } from "../execute";
import type { GatewayCompletionsChoice } from "@gateway/types";
import { shapeUsageForClient } from "../usage";

export async function enrichSuccessPayload(ctx: PipelineContext, result: RequestResult) {
    const payload: any = result.normalized ? structuredClone(result.normalized) : {};

    payload.nativeResponseId =
        (payload?.nativeResponseId as string | undefined) ?? result.bill?.upstream_id ?? null;
    payload.provider = result.provider;
    payload.requestId = ctx.requestId;

    payload.meta = {
        ...payload.meta,
    };

    return payload;
}

export function extractFinishReason(payload: any): string | null {
    return Array.isArray(payload?.choices)
        ? (payload.choices.find((c: any) => typeof c?.finish_reason === "string")?.finish_reason ?? null)
        : null;
}

export function presentUsageForClient(usage: any) {
    if (!usage || typeof usage !== "object") return usage;
    const shaped = shapeUsageForClient(usage);
    const inputTokens = shaped.input_tokens ?? shaped.input_text_tokens ?? shaped.prompt_tokens ?? 0;
    const outputTokens = shaped.output_tokens ?? shaped.output_text_tokens ?? shaped.completion_tokens ?? 0;
    const totalTokens = shaped.total_tokens ?? inputTokens + outputTokens;

    const inputDetails = shaped.input_tokens_details ?? shaped.input_details ?? {};
    const outputDetails = shaped.output_tokens_details ?? shaped.completion_tokens_details ?? {};

    const pricing = (() => {
        const p = shaped.pricing ?? shaped.pricing_breakdown;
        if (!p) return undefined;
        return {
            total_nanos: p.total_nanos ?? p.totalNanos ?? 0,
            total_usd_str: p.total_usd_str ?? p.totalUsdStr ?? (typeof p.total_nanos === "number" ? (p.total_nanos / 1e9).toString() : undefined),
            total_cents: p.total_cents ?? p.totalCents ?? 0,
            currency: p.currency ?? "USD",
            lines: p.lines ?? [],
        };
    })();

    const out: any = {
        input_tokens: inputTokens,
        output_tokens: outputTokens,
        total_tokens: totalTokens,
    };

    if (Object.keys(inputDetails).length) out.input_tokens_details = inputDetails;
    if (Object.keys(outputDetails).length) out.output_tokens_details = outputDetails;
    if (pricing) out.pricing_breakdown = pricing;
    return out;
}

function toOaiChatChoices(choices: GatewayCompletionsChoice[] | undefined) {
    if (!Array.isArray(choices)) return [];
    return choices.map((c) => ({
        index: c.index ?? 0,
        message: {
            ...c.message,
            refusal: (c as any).refusal ?? null,
            annotations: (c as any).annotations ?? [],
        },
        logprobs: c.logprobs ?? null,
        finish_reason: c.finish_reason ?? null,
    }));
}

export function formatClientPayload(args: {
    ctx: PipelineContext;
    payload: any;
    includeUsage: boolean;
    includeMeta: boolean;
}) {
    const { ctx, payload, includeUsage, includeMeta } = args;
    const usage = includeUsage ? presentUsageForClient(payload?.usage) : undefined;
    const meta = (() => {
        if (!includeMeta || !payload?.meta) return undefined;
        const clean = { ...payload.meta };
        delete (clean as any).provider;
        delete (clean as any).endpoint;
        delete (clean as any).model;
        delete (clean as any).requestId;
        delete (clean as any).finish_reason;
        delete (clean as any).timing;
        return clean;
    })();

    if (ctx.endpoint === "chat.completions") {
        const resolvedId = payload?.requestId ?? ctx.requestId ?? payload?.id ?? payload?.nativeResponseId ?? null;
        const body: any = {
            id: resolvedId,
            object: "chat.completion",
            created: payload?.created ?? Math.floor(Date.now() / 1000),
            model: payload?.model ?? ctx.model,
            choices: toOaiChatChoices(payload?.choices),
            ...(usage ? { usage } : {}),
        };
        if (ctx.body?.service_tier) body.service_tier = ctx.body.service_tier;
        if (payload?.system_fingerprint) body.system_fingerprint = payload.system_fingerprint;
        if (meta) body.meta = meta;
        return body;
    }

    if (ctx.endpoint === "responses") {
        const { provider, requestId, meta: _m, usage: _u, ...rest } = payload ?? {};
        const resolvedId = requestId ?? ctx.requestId ?? rest?.id ?? payload?.nativeResponseId ?? null;
        const body: any = {
            object: rest?.object ?? "response",
            id: resolvedId,
            ...rest,
            ...(usage ? { usage } : {}),
        };
        if (meta) body.meta = meta;
        return body;
    }

    if (ctx.endpoint === "moderations") {
        const { provider, requestId, meta: _m, usage: _u, id: payloadId, ...rest } = payload ?? {};
        const resolvedId = requestId ?? ctx.requestId ?? payloadId ?? payload?.nativeResponseId ?? null;
        const body: any = {
            object: "moderation",
            id: resolvedId,
            ...rest,
            ...(usage ? { usage } : {}),
        };
        if (meta) body.meta = meta;
        return body;
    }

    // Fallback: keep payload structure
    const fallback: any = {
        requestId: ctx.requestId,
        ...payload,
        ...(usage ? { usage } : {}),
    };
    if (meta) fallback.meta = meta;
    return fallback;
}
