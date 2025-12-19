import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const MODELS_ROOT = path.join(REPO_ROOT, "apps", "web", "src", "data", "models");
const PRICING_ROOT = path.join(
	REPO_ROOT,
	"apps",
	"web",
	"src",
	"data",
	"pricing"
);

const providerSlugMap: Record<string, string> = {
	"google-ai-studio": "google",
};

interface Provider {
	name: string;
	fetchModels: () => Promise<string[]>;
}

function normalizeModelKey(value: string): string {
	return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

async function fetchOpenAIModels(): Promise<string[]> {
	const apiKey = process.env.OPENAI_API_KEY;
	if (!apiKey) return [];
	try {
		const response = await fetch("https://api.openai.com/v1/models", {
			headers: { Authorization: `Bearer ${apiKey}` }
		});
		if (!response.ok) return [];
		const data = await response.json();
		return data.data.map((m: any) => `openai/${m.id}`);
	} catch {
		return [];
	}
}

async function fetchAnthropicModels(): Promise<string[]> {
	const apiKey = process.env.ANTHROPIC_API_KEY;
	if (!apiKey) return [];
	try {
		const response = await fetch("https://api.anthropic.com/v1/models", {
			headers: { "x-api-key": apiKey, "anthropic-version": "2023-06-01" }
		});
		if (!response.ok) return [];
		const data = await response.json();
		return data.data.map((m: any) => `anthropic/${m.id}`);
	} catch {
		return [];
	}
}

async function fetchMistralModels(): Promise<string[]> {
	const apiKey = process.env.MISTRAL_API_KEY;
	if (!apiKey) return [];
	try {
		const response = await fetch("https://api.mistral.ai/v1/models", {
			headers: { Authorization: `Bearer ${apiKey}` }
		});
		if (!response.ok) return [];
		const data = await response.json();
		return data.data.map((m: any) => `mistral/${m.id}`);
	} catch {
		return [];
	}
}

async function fetchXAIModels(): Promise<string[]> {
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) return [];
	try {
		const response = await fetch("https://api.x.ai/v1/models", {
			headers: { Authorization: `Bearer ${apiKey}` }
		});
		if (!response.ok) return [];
		const data = await response.json();
		return data.data.map((m: any) => `x-ai/${m.id}`);
	} catch {
		return [];
	}
}

async function fetchDeepSeekModels(): Promise<string[]> {
	const apiKey = process.env.DEEPSEEK_API_KEY;
	if (!apiKey) return [];
	try {
		const response = await fetch("https://api.deepseek.com/models", {
			headers: { Authorization: `Bearer ${apiKey}` }
		});
		if (!response.ok) return [];
		const data = await response.json();
		return data.data.map((m: any) => `deepseek/${m.id}`);
	} catch {
		return [];
	}
}

async function fetchGoogleModels(): Promise<string[]> {
	const apiKey = process.env.GOOGLE_API_KEY;
	if (!apiKey) return [];
	try {
		const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
		if (!response.ok) return [];
		const data = await response.json();
		return data.models.map((m: any) => `google/${m.name.split('/')[1]}`);
	} catch {
		return [];
	}
}

const providers: Provider[] = [
	{ name: "OpenAI", fetchModels: fetchOpenAIModels },
	{ name: "Mistral", fetchModels: fetchMistralModels },
	{ name: "Anthropic", fetchModels: fetchAnthropicModels },
	{ name: "Google", fetchModels: fetchGoogleModels },
	{ name: "xAI", fetchModels: fetchXAIModels },
	{ name: "DeepSeek", fetchModels: fetchDeepSeekModels },
];

function listModelFiles(root: string): string[] {
	const entries = fs.readdirSync(root, { withFileTypes: true });
	const files: string[] = [];

	for (const org of entries.filter((entry) => entry.isDirectory())) {
		const orgPath = path.join(root, org.name);
		const models = fs.readdirSync(orgPath, { withFileTypes: true });
		for (const model of models.filter((entry) => entry.isDirectory())) {
			const modelPath = path.join(orgPath, model.name, "model.json");
			if (fs.existsSync(modelPath)) {
				files.push(modelPath);
			}
		}
	}

	return files;
}

