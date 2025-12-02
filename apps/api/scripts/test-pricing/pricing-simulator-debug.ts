export function withPricingDebug<T>(enabled: boolean, fn: () => T): T {
    const prevGlobal = typeof globalThis !== "undefined" ? (globalThis as any).__pricingDebug : undefined;
    const prevEnv = typeof process !== "undefined" ? process.env?.PRICING_SIMULATOR_DEBUG : undefined;
    if (enabled) {
        if (typeof globalThis !== "undefined") (globalThis as any).__pricingDebug = true;
        if (typeof process !== "undefined" && process.env) process.env.PRICING_SIMULATOR_DEBUG = "1";
    }
    try {
        return fn();
    } finally {
        if (enabled) {
            if (typeof globalThis !== "undefined") {
                if (prevGlobal === undefined) {
                    delete (globalThis as any).__pricingDebug;
                } else {
                    (globalThis as any).__pricingDebug = prevGlobal;
                }
            }
            if (typeof process !== "undefined" && process.env) {
                if (prevEnv === undefined) {
                    delete process.env.PRICING_SIMULATOR_DEBUG;
                } else {
                    process.env.PRICING_SIMULATOR_DEBUG = prevEnv;
                }
            }
        }
    }
}