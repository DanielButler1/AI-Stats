import type { ProviderConfig, ProviderMetrics, ProviderState, Summary, ProviderKey } from "./types";
import JSZip from 'jszip';

export const PROVIDERS: ProviderConfig[] = [
	{
		key: "chatgpt",
		name: "ChatGPT",
		accent: "from-emerald-400/80 via-emerald-500/45 to-emerald-700/40",
		description: "Upload your ChatGPT chat archive (.zip export).",
		logo: "/logos/openai.svg",
	},
	{
		key: "claude",
		name: "Claude",
		accent: "from-amber-300/80 via-orange-400/45 to-amber-600/45",
		description: "Add transcripts from Claude (JSON/CSV).",
		logo: "/logos/anthropic.svg",
	},
	{
		key: "gemini",
		name: "Gemini",
		accent: "from-sky-400/80 via-blue-500/45 to-indigo-600/45",
		description: "Drop your Gemini activity export.",
		logo: "/logos/google.svg",
	},
	{
		key: "grok",
		name: "Grok",
		accent: "from-fuchsia-400/80 via-purple-500/45 to-indigo-600/45",
		description: "Share Grok conversation logs.",
		logo: "/logos/grok.svg",
	},
	{
		key: "t3",
		name: "T3 Chat",
		accent: "from-rose-400/80 via-pink-500/45 to-red-600/45",
		description: "Upload your T3 Chat export bundle.",
		logo: "/logos/t3.svg",
	},
	{
		key: "scira",
		name: "Scira AI",
		accent: "from-lime-400/80 via-teal-500/45 to-emerald-600/45",
		description: "Drop Scira AI conversation JSON.",
		logo: "/logos/scira.svg",
	},
];

export const DAY_NAMES = [
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
	"Sunday",
];

export function hashString(input: string): number {
	let hash = 0;
	for (let i = 0; i < input.length; i++) {
		hash = (hash << 5) - hash + input.charCodeAt(i);
		hash |= 0;
	}
	return Math.abs(hash);
}

export function rngFromSeed(seed: number) {
	let value = seed;
	return () => {
		value = (value * 1664525 + 1013904223) % 4294967296;
		return value / 4294967296;
	};
}

function getMessagesInOrder(mapping: any) {
	const messages: any[] = [];
	const visited = new Set();

	function traverse(id: string) {
		if (visited.has(id)) return;
		visited.add(id);
		const node = mapping[id];
		if (node.message) messages.push(node);
		for (const child of node.children || []) {
			traverse(child);
		}
	}

	for (const id in mapping) {
		if (!mapping[id].parent) traverse(id);
	}

	return messages;
}

