// lib/gateway/execute/providers.ts
import { routeProviders } from "./routing";
import type { PipelineContext } from "../before/types";
import type { ProviderCandidate } from "../before/types";

export async function rankProviders(
    candidates: ProviderCandidate[],
    ctx: PipelineContext
) {
    return await routeProviders(candidates, {
        endpoint: ctx.endpoint,
        model: ctx.model,
        teamId: ctx.teamId,
        body: ctx.body,
    });
}