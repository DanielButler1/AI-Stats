import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { configureRuntime, clearRuntime, type GatewayBindings } from "../../src/runtime/env";

export { clearRuntime };

export function loadEnvFromFiles(files: string[] = [".env.local", ".env", ".dev.vars"]): void {
    for (const file of files) {
        const fullPath = resolve(process.cwd(), file);
        if (!existsSync(fullPath)) continue;
        try {
            const contents = readFileSync(fullPath, "utf8");
            for (const rawLine of contents.split(/\r?\n/)) {
                const line = rawLine.trim();
                if (!line || line.startsWith("#")) continue;
                const eqIndex = line.indexOf("=");
                if (eqIndex === -1) continue;
                const key = line.slice(0, eqIndex).trim();
                if (!key) continue;
                if (process.env[key] !== undefined) continue;
                let value = line.slice(eqIndex + 1).trim();
                if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                    value = value.slice(1, -1);
                }
                process.env[key] = value;
            }
        } catch (err) {
            // eslint-disable-next-line no-console
            console.warn(`Failed to load env file ${file}:`, err);
        }
    }
}

export function ensureRuntimeConfigured(): void {
    loadEnvFromFiles();
    const required = ["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"] as const;
    const missing = required.filter((key) => !process.env[key]);
    if (missing.length) {
        throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
    }

    const bindings: GatewayBindings = {
        SUPABASE_URL: process.env.SUPABASE_URL!,
        SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY!,
        NEXT_PUBLIC_GATEWAY_VERSION: process.env.NEXT_PUBLIC_GATEWAY_VERSION ?? "cli-simulator",
        AXIOM_API_KEY: process.env.AXIOM_API_KEY,
        AXIOM_DATASET: process.env.AXIOM_DATASET,
        OPENAI_API_KEY: process.env.OPENAI_API_KEY,
        GOOGLE_AI_STUDIO_API_KEY: process.env.GOOGLE_AI_STUDIO_API_KEY,
        ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
        XAI_API_KEY: process.env.XAI_API_KEY,
        KEY_PEPPER: process.env.KEY_PEPPER,
        UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL ?? "https://example.com/dummy-redis",
        UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN ?? "placeholder-token",
        NODE_ENV: process.env.NODE_ENV,
        BYOK_KMS_KEY_V1_B64: process.env.BYOK_KMS_KEY_V1_B64,
        BYOK_ACTIVE_KEY_VERSION: process.env.BYOK_ACTIVE_KEY_VERSION,
    };

    configureRuntime(bindings);
}
