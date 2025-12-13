# AI Stats Gateway

AI Stats Gateway is an open, transparent platform for tracking, comparing, and connecting large language models across major providers.  
It exists to make AI **accessible**, **interoperable**, and **free from vendor lock-in**.

---

## 🌍 What this repo contains

AI Stats is a monorepo made up of several apps and packages:

### Apps

| Path                       | Description                                                             |
| -------------------------- | ----------------------------------------------------------------------- |
| [`apps/web`](./apps/web)   | Public website - explore, compare, and visualise models.                |
| [`apps/api`](./apps/api)   | Gateway API (Beta) - a unified layer that routes to multiple providers. |
| [`apps/docs`](./apps/docs) | Documentation site - reference, guides, and concepts.                   |

### Packages (Beta)

| Path                                   | Description                                |
| -------------------------------------- | ------------------------------------------ |
| [`packages/sdk-ts`](./packages/sdk-ts) | TypeScript / JavaScript client SDK.        |
| [`packages/sdk-py`](./packages/sdk-py) | Python client SDK.                         |
| Other languages                        | Work In Progress SDKs for other languages. |

All of these are wired together to support a single mission:

> **Build the largest single information point for AI Models.**

---

## 💡 Why it exists

AI is becoming the most important general-purpose technology in human history - but access to it is increasingly fragmented, closed, and centralised.

AI Stats is built to push the other way:

-   **No lock-ins.** Use the gateway, self-host it, or fork it.
-   **No black boxes.** Data formats, routing, and pricing are all transparent.
-   **No borders.** Anyone, anywhere can use it and get value from it.

If you care about open infrastructure for AI, this project is for you.

---

## 🚀 Getting started (high level)

This is only a quick overview - see the docs for full details.

### Prerequisites

-   Node.js 20+
-   `pnpm`
-   A Supabase (or Postgres) instance
-   A Cloudflare account (for Workers)

### Basic setup

```bash
# Clone the repo
git clone https://github.com/AI-Stats/AI-Stats.git
cd AI-Stats

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# then fill in the required values (Supabase, Cloudflare, providers, etc.)

# Run local development (example - adjust to your scripts)
pnpm dev
```

---

## The Future Of AI Stats

This project is designed to make AI more accessible, and as much data available in an easy to use and open way. Things can and will change, as we adapt to suggestions as well as learning as we go. We will make mistakes, however, we will learn from them and improve.

If you have any suggestions, please open an issue or a PR. We welcome contributions from the community to help make this project better for everyone.
We are excited about the future of AI Stats and the role it can play in democratising access to AI technologies.
