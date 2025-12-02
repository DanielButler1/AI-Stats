// src/lib/gateway/after.ts
import type { PipelineContext } from "../before/types";
import type { RequestResult } from "../execute";
import type { Endpoint } from "../../types";

import { guardUpstreamStatus } from "./guards";
import { loadProviderPricing, calculatePricing } from "./pricing";
import { enrichSuccessPayload, extractFinishReason } from "./payload";
import { handleStreamResponse, handlePassthroughFallback } from "./stream";
import { handleSuccessAudit, handleFailureAudit } from "./audit";
import { makeHeaders, createResponse } from "./http";
import { recordUsageAndCharge } from "../pricing/persist";

export async function finalizeRequest(args: {
    pre: { ok: true; ctx: PipelineContext };
    exec: { ok: true; result: RequestResult };
    endpoint: Endpoint;
    timingHeader?: string;
}): Promise<Response> {
    const ctx = args.pre.ctx;
    const result = args.exec.result;

    // 1) Guard: Check upstream status
    const statusGuard = await guardUpstreamStatus(ctx, result, args.timingHeader);
    if (!statusGuard.ok) return (statusGuard as { ok: false; response: Response }).response;

    // 2) Handle streaming response
    if (ctx.stream) {
        const card = await loadProviderPricing(ctx, result);
        return await handleStreamResponse(ctx, result, card, args.timingHeader);
    }

    // 3) Handle non-streaming response
    if (result.normalized && !ctx.stream) {
        return await handleNonStreamResponse(ctx, result, args.timingHeader);
    }

    // 4) Passthrough fallback (should be rare). If we reach this state without a normalized payload,
    // treat it as an internal failure: we expect all non-stream responses to be normalized.
    if (!ctx.stream && !result.normalized) {
        const status = 502;
        const errorCode = "normalization_failed";
        const errorMessage = "Gateway could not normalize upstream response.";

        await handleFailureAudit(
            ctx,
            result,
            status,
            "gateway",
            errorCode,
            errorMessage
        );

        const headers = makeHeaders(args.timingHeader);
        return createResponse(
            {
                requestId: ctx.requestId,
                error: errorCode,
                message: errorMessage,
                upstreamStatus: result.upstream.status ?? null,
            },
            status,
            headers
        );
    }
    return handlePassthroughFallback(result.upstream);
}

async function handleNonStreamResponse(
    ctx: PipelineContext,
    result: RequestResult,
    timingHeader?: string
): Promise<Response> {
    // Enrich payload
    const payload = await ctx.timer.span("after_enrich_payload", () => enrichSuccessPayload(ctx, result));
    const usageNormalized = payload?.usage ?? {};

    // console.log("[DEBUG handleNonStreamResponse] usageNormalized:", usageNormalized);

    // Load pricing
    const card = await ctx.timer.span("after_load_pricing", () => loadProviderPricing(ctx, result));

    // Calculate pricing
    const { pricedUsage, totalCents, totalNanos, currency } = await ctx.timer.span("after_calculate_pricing", () => calculatePricing(
        usageNormalized,
        card,
        ctx.body
    ));

    // console.log("[DEBUG handleNonStreamResponse] pricedUsage:", pricedUsage, "totalCents:", totalCents, "totalNanos:", totalNanos, "currency:", currency);

    // Update payload with normalized usage
    payload.usage = pricedUsage;

    // Update result billing
    result.bill.cost_cents = totalCents;
    result.bill.currency = currency;
    result.bill.usage = payload.usage;

    // Extract finish reason
    const finishReason = await ctx.timer.span("after_extract_finish_reason", () => extractFinishReason(payload));

    const nativeResponseId = payload.nativeResponseId ?? result.bill.upstream_id ?? null;

    // Audit success
    await ctx.timer.span("after_audit_success", () =>
        handleSuccessAudit(
            ctx,
            result,
            false, // isStream
            payload.usage,
            totalCents,
            totalNanos,
            currency,
            finishReason,
            result.upstream.status,
            nativeResponseId ?? null
        )
    );

    // Record usage and charge wallet
    await ctx.timer.span("after_record_usage_charge", async () => {
        try {
            if (totalNanos > 0) {
                await recordUsageAndCharge({
                    requestId: ctx.requestId,
                    teamId: ctx.teamId,
                    cost_nanos: totalNanos,
                });
            }
        } catch (chargeErr) {
            console.error("recordUsageAndCharge failed", {
                error: chargeErr,
                requestId: ctx.requestId,
                teamId: ctx.teamId,
                endpoint: ctx.endpoint,
                cost_nanos: totalNanos,
            });
            // Continue with response even if charging fails
        }
    });

    const includeUsage = ctx.meta.returnUsage ?? false;
    const includeMeta = ctx.meta.returnMeta ?? false;

    // Default: do not return timing inside meta (matches chat completions behavior)
    const allowTimingInMeta = false;

    const metaWithTiming = payload.meta
        ? {
              ...payload.meta,
          }
        : undefined;

    if (metaWithTiming) {
        if (!allowTimingInMeta && "timing" in metaWithTiming) {
            delete (metaWithTiming as Record<string, unknown>).timing;
        }
        delete metaWithTiming.provider;
        delete metaWithTiming.endpoint;
        delete metaWithTiming.model;
        delete metaWithTiming.requestId;
        delete (metaWithTiming as Record<string, unknown>).finish_reason;
    }

    const { usage, meta: _meta, nativeResponseId: _nativeResponseId, requestId: _requestId, ...rest } = payload;
    const responseBody: Record<string, unknown> = { requestId: ctx.requestId, ...rest };

    if (includeUsage && usage !== undefined) {
        responseBody.usage = usage;
    }

    if (includeMeta && metaWithTiming) {
        responseBody.meta = metaWithTiming;
    }

    const headers = makeHeaders(timingHeader);
    return ctx.timer.span("after_create_response", () => createResponse(responseBody, result.upstream.status, headers));
}
