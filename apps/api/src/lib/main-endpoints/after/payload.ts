// lib/gateway/after/payload.ts
import type { PipelineContext } from "../before/types";
import type { RequestResult } from "../execute";

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
