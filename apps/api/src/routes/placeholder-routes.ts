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
        path: "/v1/keys",
        message: "Coming Soon | Get all API Keys.",
    },
    {
        method: "post",
        path: "/v1/keys",
        message: "Coming Soon | Create API Keys.",
    },
    {
        method: "get",
        path: "/v1/key",
        message: "Coming Soon | Create API Keys.",
    },
    {
        method: "post",
        path: "/v1/batch",
        message: "Not implemented yet",
    },
    {
        method: "post",
        path: "/v1/images/generations",
        message: "Not implemented yet",
    },
    {
        method: "post",
        path: "/v1/images/edits",
        message: "Not implemented yet",
    },
    {
        method: "post",
        path: "/v1/videos",
        message: "Not implemented yet",
    },
    {
        method: "post",
        path: "/v1/audio/transcriptions",
        message: "Not implemented yet",
    },
    {
        method: "post",
        path: "/v1/audio/speech",
        message: "Not implemented yet",
    },
    {
        method: "post",
        path: "/v1/audio/translations",
        message: "Not implemented yet",
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
