# API service layout

- `app.ts`: Hono entrypoint. Uses `routes/index.ts` to register everything.
- `routes/`: Public HTTP surface, grouped by function (main endpoints, batches, files, models, health, analytics, generation, placeholders, root). `routes/index.ts` is the single place to wire them.
- `lib/`: Gateway internals.
  - `main-endpoints/`: pipeline stages (before/execute/after), provider adapters, telemetry, pricing, BYOK, and usage helpers.
  - `schemas.ts` / `types.ts`: shared request/response contracts.
  - `error-handler.ts`, `kv.ts`: common utilities.
- `runtime/`: environment bindings and runtime config.

This structure keeps the app entrypoint minimal while leaving provider/adapters and pipeline code under `lib/main-endpoints`.
