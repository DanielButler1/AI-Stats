import type { Context } from "hono";
import type { GatewayBindings } from "@/runtime/env";
import { configureRuntime, setWaitUntil, clearRuntime } from "@/runtime/env";
import { sanitizeRequestHeaders } from "@/lib/gateway/http/sanitize-headers";

type Handler = (req: Request) => Promise<Response>;

export function withRuntime(handler: Handler) {
    return async (c: Context<{ Bindings: GatewayBindings }>) => {
        configureRuntime(c.env);
        const waitUntil = c.executionCtx?.waitUntil?.bind(c.executionCtx);
        const releaseWaitUntil = setWaitUntil(waitUntil);
        const sanitized = sanitizeRequestHeaders(c.req.raw, { preserve: ["authorization"] });
        try {
            return await handler(sanitized);
        } finally {
            releaseWaitUntil();
            clearRuntime();
        }
    };
}

export function json(body: any, status = 200, headers: Record<string, string> = {}) {
    return new Response(JSON.stringify(body, null, 2), {
        status,
        headers: {
            "Content-Type": "application/json",
            ...headers,
        },
    });
}
