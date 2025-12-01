# @ai-stats/ts-sdk

TypeScript client for the AI Stats Gateway. The SDK is generated from `apps/docs/openapi/v1/openapi.json` and wrapped with a small helper class for the common “AI SDK” style helpers (generate/stream and resource getters).

## Generator workflow

1. `pnpm openapi:lint` - validate the spec.
2. `pnpm openapi:gen` - regenerate all SDKs (TS, Py, and preview SDKs for other languages).
3. `pnpm --filter @ai-stats/ts-sdk build` - compile wrapper + generated code into `dist/`.

The generated directory (`src/gen`) is committed so diffs are visible in PRs. Regenerate whenever the API spec changes.

## Usage

```ts
import { AIStats, MODEL_IDS } from "@ai-stats/ts-sdk";

const client = new AIStats({ apiKey: process.env.AI_STATS_API_KEY! });

// text
const completion = await client.generateText({
  model: MODEL_IDS[0],
  messages: [{ role: "user", content: "Say hi." }],
});

// streaming text
for await (const chunk of client.streamText({
  model: MODEL_IDS[0],
  messages: [{ role: "user", content: "Stream hi." }],
})) {
  process.stdout.write(chunk);
}

// models
const models = await client.getModels();
console.log(models.data.map((m) => m.id));

// images, embeddings, moderation, video, speech, transcription
await client.generateImage({ model: "image-alpha", prompt: "A purple nebula" });
await client.generateEmbedding({ input: "hello", model: MODEL_IDS[0] });
await client.generateModeration({ model: MODEL_IDS[0], input: "Safe?" });
await client.generateVideo({ model: "video-alpha", prompt: "A calm ocean" });
await client.generateSpeech({ model: "tts-alpha", input: "Hello!" });
await client.generateTranscription({ model: "whisper-alpha", file: "<base64>" });
```

## Smoke test

`pnpm --filter @ai-stats/ts-sdk run test:smoke` runs `packages/sdk-ts/scripts/smoke.ts` against the public gateway. Set `AI_STATS_API_KEY` (and optionally `AI_STATS_BASE_URL`) before running it.
