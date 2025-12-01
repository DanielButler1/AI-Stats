// file: lib/gateway/execute/index.ts
import type { GatewayCompletionsResponse } from "../../types";
import type { PipelineContext } from "../before/types";
import type { AdapterResult } from "../providers/types";
import { Timer } from "../telemetry/timer";

export type PipelineTiming = {
    timer: Timer;
    internal: {
        adapterMarked: boolean;
    };
};

import { guardCandidates, guardPricingFound, guardAllFailed } from "./guards";
import { getBaseModel, calculateMaxTries } from "./utils";
import { rankProviders } from "./providers";
import { attemptProvider, type AttemptResult } from "./attempt";

export type Bill = {
    cost_cents: number;
    currency: string;
    usage?: Record<string, any>;
    upstream_id?: string | null;
    finish_reason?: string | null;
};

export type RequestResult = {
    kind: AdapterResult["kind"];
    upstream: Response;
    stream?: ReadableStream<Uint8Array> | null;
    usageFinalizer?: (() => Promise<Bill | null>) | null;
    provider: string;
    generationTimeMs: number;
    bill: Bill;
    keySource?: "gateway" | "byok";
    byokKeyId?: string | null;
    normalized?: GatewayCompletionsResponse;
    debugClone?: Response;
    mappedRequest?: any;
};



/** EXECUTE STAGE (per-model scoped health, load-balanced by default) */
export async function doRequest(
    ctx: PipelineContext,
    timing: PipelineTiming,
): Promise<Response | { ok: true; result: RequestResult }> {

    const baseModel = getBaseModel(ctx.model);

    // 1) Guard: Check candidates exist
    const candidatesGuard = await guardCandidates(ctx, timing);
    if (!candidatesGuard.ok) return (candidatesGuard as { ok: false; response: Response }).response;
    const candidates = candidatesGuard.value;

    // 2) Rank providers (health-aware)
    const ranked = await rankProviders(candidates, ctx);

    // 3) Try providers in order (failover up to 5)
    const maxTries = calculateMaxTries(ranked.length);
    let anyPricingFound = false;

    for (let attempt = 0; attempt < maxTries; attempt++) {
        const choice = ranked[attempt];
        const result = await attemptProvider(choice, ctx, timing, baseModel);

        if (result.ok) {
            return result;
        }

        if ("skip" in result && result.skip === "no_pricing") {
            // Continue to next provider but don't mark pricing as found
            continue;
        }

        if ("skip" in result && result.skip === "blocked") {
            // Continue to next provider
            continue;
        }

        // If we got here, pricing was found but execution failed
        anyPricingFound = true;
    }

    // 4) Guard: Check if any pricing was found
    const pricingGuard = await guardPricingFound(anyPricingFound, ctx, timing);
    if (!pricingGuard.ok) return (pricingGuard as { ok: false; response: Response }).response;

    // 5) All providers failed
    const failureGuard = await guardAllFailed(ctx, timing);
    return (failureGuard as { ok: false; response: Response }).response;
}

