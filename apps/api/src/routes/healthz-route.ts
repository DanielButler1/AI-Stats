import type { Hono } from "hono";
import type { GatewayBindings } from "@/runtime/env";

export function registerHealthRoute(app: Hono<{ Bindings: GatewayBindings }>) {
    app.get('/healthz', c => c.json({ status: 'ok' }));
}
