// lib/gateway/execute/attempt.ts
import { onCallEnd, onCallStart, admitThroughBreaker, reportProbeResult, maybeOpenOnRecentErrors } from "./health";
import { loadPriceCard } from "../pricing";
import type { PipelineContext } from "../before/types";
import type { PipelineTiming } from "./index";
import type { ProviderExecuteArgs } from "../providers/types";
import type { RequestResult } from "./index";

export type AttemptResult =
    | { ok: true; result: RequestResult }
    | { ok: false; error: unknown }
    | { ok: false; skip: "blocked" | "no_pricing" };

export async function attemptProvider(
    choice: any,
    ctx: PipelineContext,
    timing: PipelineTiming,
    baseModel: string
): Promise<AttemptResult> {
    const candidate = choice.candidate;
    const adapter = candidate.adapter;

    // Admission via breaker using the routing snapshot (no extra read)
    const admission = await admitThroughBreaker(
        ctx.endpoint,
        adapter.name,
        baseModel,
        ctx.teamId,
        ctx.requestId,
        choice.health
    );

    if (admission === "blocked") {
        return { ok: false, skip: "blocked" };
    }

    const isProbe = admission === "probe";

    // Ensure billing is configured (pricing not used in scoring)
    let pricingCard = candidate.pricingCard ?? null;
    if (!pricingCard) {
        pricingCard = await loadPriceCard(adapter.name, baseModel, ctx.endpoint);
        if (pricingCard) {
            candidate.pricingCard = pricingCard;
        }
    }

    if (!pricingCard) {
        return { ok: false, skip: "no_pricing" };
    }

    const meta = {
        ...ctx.meta,
        stream: ctx.meta.stream,
    } as ProviderExecuteArgs["meta"];

    await onCallStart(ctx.endpoint, adapter.name, baseModel);

    if (!timing.internal.adapterMarked) {
        timing.timer.mark("adapter_start");
        timing.internal.adapterMarked = true;
    }

    const t0 = performance.now();

    try {
        // Call adapter directly. We intentionally avoid creating a separate
        // `providerRequest` span here to prevent duplication with the
        // adapter round-trip timing we record below.
        const r = await adapter.execute({
            endpoint: ctx.endpoint,
            model: baseModel,
            body: ctx.body,
            meta,
            teamId: ctx.teamId,
            providerId: candidate.providerId,
            byokMeta: candidate.byokMeta,
            pricingCard,
            providerModelSlug: candidate.providerModelSlug,
            stream: ctx.stream,
        });

        if (r.keySource) {
            ctx.meta.keySource = r.keySource;
            ctx.meta.byokKeyId = r.byokKeyId ?? null;
            meta.keySource = r.keySource;
            meta.byokKeyId = r.byokKeyId ?? null;
        }

        const duration = Math.round(performance.now() - t0);
        const endToEndMs = Math.round(timing.timer.elapsed("request_start"));
        const timeToProviderMs = endToEndMs - duration;
        ctx.meta.generation_ms = duration;
        ctx.meta.latency_ms = timeToProviderMs;

        // Record adapter roundtrip if not already recorded (first adapter)
        if (timing.timer.snapshot().adapter_roundtrip_ms === undefined) {
            timing.timer.between("adapter_roundtrip_ms", "adapter_start");
        }

        if (!ctx.stream) {
            const u = (r.normalized as any)?.usage ?? r.bill?.usage ?? {};
            const tokensIn = Number(u.prompt_tokens ?? u.input_tokens ?? u.input_text_tokens ?? 0);
            const tokensOut = Number(u.completion_tokens ?? u.output_tokens ?? u.output_text_tokens ?? 0);
            const totalTokens = tokensIn + tokensOut;
            
            // Calculate timings
            const generationMs = duration; // Adapter roundtrip time
            const throughputTps = generationMs > 0 ? totalTokens / (generationMs / 1000) : 0;
            
            // Add to meta for downstream use
            ctx.meta.throughput_tps = throughputTps;
            
            // Add meta to normalized response
            if (r.normalized && typeof r.normalized === 'object') {
                r.normalized.meta = {
                    ...r.normalized.meta,
                    throughput_tps: throughputTps,
                    generation_ms: generationMs,
                    latency_ms: timeToProviderMs,
                    finish_reason: r.bill?.finish_reason ?? null,
                };
            }
            
            // Add meta to response body
            try {
                const responseClone = r.upstream.clone();
                const responseJson = await responseClone.json();
                responseJson.meta = {
                    ...responseJson.meta,
                    throughput_tps: throughputTps,
                    generation_ms: generationMs,
                    latency_ms: timeToProviderMs,
                    finish_reason: r.bill?.finish_reason ?? null,
                };
                r.upstream = new Response(JSON.stringify(responseJson), {
                    status: r.upstream.status,
                    statusText: r.upstream.statusText,
                    headers: r.upstream.headers
                });
            } catch (e) {
                // If parsing fails, continue without meta
                console.error('Failed to add meta to response:', e);
            }
            
            await onCallEnd(ctx.endpoint, {
                provider: adapter.name,
                model: baseModel,
                ok: true,
                latency_ms: endToEndMs,      // End-to-end request time for health monitoring
                generation_ms: generationMs, // Provider processing time
                tokens_in: tokensIn,
                tokens_out: tokensOut,
            });
        }

        if (isProbe) {
            await reportProbeResult(ctx.endpoint, adapter.name, baseModel, true);
        } else {
            await maybeOpenOnRecentErrors(ctx.endpoint, adapter.name, baseModel);
        }

        return {
            ok: true,
            result: {
                kind: r.kind,
                upstream: r.upstream,
                stream: r.kind === "stream" ? (r.stream ?? r.upstream.body ?? null) : null,
                usageFinalizer: r.kind === "stream" ? (r.usageFinalizer ?? null) : null,
                provider: adapter.name,
                generationTimeMs: duration,
                bill: r.bill,
                keySource: r.keySource ?? meta.keySource,
                byokKeyId: r.byokKeyId ?? meta.byokKeyId ?? null,
                normalized: r.normalized as any,
                mappedRequest: (r as any).mappedRequest,
            },
        };
    } catch (e) {
        const duration = Math.round(performance.now() - t0);

        // Ensure adapter roundtrip is recorded even on errors
        if (timing.timer.snapshot().adapter_roundtrip_ms === undefined) {
            timing.timer.between("adapter_roundtrip_ms", "adapter_start");
        }

        // Calculate timings for error case
        const generationMs = duration;
        const endToEndMs = Math.round(timing.timer.elapsed("request_start"));
        const timeToProviderMs = endToEndMs - generationMs;
        
        // Add to meta even on error
        ctx.meta.generation_ms = generationMs;
        ctx.meta.latency_ms = timeToProviderMs;

        await onCallEnd(ctx.endpoint, {
            provider: adapter.name,
            model: baseModel,
            ok: false,
            latency_ms: endToEndMs,
            generation_ms: generationMs,
        });

        if (isProbe) {
            await reportProbeResult(ctx.endpoint, adapter.name, baseModel, false);
        } else {
            await maybeOpenOnRecentErrors(ctx.endpoint, adapter.name, baseModel);
        }

        return { ok: false, error: e };
    }
}
