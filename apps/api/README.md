# AI Stats Gateway API

The **AI Stats Gateway** is the open API layer that connects multiple AI providers under a single unified interface.  
It’s built on **Cloudflare Workers** with **Hono**, and serves as the backbone of the AI Stats ecosystem.

---

### 💡 Purpose

The gateway exists so developers can access any model — from OpenAI, Anthropic, Google, Mistral, and beyond — through one transparent, open endpoint.  
No hidden fees, no opaque routing, no lock-in.

---

### 🧠 What It Does

-   Routes requests to multiple providers seamlessly
-   Tracks latency, tokens, and costs transparently
-   Syncs events and analytics into Supabase
-   Supports metadata and benchmarking for every model

---

### ⚙️ Architecture

-   **Runtime:** Cloudflare Workers
-   **Framework:** Hono (TypeScript)
-   **Database:** Supabase
-   **Logging:** Axiom
-   **Monitoring:** Server-Timing headers and dashboards

---

### 🤝 Contributing

If you want to help improve routing, pricing, or observability logic — this is the right place.

You can:

-   Add new providers or endpoints
-   Optimise performance and caching
-   Improve type safety and structure
-   Expand metadata coverage

> This API is designed for everyone, not just those who can pay.  
> It’s the open foundation for truly global AI access.
