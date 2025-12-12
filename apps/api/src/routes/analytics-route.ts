import type { Hono } from "hono";
import type { GatewayBindings } from "@/runtime/env";
import { withRuntime, json } from "./utils";

// Coming soon: aggregated analytics endpoint; currently returns a placeholder.
async function handleAnalytics(req: Request) {
    // TODO: Validate access_token and return aggregated analytics.
    const { access_token } = await req.json().catch(() => ({}));
    if (!access_token) {
        return json({ ok: false, error: "access_token_required" }, 400, { "Cache-Control": "no-store" });
    }
    return json({ ok: true, status: "not_implemented", message: "Analytics aggregation coming soon" }, 200, {
        "Cache-Control": "no-store",
    });
}

export function registerAnalyticsRoute(app: Hono<{ Bindings: GatewayBindings }>) {
    app.post("/v1/analytics", withRuntime(handleAnalytics));
}
