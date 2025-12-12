import type { Hono } from "hono";
import type { GatewayBindings } from "@/runtime/env";
import { withRuntime } from "./utils";
import { authenticate } from "@/lib/gateway/before/auth";
import type { AuthFailure } from "@/lib/gateway/before/auth";
import { err } from "@/lib/gateway/before/http";
import { getBindings } from "@/runtime/env";

const BASE_URL = "https://api.openai.com";

async function proxyToOpenAI(req: Request, path: string, method: string) {
    const key = getBindings().OPENAI_API_KEY;
    if (!key) {
        return err("upstream_error", { reason: "openai_key_missing" });
    }

    const headers = new Headers(req.headers);
    headers.set("Authorization", `Bearer ${key}`);
    headers.set("Host", "api.openai.com");

    const upstream = await fetch(`${BASE_URL}${path}`, {
        method,
        headers,
        body: method === "GET" ? undefined : req.body,
    });

    return upstream;
}

async function handleUpload(req: Request) {
    const auth = await authenticate(req);
    if (!auth.ok) {
        const reason = (auth as AuthFailure).reason;
        return err("unauthorised", { reason });
    }
    return proxyToOpenAI(req, "/v1/files", "POST");
}

async function handleList(req: Request) {
    const auth = await authenticate(req);
    if (!auth.ok) {
        const reason = (auth as AuthFailure).reason;
        return err("unauthorised", { reason });
    }
    return proxyToOpenAI(req, "/v1/files", "GET");
}

async function handleRetrieve(req: Request, id: string) {
    const auth = await authenticate(req);
    if (!auth.ok) {
        const reason = (auth as AuthFailure).reason;
        return err("unauthorised", { reason });
    }
    return proxyToOpenAI(req, `/v1/files/${encodeURIComponent(id)}`, "GET");
}

export function registerFilesRoutes(app: Hono<{ Bindings: GatewayBindings }>) {
    app.post("/v1/files", withRuntime(handleUpload));
    app.get("/v1/files", withRuntime(handleList));
    app.get("/v1/files/:id", withRuntime((req) => handleRetrieve(req, (req as any).param?.("id") ?? req.url.split("/").pop() ?? "")));
}
