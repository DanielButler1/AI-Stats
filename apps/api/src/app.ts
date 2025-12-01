import { Hono } from "hono";
import type { GatewayBindings } from "./runtime/env";
import { registerRootRoute } from "./routes/root";
import { registerMainEndpoints } from "./routes/main-endpoints";
import { registerGenerationRoute } from "./routes/generation";
import { registerHealthRoute } from "./routes/health";
import { registerModelsRoute } from "./routes/models";
import { registerPlaceholderRoutes } from "./routes/placeholders";

const app = new Hono<{ Bindings: GatewayBindings }>();

registerRootRoute(app);
registerMainEndpoints(app);
registerGenerationRoute(app);
registerHealthRoute(app);
registerModelsRoute(app);
registerPlaceholderRoutes(app);

export default app;
