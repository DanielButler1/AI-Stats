// lib/gateway/after/stream.ts
import { passthroughWithPricing, passthrough } from "./streaming";
import type { PipelineContext } from "../before/types";
import type { RequestResult, Bill } from "../execute";
import type { PriceCard } from "../pricing";
import { calculatePricing } from "./pricing";
import { handleSuccessAudit } from "./audit";
import { recordUsageAndCharge } from "../pricing/persist";

export async function handleStreamResponse(
    ctx: PipelineContext,
    result: RequestResult,
    card: PriceCard | null,
    timingHeader?: string
): Promise<Response> {
    const upstream = result.kind === "stream" && result.stream
        ? new Response(result.stream, {
              status: result.upstream.status,
              headers: result.upstream.headers,
          })
        : result.upstream;

    const upstreamStatus = result.upstream.status;
    const resp = await passthroughWithPricing({
        upstream,
        ctx,
        provider: result.provider,
        priceCard: card,
        rewriteFrame: (frame: any) => {
            if (frame && typeof frame === "object") {
                frame.provider = result.provider;
                frame.gateway = {
                    requestId: ctx.requestId,
                    provider: result.provider,
                    endpoint: ctx.endpoint,
                    model: ctx.model
                };
                if (frame.usage) {
                    // Do not normalize usage here to preserve original values
                    // frame.usage = normalizeUsageTokens(frame.usage);
                }
                
                // Add meta to final frame (detect by object type and usage)
                if (frame?.object === "chat.completion" && frame?.usage && ctx.meta.generation_ms !== undefined) {
                    const generationMs = ctx.meta.generation_ms;
                    const tokensIn = frame.usage.prompt_tokens ?? frame.usage.input_tokens ?? frame.usage.input_text_tokens ?? 0;
                    const tokensOut = frame.usage.completion_tokens ?? frame.usage.output_tokens ?? frame.usage.output_text_tokens ?? 0;
                    const totalTokens = tokensIn + tokensOut;
                    const throughputTps = generationMs > 0 ? totalTokens / (generationMs / 1000) : 0;
                    
                    frame.meta = {
                        ...frame.meta,
                        throughput_tps: throughputTps,
                        generation_ms: generationMs,
                        latency_ms: ctx.meta.latency_ms ?? 0
                    };
                    if (frame.meta && typeof frame.meta === "object" && "finish_reason" in frame.meta) {
                        delete (frame.meta as Record<string, unknown>).finish_reason;
                    }
                }
            }
            return frame;
        },
        onFinalUsage: async (usageRaw: any) => {
            // console.log("[DEBUG After Stream] Final usage from stream:", usageRaw);

            const finalizeFromBill = async (bill: Bill | null | undefined) => {
                if (!bill) return false;
                result.bill.cost_cents = bill.cost_cents;
                result.bill.currency = bill.currency;
                result.bill.usage = bill.usage ?? result.bill.usage;
                result.bill.finish_reason = bill.finish_reason ?? result.bill.finish_reason;

                const totalNanosOverride = Math.round(bill.cost_cents * 1e7);

                await handleSuccessAudit(
                    ctx,
                    result,
                    true,
                    result.bill.usage ?? null,
                    bill.cost_cents,
                    totalNanosOverride,
                    bill.currency,
                    bill.finish_reason ?? null,
                    upstreamStatus,
                    result.bill.upstream_id ?? null
                );

                try {
                    if (totalNanosOverride > 0) {
                        await recordUsageAndCharge({
                            requestId: ctx.requestId,
                            teamId: ctx.teamId,
                            cost_nanos: totalNanosOverride,
                        });
                    }
                } catch (chargeErr) {
                    console.error("recordUsageAndCharge failed", {
                        error: chargeErr,
                        requestId: ctx.requestId,
                        teamId: ctx.teamId,
                        endpoint: ctx.endpoint,
                        cost_nanos: totalNanosOverride,
                    });
                }
                return true;
            };

            if (!usageRaw) {
                const finalized = result.usageFinalizer ? await result.usageFinalizer() : null;
                if (await finalizeFromBill(finalized)) return;
                await handleSuccessAudit(
                    ctx,
                    result,
                    true,
                    null,
                    0,
                    0,
                    result.bill.currency ?? card?.currency ?? "USD",
                    null,
                    upstreamStatus,
                    result.bill.upstream_id ?? null
                );
                return;
            }

            const { pricedUsage, totalCents, totalNanos, currency } = calculatePricing(
                usageRaw,
                card,
                ctx.body
            );

            result.bill.cost_cents = totalCents;
            result.bill.currency = currency;
            result.bill.usage = pricedUsage;

            await handleSuccessAudit(
                ctx,
                result,
                true,
                pricedUsage,
                totalCents,
                totalNanos,
                currency,
                null,
                upstreamStatus,
                result.bill.upstream_id ?? null
            );

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
            }
        },
        timingHeader,
    });

    return resp;
}

export function handlePassthroughFallback(upstream: Response): Response {
    return passthrough(upstream);
}
