import { Hono } from "hono";
import type { GatewayBindings } from "./runtime/env";
import { registerRoutes } from "./routes";

const app = new Hono<{ Bindings: GatewayBindings }>();

registerRoutes(app);

export default app;