function listPricingFiles(root: string): string[] {
	if (!fs.existsSync(root)) return [];
	const providers = fs.readdirSync(root, { withFileTypes: true });
	const files: string[] = [];

	for (const provider of providers.filter((entry) => entry.isDirectory())) {
		const providerPath = path.join(root, provider.name);
		const endpoints = fs.readdirSync(providerPath, { withFileTypes: true });
		for (const endpoint of endpoints.filter((entry) => entry.isDirectory())) {
			const endpointPath = path.join(providerPath, endpoint.name);
			const models = fs.readdirSync(endpointPath, { withFileTypes: true });
			for (const model of models.filter((entry) => entry.isDirectory())) {
				const pricingPath = path.join(
					endpointPath,
					model.name,
					"pricing.json"
				);
				if (fs.existsSync(pricingPath)) {
					files.push(pricingPath);
				}
			}
		}
	}

	return files;
}

function getExistingModelIds(): Set<string> {
	const modelFiles = listModelFiles(MODELS_ROOT);
	const ids = new Set<string>();
	for (const file of modelFiles) {
		try {
			const raw = fs.readFileSync(file, "utf-8");
			const data = JSON.parse(raw);
			if (data.model_id) ids.add(data.model_id);
		} catch { }
	}
	return ids;
}

function getExistingProviderModelSlugs(): Set<string> {
	const pricingFiles = listPricingFiles(PRICING_ROOT);
	const ids = new Set<string>();

	for (const file of pricingFiles) {
		try {
			const raw = fs.readFileSync(file, "utf-8");
			const data = JSON.parse(raw);
			const providerSlug =
				typeof data.provider_slug === "string"
					? data.provider_slug
					: typeof data.api_provider_id === "string"
						? data.api_provider_id
						: "";
			const providerPrefix =
				providerSlugMap[providerSlug] ?? providerSlug;
			const providerModelSlug =
				typeof data.provider_model_slug === "string"
					? data.provider_model_slug
					: "";
			const modelId =
				typeof data.model_id === "string" ? data.model_id : "";

			if (providerPrefix && providerModelSlug) {
				ids.add(`${providerPrefix}/${providerModelSlug}`);
			} else if (modelId) {
				ids.add(modelId);
			}
		} catch { }
	}

	return ids;
}

async function sendDiscordWebhook(message: string) {
	const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
	if (!webhookUrl) return;
	const userId = process.env.DISCORD_USER_ID;
	const content = userId ? `<@${userId}>\n${message}` : message;
	const payload: { content: string; allowed_mentions?: { users: string[] } } =
		{
			content
		};
	if (userId) {
		payload.allowed_mentions = { users: [userId] };
	}
	try {
		await fetch(webhookUrl, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload)
		});
	} catch (error) {
		console.error("Failed to send Discord webhook:", error);
	}
}

async function main() {
	const existing = new Set([
		...getExistingModelIds(),
		...getExistingProviderModelSlugs()
	]);
	const existingNormalized = new Set(
		[...existing].map((value) => normalizeModelKey(value))
	);
	console.log(`Found ${existing.size} existing models.`);

	const newModels: { provider: string; models: string[] }[] = [];

	for (const provider of providers) {
		console.log(`Checking ${provider.name}...`);
		const models = await provider.fetchModels();
		console.log(`Fetched ${models.length} models from ${provider.name}.`);
		const newOnes = models.filter((model) => {
			if (existing.has(model)) return false;
			return !existingNormalized.has(normalizeModelKey(model));
		});
		if (newOnes.length > 0) {
			newModels.push({ provider: provider.name, models: newOnes });
		}
	}

	if (newModels.length === 0) {
		console.log("No new models found.");
		return;
	}

	let message = `🚀 New models detected:\n\n`;
	for (const { provider, models } of newModels) {
		message += `**${provider}**: ${models.length} new\n`;
		message += models.map(m => `- ${m}`).join('\n');
		message += '\n\n';
	}

	console.log(message);
	await sendDiscordWebhook(message);
}

main().catch(console.error);
