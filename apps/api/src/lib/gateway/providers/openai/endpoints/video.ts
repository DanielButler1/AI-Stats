import type { AdapterResult, ProviderExecuteArgs } from "../../types";
import { VideoGenerationSchema, type VideoGenerationRequest } from "@/lib/schemas";
import { buildAdapterPayload } from "../../utils";
import { getBindings } from "@/runtime/env";
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

export async function exec(args: ProviderExecuteArgs): Promise<AdapterResult> {
    const keyInfo = await resolveApiKey(args);
    const adapterPayload = buildAdapterPayload(VideoGenerationSchema, args.body, []).adapterPayload as VideoGenerationRequest;
    const body: VideoGenerationRequest = {
        ...adapterPayload,
        model: args.providerModelSlug || adapterPayload.model,
    };

    const res = await fetch(`${BASE_URL}/v1/videos`, {
        method: "POST",
        headers: baseHeaders(keyInfo.key),
        body: JSON.stringify(body),
    });

    const bill = {
        cost_cents: 0,
        currency: "USD" as const,
        usage: undefined as any,
        upstream_id: res.headers.get("x-request-id"),
        finish_reason: null,
    };

    const normalized = await res.clone().json().catch(() => undefined);

    return {
        kind: "completed",
        upstream: res,
        bill,
        normalized,
        keySource: keyInfo.source,
        byokKeyId: keyInfo.byokId,
    };
}
