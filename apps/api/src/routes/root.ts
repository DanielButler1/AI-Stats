import type { Hono } from "hono";
import type { GatewayBindings } from "@/runtime/env";
import { json, withRuntime } from "./utils";

export function registerRootRoute(app: Hono<{ Bindings: GatewayBindings }>) {
    app.get(
        "/",
        withRuntime(async () => {
            return json({
                message: "Welcome to the AI Stats Gateway API! Documentation is available at https://docs.ai-stats.phaseo.app",
                timestamp: new Date().toISOString(),
            });
        })
    );
}
