import type { Hono } from "hono";
import type { GatewayBindings } from "@/runtime/env";
import type { Endpoint } from "@/lib/types";
import { json, withRuntime } from "./utils";
import { readHealth } from "@/lib/main-endpoints/execute/health";
import { providersFor, allProviderNames } from "@/lib/main-endpoints/providers";

type PublicProviderHealth = {
    provider: string;
    status: "up" | "degraded" | "down" | "probing";
    breaker: "closed" | "open" | "half_open";
    p50_ms: number | null;
    p95_ms: number | null;
    success_rate: number;
    load: number;
    rate_rps_10s: number;
    rate_rps_60s: number;
    tokens_per_sec_60s: number;
    last_updated: number;
    breaker_until_ms?: number;
};

const UI_DEGRADED_P95_MS = 3000;
const UI_DEGRADED_SUCCESS = 0.97;

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

const classify = (h: {
    breaker: PublicProviderHealth["breaker"];
    p95_ms: PublicProviderHealth["p95_ms"];
    success_rate: PublicProviderHealth["success_rate"];
}): PublicProviderHealth["status"] => {
    if (h.breaker === "open") return "down";
    if (h.breaker === "half_open") return "probing";
    const degraded = (h.p95_ms ?? 0) > UI_DEGRADED_P95_MS || h.success_rate < UI_DEGRADED_SUCCESS;
    return degraded ? "degraded" : "up";
};

const median = (nums: number[]): number | null => {
    const arr = nums.filter((n) => Number.isFinite(n)).slice().sort((a, b) => a - b);
    if (!arr.length) return null;
    const index = Math.floor(arr.length / 2);
    return arr.length % 2 ? arr[index] : (arr[index - 1] + arr[index]) / 2;
};

const average = (nums: number[]): number | null => {
    const arr = nums.filter((n) => Number.isFinite(n));
    if (!arr.length) return null;
    return arr.reduce((sum, value) => sum + value, 0) / arr.length;
};

async function handleHealth(req: Request) {
    const url = new URL(req.url);
    const providerQP = url.searchParams.get("provider") || undefined;
    const modelQP = url.searchParams.get("model") || undefined;
    const endpointQP = (url.searchParams.get("endpoint") || undefined) as Endpoint | undefined;

    let providerNames: string[] = [];

    try {
        if (providerQP) {
            providerNames = [providerQP];
        } else if (modelQP && endpointQP) {
            const adapters = await providersFor(modelQP, endpointQP);
            providerNames = adapters.map((a) => a.name);
        } else {
            providerNames = allProviderNames();
        }

        if (!providerNames.length) {
            return json(
                {
                    ok: false,
                    message: "No providers available for the requested scope.",
                    scope: { provider: providerQP ?? null, model: modelQP ?? null, endpoint: endpointQP ?? null },
                },
                404,
                { "Cache-Control": "public, max-age=3, stale-while-revalidate=30" }
            );
        }

        const effectiveEndpoint = endpointQP ?? "chat.completions";
        const effectiveModel = modelQP ?? "unknown_model";

        const health = await Promise.all(
            providerNames.map(async (name): Promise<PublicProviderHealth> => {
                const h = await readHealth(effectiveEndpoint, name, effectiveModel);
                const p50 = Number.isFinite(h.lat_ewma_10s) ? h.lat_ewma_10s : null;
                const tail =
                    Number.isFinite(h.lat_ewma_60s) ?
                        Math.max(h.lat_ewma_60s, (h.lat_ewma_10s || 0) * 1.6) :
                        (p50 ? p50 * 1.6 : null);
                const successRate = clamp01(1 - (h.err_ewma_60s ?? 0));

                const entry: PublicProviderHealth = {
                    provider: name,
                    status: "up",
                    breaker: h.breaker,
                    p50_ms: p50,
                    p95_ms: tail,
                    success_rate: successRate,
                    load: h.current_load ?? 0,
                    rate_rps_10s: h.rate_10s ?? 0,
                    rate_rps_60s: h.rate_60s ?? 0,
                    tokens_per_sec_60s: h.tp_ewma_60s ?? 0,
                    last_updated: h.last_updated ?? 0,
                    breaker_until_ms: h.breaker_until_ms ?? 0,
                };

                entry.status = classify({ breaker: entry.breaker, p95_ms: entry.p95_ms, success_rate: entry.success_rate });
                return entry;
            })
        );

        const upCount = health.filter((h) => h.status === "up").length;
        const degradedCount = health.filter((h) => h.status === "degraded").length;
        const downCount = health.filter((h) => h.status === "down").length;

        const overallP50 = median(health.map((h) => h.p50_ms ?? NaN));
        const overallP95 = median(health.map((h) => h.p95_ms ?? NaN));
        const overallSuccess = average(health.map((h) => h.success_rate ?? NaN));

        let overallStatus: "up" | "degraded" | "down";
        if (downCount === health.length) overallStatus = "down";
        else if (
            degradedCount > 0 ||
            (overallP95 ?? 0) > UI_DEGRADED_P95_MS ||
            (overallSuccess ?? 1) < UI_DEGRADED_SUCCESS
        ) {
            overallStatus = "degraded";
        } else {
            overallStatus = "up";
        }

        const body = {
            ok: true,
            ewma_time_constants_ms: { t10s: 10_000, t60s: 60_000, t300s: 300_000 },
            scope: {
                provider: providerQP ?? null,
                model: modelQP ?? null,
                endpoint: endpointQP ?? null,
            },
            overall: {
                status: overallStatus,
                providers_up: upCount,
                providers_total: health.length,
                p50_ms: overallP50,
                p95_ms: overallP95,
                success_rate: overallSuccess,
            },
            providers: health.sort((a, b) => {
                const order: Record<"up" | "degraded" | "probing" | "down", number> = {
                    up: 0,
                    degraded: 1,
                    probing: 2,
                    down: 3,
                };
                const dv = order[a.status] - order[b.status];
                if (dv !== 0) return dv;
                return (a.p50_ms ?? Infinity) - (b.p50_ms ?? Infinity);
            }),
            generated_at: Date.now(),
        };

        return json(body, 200, { "Cache-Control": "public, max-age=3, stale-while-revalidate=30" });
    } catch (error: any) {
        return json({ ok: false, error: "health_failed", message: String(error?.message ?? error) }, 500, {
            "Cache-Control": "no-store",
        });
    }
}

export function registerHealthRoute(app: Hono<{ Bindings: GatewayBindings }>) {
    app.get("/v1/health", withRuntime(handleHealth));
}
