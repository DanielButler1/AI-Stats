// apps/api/src/runtime/env.ts
import type { Redis } from "@upstash/redis";
import { Redis as UpstashRedis } from "@upstash/redis/cloudflare";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@supabase/supabase-js";

export type GatewayBindings = {
    SUPABASE_URL: string;
    SUPABASE_SERVICE_ROLE_KEY: string;
    NEXT_PUBLIC_GATEWAY_VERSION?: string;
    AXIOM_API_KEY?: string;
    AXIOM_DATASET?: string;
    OPENAI_API_KEY?: string;
    GOOGLE_AI_STUDIO_API_KEY?: string;
    ANTHROPIC_API_KEY?: string;
    XAI_API_KEY?: string;
    KEY_PEPPER?: string;
    UPSTASH_REDIS_REST_URL: string;
    UPSTASH_REDIS_REST_TOKEN: string;
    NODE_ENV?: string;
    BYOK_KMS_KEY_V1_B64?: string;
    BYOK_ACTIVE_KEY_VERSION?: string;
};

export type GatewayRuntime = {
    bindings: GatewayBindings;
    waitUntil?: (promise: Promise<unknown>) => void;
};

type RuntimeState = {
    bindings: GatewayBindings;
    redis: Redis;
    supabase: SupabaseClient;
};

const BINDING_KEYS: Array<keyof GatewayBindings> = [
    "SUPABASE_URL",
    "SUPABASE_SERVICE_ROLE_KEY",
    "NEXT_PUBLIC_GATEWAY_VERSION",
    "AXIOM_API_KEY",
    "AXIOM_DATASET",
    "OPENAI_API_KEY",
    "GOOGLE_AI_STUDIO_API_KEY",
    "KEY_PEPPER",
    "UPSTASH_REDIS_REST_URL",
    "UPSTASH_REDIS_REST_TOKEN",
    "NODE_ENV",
    "BYOK_KMS_KEY_V1_B64",
    "BYOK_ACTIVE_KEY_VERSION",
];

let runtimeState: RuntimeState | null = null;
let runtimeActiveCount = 0;
let lastBindingsSnapshot: GatewayBindings | null = null;
type WaitUntilEntry = {
    id: number;
    handler: (promise: Promise<unknown>) => void;
};
const waitUntilEntries: WaitUntilEntry[] = [];
let nextWaitUntilEntryId = 0;
let waitUntilHandler: ((promise: Promise<unknown>) => void) | null = null;

function snapshotBindings(env: GatewayBindings): GatewayBindings {
    const snap: Partial<GatewayBindings> = {};
    for (const key of BINDING_KEYS) {
        const value = env[key];
        if (value !== undefined) {
            // Ensure we only retain primitive copies (avoid accidental mutation)
            snap[key] = typeof value === "string" ? `${value}` : value;
        }
    }
    return Object.freeze(snap) as GatewayBindings;
}

function ensureRuntime(): RuntimeState {
    if (!runtimeState) throw new Error("Gateway runtime not configured");
    return runtimeState;
}

export function configureRuntime(env: GatewayBindings) {
    runtimeActiveCount += 1;
    if (runtimeState) return;

    const bindings = snapshotBindings(env);
    lastBindingsSnapshot = bindings;

    const redisClient = new UpstashRedis({
        url: bindings.UPSTASH_REDIS_REST_URL,
        token: bindings.UPSTASH_REDIS_REST_TOKEN,
    });

    const globalFetch: typeof fetch = (input, init) => fetch(input, init);

    const supabaseAdmin = createClient(bindings.SUPABASE_URL, bindings.SUPABASE_SERVICE_ROLE_KEY, {
        auth: { autoRefreshToken: false, persistSession: false },
        global: { fetch: globalFetch },
    });

    runtimeState = { bindings, redis: redisClient, supabase: supabaseAdmin };
}

export function clearRuntime() {
    if (runtimeActiveCount > 0) {
        runtimeActiveCount -= 1;
    }

    if (runtimeActiveCount === 0) {
        runtimeState = null;
        waitUntilEntries.length = 0;
        waitUntilHandler = null;
    }
}

export function ensureRuntimeForBackground(): () => void {
    if (runtimeState) {
        return () => {};
    }
    if (!lastBindingsSnapshot) {
        throw new Error("Gateway runtime not configured");
    }
    configureRuntime(lastBindingsSnapshot);
    return () => clearRuntime();
}

export function setWaitUntil(handler?: (promise: Promise<unknown>) => void): () => void {
    if (!handler) {
        return () => {};
    }

    const entry: WaitUntilEntry = {
        id: ++nextWaitUntilEntryId,
        handler,
    };
    waitUntilEntries.push(entry);
    waitUntilHandler = handler;

    let released = false;
    return () => {
        if (released) return;
        released = true;
        const idx = waitUntilEntries.findIndex((item) => item.id === entry.id);
        if (idx !== -1) {
            waitUntilEntries.splice(idx, 1);
        }
        waitUntilHandler = waitUntilEntries.length ? waitUntilEntries[waitUntilEntries.length - 1].handler : null;
    };
}

export function getBindings(): GatewayBindings {
    return ensureRuntime().bindings;
}

export function dispatchBackground(promise: Promise<unknown>) {
    const handler = waitUntilHandler;
    if (handler) {
        handler(promise.catch((err) => console.error(err)));
        return;
    }
    promise.catch((err) => console.error(err));
}

export function getRedis(): Redis {
    return ensureRuntime().redis;
}

export function getSupabaseAdmin(): SupabaseClient {
    return ensureRuntime().supabase;
}

export function getByokKey(version: number): string {
    const bindings = getBindings();
    const raw =
        (bindings as any)[`BYOK_KMS_KEY_V${version}_B64`] ??
        (bindings as any)[`BYOK_KMS_KEY_V${version}`];

    if (!raw) throw new Error(`Missing BYOK key for version ${version}`);

    const s = String(raw).trim().replace(/^["']|["']$/g, "");
    return s.startsWith("base64:") ? s.slice(7) : s;
}

