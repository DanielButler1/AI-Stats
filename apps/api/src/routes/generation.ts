import type { Hono } from "hono";
import type { GatewayBindings } from "@/runtime/env";
import { authenticate } from "@/lib/main-endpoints/before/auth";
import type { AuthFailure } from "@/lib/main-endpoints/before/auth";
import { getSupabaseAdmin } from "@/runtime/env";
import { json, withRuntime } from "./utils";

async function handleGeneration(req: Request) {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
        return json({ ok: false, error: "missing_id" }, 400, { "Cache-Control": "no-store" });
    }

    const auth = await authenticate(req);
    if (!auth.ok) {
        const reason = (auth as AuthFailure).reason;
        return json({ ok: false, error: "unauthorised", reason }, 401, { "Cache-Control": "no-store" });
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
        .from("gateway_requests")
        .select("*")
        .eq("team_id", auth.teamId)
        .eq("request_id", id)
        .maybeSingle();

    if (error) {
        return json({ ok: false, error: "db_error", message: error.message }, 500, { "Cache-Control": "no-store" });
    }

    if (!data) {
        return json({ ok: false, error: "not_found" }, 404, { "Cache-Control": "no-store" });
    }

    return json(data, 200, { "Cache-Control": "no-store" });
}

export function registerGenerationRoute(app: Hono<{ Bindings: GatewayBindings }>) {
    app.get("/v1/generation", withRuntime(handleGeneration));
}
