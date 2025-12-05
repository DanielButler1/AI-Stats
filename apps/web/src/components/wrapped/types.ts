export type ProviderKey = "chatgpt" | "claude" | "gemini" | "grok" | "t3" | "scira";

export type ProviderConfig = {
	key: ProviderKey;
	name: string;
	accent: string;
	description: string;
	logo?: string;
};

export type ProviderMetrics = {
	tokens: number;
	messages: number;
	words: number;
	responseMinutes: number;
	topWords: string[];
	topDay: string;
	topHour: number;
	longestThreadMessages: number;
	largestPromptWords: number;
	averageResponseSeconds: number;
	streakDays: number;
	emojiMood: string;
};

export type ProviderState = {
	file?: File;
	status: "idle" | "processing" | "ready" | "error";
	error?: string;
	metrics?: ProviderMetrics;
};

export type Summary = {
	totalTokens: number;
	totalMessages: number;
	totalWords: number;
	totalMinutes: number;
	topWords: string[];
	topDay: string;
	topHour: number;
	averageResponseSeconds: number;
	longestThread: {
		provider: ProviderKey;
		messages: number;
	};
	largestPrompt: {
		provider: ProviderKey;
		words: number;
	};
	bestStreak: {
		provider: ProviderKey;
		days: number;
	};
	providersBreakdown: Array<
		ProviderConfig & {
			tokens: number;
			messages: number;
			responseMinutes: number;
		}
	>;
	funFact: string;
	emojiMood: string;
};

export type Slide = {
	title: string;
	subtitle: string;
	content: React.ReactNode;
	accent: string;
};