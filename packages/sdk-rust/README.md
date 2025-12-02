# AI Stats Rust SDK (preview)

Generated from the AI Stats Gateway OpenAPI spec. The current wrapper (`src/lib.rs`) exposes only the `models` endpoint.

Status:
- **Preview**: Not published yet. Will be released to crates.io once the client stabilises.
- Generate with `pnpm openapi:gen:rust`.

Usage (after generation):
```rust
let client = ai_stats_sdk_example::Client::new("<API_KEY>", "https://api.ai-stats.phaseo.app/v1");
let resp = client.get_models(None, Some(5), None).await?;
```

Python and TypeScript SDKs are fully supported today; other languages will follow soon.
