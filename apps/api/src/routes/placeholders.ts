import type { Hono } from "hono";
import type { GatewayBindings } from "@/runtime/env";
import { json, withRuntime } from "./utils";

type Method = "get" | "post";

type PlaceholderRoute = {
    method: Method;
    path: string;
    message: string;
};

const placeholderRoutes: PlaceholderRoute[] = [
    {
        method: "get",
        path: "/v1/credits",
        message: "Billing and credits are managed inside the AI Stats dashboard; this endpoint is not live yet.",
    },
    {
        method: "get",
        path: "/v1/providers",
        message: "Provider metadata is surfaced via /v1/health today; the dedicated endpoint is not implemented yet.",
    },
    {
        method: "get",
        path: "/v1/endpoints",
        message: "The list of gateway endpoints is maintained in the documentation; this API surface is not ready yet.",
    },
    {
        method: "get",
        path: "/v1/api-keys",
        message: "API key management is only available in the dashboard and not via this endpoint.",
    },
    {
        method: "post",
        path: "/v1/embeddings",
        message: "Embedding generation is coming soon and is not implemented in this gateway yet.",
    },
];

const makeNotImplemented = (message: string) => async () =>
    json(
        {
            ok: false,
            error: "not_implemented",
            message,
        },
        501,
        { "Cache-Control": "no-store" }
    );

export function registerPlaceholderRoutes(app: Hono<{ Bindings: GatewayBindings }>) {
    for (const route of placeholderRoutes) {
        app[route.method](route.path, withRuntime(makeNotImplemented(route.message)));
    }
}