export async function simulateProviderParse(
	provider: ProviderConfig,
	file: File
): Promise<ProviderMetrics> {
	if (provider.key === 'chatgpt') {
		// Real parsing for ChatGPT
		const zip = await JSZip.loadAsync(file);
		const conversationsFile = zip.file('conversations.json');
		if (!conversationsFile) throw new Error('conversations.json not found in zip');

		const json = await conversationsFile.async('text');
		const conversations = JSON.parse(json);

		let totalMessages = 0;
		let totalWords = 0;
		let totalTokens = 0;
		let responseTimes: number[] = [];
		let dayCounts = new Map<string, number>();
		let hourCounts = new Map<number, number>();
		let wordCounts = new Map<string, number>();
		let longestThread = 0;
		let largestPrompt = 0;
		let dates = new Set<string>();

		for (const conv of conversations) {
			const messages = getMessagesInOrder(conv.mapping);
			messages.sort((a, b) => (a.message?.create_time || 0) - (b.message?.create_time || 0));
			longestThread = Math.max(longestThread, messages.length);

			let prevTime: number | null = null;
			for (const msg of messages) {
				if (!msg.message) continue;
				const author = msg.message.author.role;
				if (author === 'user' || author === 'assistant') {
					const contentType = msg.message.content.content_type;
					if (contentType !== 'text') continue; // Only process text messages
					const parts = msg.message.content.parts;
					if (!Array.isArray(parts)) continue;
					const content = parts.join(' ');
					const words = content.split(/\s+/).filter(w => w).length;
					totalWords += words;
					totalTokens += Math.round(words * 1.2); // Rough token estimate

					if (author === 'user') {
						largestPrompt = Math.max(largestPrompt, words);
					}

					// Top words
					content.toLowerCase().split(/\s+/).forEach(word => {
						if (word.length > 3 && /^[a-z]+$/i.test(word)) {
							wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
						}
					});

					const time = msg.message.create_time;
					if (time) {
						const date = new Date(time * 1000);
						const day = DAY_NAMES[date.getDay()];
						dates.add(date.toISOString().split('T')[0]);
						dayCounts.set(day, (dayCounts.get(day) || 0) + 1);
						const hour = date.getHours();
						hourCounts.set(hour, (hourCounts.get(hour) || 0) + 1);

						if (prevTime !== null && author === 'assistant') {
							responseTimes.push(time - prevTime);
						}
						prevTime = time;
					}
					totalMessages++;
				}
			}
		}

		const averageResponseSeconds = responseTimes.length ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length : 0;
		const totalMinutes = responseTimes.reduce((a, b) => a + b, 0) / 60;

		const topDay = [...dayCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || DAY_NAMES[0];
		const topHour = [...hourCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || 12;
		const topWords = [...wordCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5).map(([w]) => w);

		const streakDays = dates.size; // Simple: unique days

		const emojiMood = '??'; // Placeholder, could be based on sentiment

		return {
			tokens: totalTokens,
			messages: totalMessages,
			words: totalWords,
			responseMinutes: Math.round(totalMinutes),
			topWords,
			topDay,
			topHour,
			longestThreadMessages: longestThread,
			largestPromptWords: largestPrompt,
			averageResponseSeconds: Math.round(averageResponseSeconds),
			streakDays,
			emojiMood,
		};
	}

	// Simulate for other providers
	const seed = hashString(`${provider.key}-${file.name}-${file.size}`);
	const random = rngFromSeed(seed);

	const delay = 800 + Math.round(random() * 900 + random() * 600 * random());
	await new Promise((resolve) => setTimeout(resolve, delay));

	const tokens = Math.round(20_000 + random() * 180_000);
	const messages = Math.round(tokens / (30 + random() * 40));
	const words = Math.round(tokens / (2.7 + random() * 0.8));
	const responseMinutes = Math.round((messages * (5 + random() * 12)) / 60);

	const topWordsCandidates = [
		"agents",
		"benchmark",
		"prompt",
		"latency",
		"reasoning",
		"workflow",
		"alignment",
		"multimodal",
		"dataset",
		"story",
		"design",
	];
	const topWords = Array.from({ length: 5 }, (_, i) => {
		const index = Math.floor(random() * topWordsCandidates.length);
		return topWordsCandidates[(index + i) % topWordsCandidates.length];
	});

	const topDay = DAY_NAMES[Math.floor(random() * DAY_NAMES.length)];
	const topHour = Math.floor(random() * 24);
	const longestThreadMessages = Math.max(
		4,
		Math.round(messages * 0.05 + random() * 20)
	);
	const largestPromptWords = Math.max(
		20,
		Math.round(words * 0.02 + random() * 200)
	);
	const averageResponseSeconds = Math.round(12 + random() * 35);
	const streakDays = Math.max(1, Math.round(random() * 10 + random() * 7));

	const moods = ["??", "??", "??", "??", "??", "??", "???"];

	return {
		tokens,
		messages,
		words,
		responseMinutes,
		topWords,
		topDay,
		topHour,
		longestThreadMessages,
		largestPromptWords,
		averageResponseSeconds,
		streakDays,
		emojiMood: moods[Math.floor(random() * moods.length)],
	};
}

export function aggregateSummary(
	providers: ProviderConfig[],
	state: Record<ProviderKey, ProviderState>
): Summary | null {
	const entries = providers
		.map((config) => {
			const metrics = state[config.key]?.metrics;
			return metrics ? { config, metrics } : null;
		})
		.filter(
			(
				item
			): item is { config: ProviderConfig; metrics: ProviderMetrics } =>
				Boolean(item)
		);

	if (entries.length === 0) {
		return null; // Only generate summary when at least one provider is ready
	}

	let totalTokens = 0;
	let totalMessages = 0;
	let totalWords = 0;
	let totalMinutes = 0;
	let totalResponseSeconds = 0;
	let totalResponseCount = 0;

	const wordCounts = new Map<string, number>();
	const dayCounts = new Map<string, number>();
	const hourCounts = new Map<number, number>();

	let longestThread = { provider: entries[0]!.config.key, messages: 0 };
	let largestPrompt = { provider: entries[0]!.config.key, words: 0 };
	let bestStreak = { provider: entries[0]!.config.key, days: 0 };

	let emojiMood = "?";

	const providersBreakdown = entries.map(({ config, metrics }) => {
		totalTokens += metrics.tokens;
		totalMessages += metrics.messages;
		totalWords += metrics.words;
		totalMinutes += metrics.responseMinutes;
		totalResponseSeconds +=
			metrics.averageResponseSeconds * metrics.messages;
		totalResponseCount += metrics.messages;

		if (metrics.longestThreadMessages > longestThread.messages) {
			longestThread = {
				provider: config.key,
				messages: metrics.longestThreadMessages,
			};
		}

		if (metrics.largestPromptWords > largestPrompt.words) {
			largestPrompt = {
				provider: config.key,
				words: metrics.largestPromptWords,
			};
		}

		if (metrics.streakDays > bestStreak.days) {
			bestStreak = {
				provider: config.key,
				days: metrics.streakDays,
			};
			emojiMood = metrics.emojiMood;
		}

		metrics.topWords.forEach((word, index) => {
			const weight = 4 - index;
			wordCounts.set(word, (wordCounts.get(word) ?? 0) + weight);
		});

		dayCounts.set(
			metrics.topDay,
			(dayCounts.get(metrics.topDay) ?? 0) + metrics.messages
		);

		hourCounts.set(
			metrics.topHour,
			(hourCounts.get(metrics.topHour) ?? 0) + metrics.messages
		);

		return {
			...config,
			tokens: metrics.tokens,
			messages: metrics.messages,
			responseMinutes: metrics.responseMinutes,
		};
	});

	const topWords = [...wordCounts.entries()]
		.sort((a, b) => b[1] - a[1])
		.slice(0, 8)
		.map(([word]) => word);

	const topDay =
		[...dayCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ??
		DAY_NAMES[0];

	const topHour =
		[...hourCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? 12;

	const averageResponseSeconds =
		totalResponseCount > 0
			? Math.round(totalResponseSeconds / totalResponseCount)
			: 0;

	const funFact = `You chatted the hardest on ${topDay}, clocking ${dayCounts.get(topDay) ?? 0
		} messages -- with ${providersBreakdown[0]?.name ?? "AI"
		} leading the charge.`;

	return {
		totalTokens,
		totalMessages,
		totalWords,
		totalMinutes,
		topWords,
		topDay,
		topHour,
		averageResponseSeconds,
		longestThread,
		largestPrompt,
		bestStreak,
		providersBreakdown: providersBreakdown.sort(
			(a, b) => b.tokens - a.tokens
		),
		funFact,
		emojiMood,
	};
}

export function formatNumber(value: number): string {
	if (value >= 1_000_000) {
		return `${(value / 1_000_000).toFixed(1)}M`;
	}
	if (value >= 1_000) {
		return `${(value / 1_000).toFixed(1)}k`;
	}
	return value.toLocaleString();
}