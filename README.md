# AI Stats Gateway

> _Open access to the world’s AI models — built in public._

> ⚡ A note from Daniel
> I want everyone to have access to powerful AI tools — affordably, transparently, and without corporate lock-ins.
>
> Right now, though, I’m an indie developer funding this project myself. That means prices are a bit higher than the big players for the moment — not because I want them to be, but because it’s what keeps the lights on and the servers running.
>
> Every person who supports or uses this project helps bring it closer to the point where I can lower prices for everyone. Your support genuinely means the world to me — thank you for helping make this vision possible.

AI Stats Gateway is an open, transparent platform that tracks, compares, and connects large language models across every major provider.  
It exists to make AI **accessible**, **interoperable**, and **free from vendor lock-in**.

---

### 🌍 What It Is

AI Stats is made up of three main parts:

| Part                       | Description                                                       |
| -------------------------- | ----------------------------------------------------------------- |
| [`apps/web`](./apps/web)   | The public website — explore, compare, and visualise models.      |
| [`apps/api`](./apps/api)   | The gateway API — a unified layer that routes to any AI provider. |
| [`apps/docs`](./apps/docs) | The documentation site — a collaborative knowledge base.          |

Each one plays a part in a single mission:  
**to make every AI model available through one open gateway.**

---

### 💡 Why It Exists

AI is the most profound technology in human history — but access to it is increasingly fragmented, closed, and centralised.  
AI Stats was built to change that.

-   **No lock-ins.** Anyone can use, fork, or extend it.
-   **No secrets.** All data and code are open.
-   **No borders.** It’s built for everyone, together.

---

### 🧩 Contributing

You don’t need to be an expert to contribute — just curious.  
There are many ways to help:

-   Add or improve model data
-   Write documentation or guides
-   Suggest ideas and features
-   Fix a bug or improve a UI component

👉 [Open an issue](https://github.com/DanielButler1/AI-Stats/issues) or [start a discussion](https://github.com/DanielButler1/AI-Stats/discussions).  
Every contribution matters.

---

### 🛠️ Tech at a Glance

-   **Next.js 15** for the website
-   **Cloudflare Workers + Hono** for the API gateway
-   **Supabase** for data
-   **Mintlify** for documentation
-   **Vercel + Cloudflare** for deployment

---

### 📜 License

AI Stats Gateway is free software, built to stay in the commons.

-   **Core apps** (`apps/web`, `apps/api`, `apps/docs` and other server-side code in this repo) are licensed under the  
    **GNU Affero General Public License v3.0 (AGPL-3.0)**.
-   **Client SDKs** (for example `packages/sdk-js` and `packages/sdk-py`) are licensed under the  
    **MIT Licence** for easy use in any application.

What this means in practice:

-   You are free to **run, self-host, modify, and deploy** AI Stats Gateway.
-   If you **modify** the core and run it for others over a network or distribute it, you must  
    **publish your modifications under AGPL-3.0 as well**.
-   You can use the SDKs in **open or closed-source projects** without worrying about copyleft.

> “AI should belong to humanity — not just the highest bidder — and so should the tools that connect to it.”
