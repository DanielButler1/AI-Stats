// src/routes/index.ts
import type { Hono } from "hono";
import type { GatewayBindings } from "@/runtime/env";

import { registerRootRoute } from "./root";
import { registerMainEndpoints } from "./main-endpoints";
import { registerGenerationRoute } from "./getGeneration-route";
import { registerHealthRoute } from "./healthz-route";
import { registerModelsRoute } from "./models-route";
import { registerPlaceholderRoutes } from "./placeholder-routes";
import { registerFilesRoutes } from "./files-routes";
import { registerBatchRoutes } from "./batches-routes";
import { registerAnalyticsRoute } from "./analytics-route";

export function registerRoutes(app: Hono<{ Bindings: GatewayBindings }>) {
    // Non-versioned root
    registerRootRoute(app);

    // Versioned API
    registerMainEndpoints(app);
    registerGenerationRoute(app);
    registerHealthRoute(app);
    registerModelsRoute(app);
    registerPlaceholderRoutes(app);
    registerFilesRoutes(app);
    registerBatchRoutes(app);
    registerAnalyticsRoute(app);
}
