import { AIStats } from "../src";

const key = process.env.AI_STATS_API_KEY;
if (!key) throw new Error("Set AI_STATS_API_KEY");

async function main() {
  const client = new AIStats({
    apiKey: key,
    baseUrl: process.env.AI_STATS_BASE_URL || "https://api.ai-stats.phaseo.app/v1",
  });

  const res = await client.chatCompletions({
    model: "gpt-5-nano-2025-08-07",
    messages: [{ role: "user", content: "Say 'Hi'." }],
  });

  console.log("ok:", Boolean(res.id), res.model);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
