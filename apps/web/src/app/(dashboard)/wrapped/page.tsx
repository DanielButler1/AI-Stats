import RoadmapComingSoon from "@/components/(data)/RoadmapComingSoon";

export default function Page() {
	return (
		<RoadmapComingSoon
			milestoneKey="wrapped"
			overrides={{
				title: "AI Wrapped",
				subtitle: "See how you spent your time with AI this year",
				description:
					"Explore your AI usage patterns and insights from this year and beyond.",
				eta: "Nov 2025 → Dec 2025",
				breadcrumb: [
					{ label: "AI Stats", href: "/" },
					{ label: "Wrapped", href: "/wrapped" },
				],
			}}
		/>
	);
}

// "use client";

// import * as React from "react";
// import {
// 	type ChangeEvent,
// 	useCallback,
// 	useEffect,
// 	useMemo,
// 	useState,
// } from "react";
// import {
// 	Card,
// 	CardContent,
// 	CardDescription,
// 	CardFooter,
// 	CardHeader,
// 	CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import {
// 	AlertCircle,
// 	ArrowLeft,
// 	ArrowRight,
// 	ArrowUpRight,
// 	CheckCircle2,
// 	Download,
// 	Loader2,
// 	Sparkles,
// 	UploadCloud,
// 	X,
// 	Share2,
// } from "lucide-react";
// import Image from "next/image";
// import Link from "next/link";
// import { motion, AnimatePresence } from "motion/react";
// import { cn } from "@/lib/utils";

// type ProviderKey = "chatgpt" | "claude" | "gemini" | "grok" | "t3" | "scira";

// type ProviderConfig = {
// 	key: ProviderKey;
// 	name: string;
// 	accent: string;
// 	description: string;
// 	logo?: string;
// };

// type ProviderMetrics = {
// 	tokens: number;
// 	messages: number;
// 	words: number;
// 	responseMinutes: number;
// 	topWords: string[];
// 	topDay: string;
// 	topHour: number;
// 	longestThreadMessages: number;
// 	largestPromptWords: number;
// 	averageResponseSeconds: number;
// 	streakDays: number;
// 	emojiMood: string;
// };

// type ProviderState = {
// 	file?: File;
// 	status: "idle" | "processing" | "ready" | "error";
// 	error?: string;
// 	metrics?: ProviderMetrics;
// };

// type Summary = {
// 	totalTokens: number;
// 	totalMessages: number;
// 	totalWords: number;
// 	totalMinutes: number;
// 	topWords: string[];
// 	topDay: string;
// 	topHour: number;
// 	averageResponseSeconds: number;
// 	longestThread: {
// 		provider: ProviderKey;
// 		messages: number;
// 	};
// 	largestPrompt: {
// 		provider: ProviderKey;
// 		words: number;
// 	};
// 	bestStreak: {
// 		provider: ProviderKey;
// 		days: number;
// 	};
// 	providersBreakdown: Array<
// 		ProviderConfig & {
// 			tokens: number;
// 			messages: number;
// 			responseMinutes: number;
// 		}
// 	>;
// 	funFact: string;
// 	emojiMood: string;
// };

// const PROVIDERS: ProviderConfig[] = [
// 	{
// 		key: "chatgpt",
// 		name: "ChatGPT",
// 		accent: "from-emerald-400/80 via-emerald-500/45 to-emerald-700/40",
// 		description: "Upload your ChatGPT chat archive (.json/.zip export).",
// 		logo: "/logos/openai.svg",
// 	},
// 	{
// 		key: "claude",
// 		name: "Claude",
// 		accent: "from-amber-300/80 via-orange-400/45 to-amber-600/45",
// 		description: "Add transcripts from Claude (JSON/CSV).",
// 		logo: "/logos/anthropic.svg",
// 	},
// 	{
// 		key: "gemini",
// 		name: "Gemini",
// 		accent: "from-sky-400/80 via-blue-500/45 to-indigo-600/45",
// 		description: "Drop your Gemini activity export.",
// 		logo: "/logos/google.svg",
// 	},
// 	{
// 		key: "grok",
// 		name: "Grok",
// 		accent: "from-fuchsia-400/80 via-purple-500/45 to-indigo-600/45",
// 		description: "Share Grok conversation logs.",
// 		logo: "/logos/xai.svg",
// 	},
// 	{
// 		key: "t3",
// 		name: "T3 Chat",
// 		accent: "from-rose-400/80 via-pink-500/45 to-red-600/45",
// 		description: "Upload your T3 Chat export bundle.",
// 		logo: "/logos/t3.svg",
// 	},
// 	{
// 		key: "scira",
// 		name: "Scira AI",
// 		accent: "from-lime-400/80 via-teal-500/45 to-emerald-600/45",
// 		description: "Drop Scira AI conversation JSON.",
// 		logo: "/logos/scira.svg",
// 	},
// ];

// const DAY_NAMES = [
// 	"Monday",
// 	"Tuesday",
// 	"Wednesday",
// 	"Thursday",
// 	"Friday",
// 	"Saturday",
// 	"Sunday",
// ];

// function hashString(input: string): number {
// 	let hash = 0;
// 	for (let i = 0; i < input.length; i++) {
// 		hash = (hash << 5) - hash + input.charCodeAt(i);
// 		hash |= 0;
// 	}
// 	return Math.abs(hash);
// }

// function rngFromSeed(seed: number) {
// 	let value = seed;
// 	return () => {
// 		value = (value * 1664525 + 1013904223) % 4294967296;
// 		return value / 4294967296;
// 	};
// }

// async function simulateProviderParse(
// 	provider: ProviderConfig,
// 	file: File
// ): Promise<ProviderMetrics> {
// 	const seed = hashString(`${provider.key}-${file.name}-${file.size}`);
// 	const random = rngFromSeed(seed);

// 	const delay = 800 + Math.round(random() * 900 + random() * 600 * random());
// 	await new Promise((resolve) => setTimeout(resolve, delay));

// 	const tokens = Math.round(20_000 + random() * 180_000);
// 	const messages = Math.round(tokens / (30 + random() * 40));
// 	const words = Math.round(tokens / (2.7 + random() * 0.8));
// 	const responseMinutes = Math.round((messages * (5 + random() * 12)) / 60);

// 	const topWordsCandidates = [
// 		"agents",
// 		"benchmark",
// 		"prompt",
// 		"latency",
// 		"reasoning",
// 		"workflow",
// 		"alignment",
// 		"multimodal",
// 		"dataset",
// 		"story",
// 		"design",
// 	];
// 	const topWords = Array.from({ length: 5 }, (_, i) => {
// 		const index = Math.floor(random() * topWordsCandidates.length);
// 		return topWordsCandidates[(index + i) % topWordsCandidates.length];
// 	});

// 	const topDay = DAY_NAMES[Math.floor(random() * DAY_NAMES.length)];
// 	const topHour = Math.floor(random() * 24);
// 	const longestThreadMessages = Math.max(
// 		4,
// 		Math.round(messages * 0.05 + random() * 20)
// 	);
// 	const largestPromptWords = Math.max(
// 		20,
// 		Math.round(words * 0.02 + random() * 200)
// 	);
// 	const averageResponseSeconds = Math.round(12 + random() * 35);
// 	const streakDays = Math.max(1, Math.round(random() * 10 + random() * 7));

// 	const moods = ["??", "??", "??", "??", "??", "??", "???"];

// 	return {
// 		tokens,
// 		messages,
// 		words,
// 		responseMinutes,
// 		topWords,
// 		topDay,
// 		topHour,
// 		longestThreadMessages,
// 		largestPromptWords,
// 		averageResponseSeconds,
// 		streakDays,
// 		emojiMood: moods[Math.floor(random() * moods.length)],
// 	};
// }

// function aggregateSummary(
// 	providers: ProviderConfig[],
// 	state: Record<ProviderKey, ProviderState>
// ): Summary | null {
// 	const entries = providers
// 		.map((config) => {
// 			const metrics = state[config.key]?.metrics;
// 			return metrics ? { config, metrics } : null;
// 		})
// 		.filter(
// 			(
// 				item
// 			): item is { config: ProviderConfig; metrics: ProviderMetrics } =>
// 				Boolean(item)
// 		);

// 	if (entries.length === 0) {
// 		return null;
// 	}

// 	let totalTokens = 0;
// 	let totalMessages = 0;
// 	let totalWords = 0;
// 	let totalMinutes = 0;
// 	let totalResponseSeconds = 0;
// 	let totalResponseCount = 0;

// 	const wordCounts = new Map<string, number>();
// 	const dayCounts = new Map<string, number>();
// 	const hourCounts = new Map<number, number>();

// 	let longestThread = { provider: entries[0]!.config.key, messages: 0 };
// 	let largestPrompt = { provider: entries[0]!.config.key, words: 0 };
// 	let bestStreak = { provider: entries[0]!.config.key, days: 0 };

// 	let emojiMood = "?";

// 	const providersBreakdown = entries.map(({ config, metrics }) => {
// 		totalTokens += metrics.tokens;
// 		totalMessages += metrics.messages;
// 		totalWords += metrics.words;
// 		totalMinutes += metrics.responseMinutes;
// 		totalResponseSeconds +=
// 			metrics.averageResponseSeconds * metrics.messages;
// 		totalResponseCount += metrics.messages;

// 		if (metrics.longestThreadMessages > longestThread.messages) {
// 			longestThread = {
// 				provider: config.key,
// 				messages: metrics.longestThreadMessages,
// 			};
// 		}

// 		if (metrics.largestPromptWords > largestPrompt.words) {
// 			largestPrompt = {
// 				provider: config.key,
// 				words: metrics.largestPromptWords,
// 			};
// 		}

// 		if (metrics.streakDays > bestStreak.days) {
// 			bestStreak = {
// 				provider: config.key,
// 				days: metrics.streakDays,
// 			};
// 			emojiMood = metrics.emojiMood;
// 		}

// 		metrics.topWords.forEach((word, index) => {
// 			const weight = 4 - index;
// 			wordCounts.set(word, (wordCounts.get(word) ?? 0) + weight);
// 		});

// 		dayCounts.set(
// 			metrics.topDay,
// 			(dayCounts.get(metrics.topDay) ?? 0) + metrics.messages
// 		);

// 		hourCounts.set(
// 			metrics.topHour,
// 			(hourCounts.get(metrics.topHour) ?? 0) + metrics.messages
// 		);

// 		return {
// 			...config,
// 			tokens: metrics.tokens,
// 			messages: metrics.messages,
// 			responseMinutes: metrics.responseMinutes,
// 		};
// 	});

// 	const topWords = [...wordCounts.entries()]
// 		.sort((a, b) => b[1] - a[1])
// 		.slice(0, 8)
// 		.map(([word]) => word);

// 	const topDay =
// 		[...dayCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ??
// 		DAY_NAMES[0];

// 	const topHour =
// 		[...hourCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? 12;

// 	const averageResponseSeconds =
// 		totalResponseCount > 0
// 			? Math.round(totalResponseSeconds / totalResponseCount)
// 			: 0;

// 	const funFact = `You chatted the hardest on ${topDay}, clocking ${
// 		dayCounts.get(topDay) ?? 0
// 	} messages -- with ${
// 		providersBreakdown[0]?.name ?? "AI"
// 	} leading the charge.`;

// 	return {
// 		totalTokens,
// 		totalMessages,
// 		totalWords,
// 		totalMinutes,
// 		topWords,
// 		topDay,
// 		topHour,
// 		averageResponseSeconds,
// 		longestThread,
// 		largestPrompt,
// 		bestStreak,
// 		providersBreakdown: providersBreakdown.sort(
// 			(a, b) => b.tokens - a.tokens
// 		),
// 		funFact,
// 		emojiMood,
// 	};
// }

// function formatNumber(value: number): string {
// 	if (value >= 1_000_000) {
// 		return `${(value / 1_000_000).toFixed(1)}M`;
// 	}
// 	if (value >= 1_000) {
// 		return `${(value / 1_000).toFixed(1)}k`;
// 	}
// 	return value.toLocaleString();
// }

// const UploadCard: React.FC<{
// 	config: ProviderConfig;
// 	state: ProviderState;
// 	onFileSelected: (file: File | undefined) => void;
// }> = ({ config, state, onFileSelected }) => {
// 	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
// 		const file = event.target.files?.[0];
// 		onFileSelected(file);
// 		event.target.value = "";
// 	};

// 	const statusContent = (() => {
// 		switch (state.status) {
// 			case "processing":
// 				return (
// 					<div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
// 						<Loader2 className="h-4 w-4 animate-spin" />
// 						Processing your archive...
// 					</div>
// 				);
// 			case "ready":
// 				return (
// 					<div className="flex flex-wrap items-center gap-2 text-sm text-emerald-600 dark:text-emerald-300">
// 						<CheckCircle2 className="h-4 w-4" />
// 						Ready * {formatNumber(state.metrics!.messages)} msgs *{" "}
// 						{formatNumber(state.metrics!.tokens)} tokens
// 					</div>
// 				);
// 			case "error":
// 				return (
// 					<div className="flex items-center gap-2 text-sm text-rose-500">
// 						<AlertCircle className="h-4 w-4" />
// 						{state.error ?? "Something went wrong"}
// 					</div>
// 				);
// 			default:
// 				return (
// 					<div className="text-sm text-zinc-500 dark:text-zinc-300">
// 						Drop or click to upload (.json, .csv, .txt, .zip)
// 					</div>
// 				);
// 		}
// 	})();

// 	return (
// 		<label className="group relative h-full cursor-pointer">
// 			<input
// 				type="file"
// 				accept=".json,.csv,.txt,.zip"
// 				className="sr-only"
// 				onChange={handleChange}
// 			/>

// 			<div
// 				className={cn(
// 					"relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-zinc-200/70 bg-white/90 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-zinc-800/80 dark:bg-zinc-950/90",
// 					state.status === "processing" &&
// 						"border-emerald-200/80 shadow-lg shadow-emerald-500/20 dark:border-emerald-500/40",
// 					state.status === "error" &&
// 						"border-rose-300 shadow-lg shadow-rose-500/20 dark:border-rose-600"
// 				)}
// 			>
// 				<div
// 					className={cn(
// 						"pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100",
// 						"bg-gradient-to-br",
// 						config.accent
// 					)}
// 					aria-hidden="true"
// 				/>

// 				<div className="relative z-10 space-y-6">
// 					<div className="flex items-center justify-between">
// 						<div className="flex items-center gap-3">
// 							<div className="rounded-full bg-white/80 p-2 shadow dark:bg-zinc-900/80">
// 								{config.logo ? (
// 									<Image
// 										src={config.logo}
// 										alt={config.name}
// 										width={28}
// 										height={28}
// 									/>
// 								) : (
// 									<Sparkles className="h-6 w-6 text-zinc-700 dark:text-zinc-300" />
// 								)}
// 							</div>
// 							<div>
// 								<h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
// 									{config.name}
// 								</h3>
// 								<p className="text-xs text-zinc-500 dark:text-zinc-400">
// 									{config.description}
// 								</p>
// 							</div>
// 						</div>
// 						<UploadCloud className="h-5 w-5 text-zinc-400 transition group-hover:text-zinc-600 dark:text-zinc-500 dark:group-hover:text-zinc-300" />
// 					</div>

// 					<div>{statusContent}</div>
// 				</div>

// 				{state.file ? (
// 					<div className="relative z-10 mt-6 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
// 						<span className="truncate">{state.file.name}</span>
// 						<Button
// 							type="button"
// 							variant="ghost"
// 							size="sm"
// 							className="h-7 px-2 text-xs"
// 							onClick={(event) => {
// 								event.preventDefault();
// 								onFileSelected(undefined);
// 							}}
// 						>
// 							Clear
// 						</Button>
// 					</div>
// 				) : null}
// 			</div>
// 		</label>
// 	);
// };

// const SummaryCard: React.FC<{
// 	title: string;
// 	value: string;
// 	icon: React.ReactNode;
// 	footnote?: string;
// 	className?: string;
// }> = ({ title, value, icon, footnote, className }) => (
// 	<Card
// 		className={cn(
// 			"relative overflow-hidden rounded-3xl border border-zinc-200/60 bg-white/90 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-zinc-800/60 dark:bg-zinc-950/80",
// 			className
// 		)}
// 	>
// 		<CardHeader className="pb-4">
// 			<div className="flex items-center justify-between">
// 				<CardTitle className="text-sm font-semibold text-zinc-600 dark:text-zinc-300">
// 					{title}
// 				</CardTitle>
// 				<div className="text-zinc-400 dark:text-zinc-500">{icon}</div>
// 			</div>
// 			<CardDescription className="mt-3 text-3xl font-semibold text-zinc-900 dark:text-zinc-100">
// 				{value}
// 			</CardDescription>
// 		</CardHeader>
// 		{footnote ? (
// 			<CardFooter className="pt-0 text-xs text-zinc-500 dark:text-zinc-400">
// 				{footnote}
// 			</CardFooter>
// 		) : null}
// 	</Card>
// );

// type Slide = {
// 	title: string;
// 	subtitle: string;
// 	content: React.ReactNode;
// 	accent: string;
// };

// const SlideLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
// 	<div className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-6 py-10 sm:px-10 lg:px-12">
// 		{children}
// 	</div>
// );

// const DEFAULT_PROVIDER_STATE: ProviderState = {
// 	status: "idle",
// };

// export default function WrappedPage() {
// 	const [providerState, setProviderState] = useState<
// 		Record<ProviderKey, ProviderState>
// 	>(
// 		() =>
// 			Object.fromEntries(
// 				PROVIDERS.map((provider) => [
// 					provider.key,
// 					{ ...DEFAULT_PROVIDER_STATE },
// 				])
// 			) as Record<ProviderKey, ProviderState>
// 	);

// 	const [showcaseOpen, setShowcaseOpen] = useState(false);
// 	const [showcaseStep, setShowcaseStep] = useState(0);
// 	const [downloadLoading, setDownloadLoading] = useState(false);
// 	const summary = useMemo(
// 		() => aggregateSummary(PROVIDERS, providerState),
// 		[providerState]
// 	);

// 	const handleFileForProvider = useCallback(
// 		async (provider: ProviderConfig, file?: File) => {
// 			setProviderState((prev) => ({
// 				...prev,
// 				[provider.key]: file
// 					? {
// 							file,
// 							status: "processing",
// 					  }
// 					: { ...DEFAULT_PROVIDER_STATE },
// 			}));

// 			if (!file) return;

// 			try {
// 				await file.text();
// 				const metrics = await simulateProviderParse(provider, file);

// 				setProviderState((prev) => ({
// 					...prev,
// 					[provider.key]: {
// 						file,
// 						status: "ready",
// 						metrics,
// 					},
// 				}));
// 			} catch (error) {
// 				setProviderState((prev) => ({
// 					...prev,
// 					[provider.key]: {
// 						file,
// 						status: "error",
// 						error:
// 							error instanceof Error
// 								? error.message
// 								: "Unable to parse this export.",
// 					},
// 				}));
// 			}
// 		},
// 		[]
// 	);
// 	useEffect(() => {
// 		if (showcaseOpen) {
// 			document.body.style.overflow = "hidden";
// 		} else {
// 			document.body.style.overflow = "";
// 		}

// 		return () => {
// 			document.body.style.overflow = "";
// 		};
// 	}, [showcaseOpen]);

// 	const slides: Slide[] = useMemo(() => {
// 		if (!summary) return [];

// 		const topProvider = summary.providersBreakdown[0];
// 		const topHourFormatted = `${
// 			summary.topHour === 0
// 				? "12"
// 				: summary.topHour > 12
// 				? summary.topHour - 12
// 				: summary.topHour
// 		}${summary.topHour >= 12 ? "PM" : "AM"}`;

// 		return [
// 			{
// 				title: "Your AI Year In Numbers",
// 				subtitle: `A ${summary.emojiMood} story told across every conversation.`,
// 				accent: "from-indigo-500/80 via-purple-500/60 to-rose-500/80",
// 				content: (
// 					<div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
// 						<SummaryCard
// 							title="Tokens traded"
// 							value={formatNumber(summary.totalTokens)}
// 							icon={<Sparkles className="h-5 w-5" />}
// 							footnote="All models combined"
// 						/>
// 						<SummaryCard
// 							title="Messages sent"
// 							value={formatNumber(summary.totalMessages)}
// 							icon={<ArrowRight className="h-5 w-5" />}
// 							footnote={`~${summary.totalWords.toLocaleString()} words`}
// 						/>
// 						<SummaryCard
// 							title="Time invested"
// 							value={`${summary.totalMinutes.toLocaleString()} min`}
// 							icon={<Loader2 className="h-5 w-5" />}
// 							footnote={`${summary.averageResponseSeconds}s avg response`}
// 						/>
// 						<SummaryCard
// 							title="Top collaborator"
// 							value={topProvider?.name ?? "--"}
// 							icon={<CheckCircle2 className="h-5 w-5" />}
// 							footnote={`${formatNumber(
// 								topProvider?.tokens ?? 0
// 							)} tokens shared`}
// 						/>
// 					</div>
// 				),
// 			},
// 			{
// 				title: "How You Split The Work",
// 				subtitle: "Who you called on, and how often they showed up.",
// 				accent: "from-emerald-500/80 via-sky-500/60 to-indigo-500/70",
// 				content: (
// 					<div className="grid gap-6 md:grid-cols-2">
// 						<div className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-inner backdrop-blur dark:border-zinc-800/60 dark:bg-zinc-900/60">
// 							<h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
// 								Tokens by provider
// 							</h3>
// 							<div className="mt-4 space-y-4">
// 								{summary.providersBreakdown.map(
// 									({ key, name, tokens, accent }) => {
// 										const percent =
// 											(tokens /
// 												Math.max(
// 													summary.totalTokens,
// 													1
// 												)) *
// 											100;
// 										return (
// 											<div key={key}>
// 												<div className="flex justify-between text-sm font-medium text-zinc-700 dark:text-zinc-200">
// 													<span>{name}</span>
// 													<span>
// 														{percent.toFixed(1)}%
// 													</span>
// 												</div>
// 												<div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-zinc-200/60 dark:bg-zinc-800/60">
// 													<div
// 														className={cn(
// 															"h-full rounded-full bg-gradient-to-r",
// 															accent
// 														)}
// 														style={{
// 															width: `${Math.max(
// 																percent,
// 																4
// 															)}%`,
// 														}}
// 													/>
// 												</div>
// 											</div>
// 										);
// 									}
// 								)}
// 							</div>
// 						</div>
// 						<div className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-inner backdrop-blur dark:border-zinc-800/60 dark:bg-zinc-900/60">
// 							<h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
// 								Fun facts
// 							</h3>
// 							<ul className="mt-4 space-y-4 text-sm text-zinc-600 dark:text-zinc-300">
// 								<li>
// 									<span className="font-semibold text-zinc-900 dark:text-zinc-100">
// 										Longest thread
// 									</span>{" "}
// 									went{" "}
// 									{summary.longestThread.messages.toLocaleString()}{" "}
// 									messages with{" "}
// 									{
// 										PROVIDERS.find(
// 											(p) =>
// 												p.key ===
// 												summary.longestThread.provider
// 										)?.name
// 									}
// 									.
// 								</li>
// 								<li>
// 									<span className="font-semibold text-zinc-900 dark:text-zinc-100">
// 										Boldest prompt
// 									</span>{" "}
// 									clocked{" "}
// 									{summary.largestPrompt.words.toLocaleString()}{" "}
// 									words with{" "}
// 									{
// 										PROVIDERS.find(
// 											(p) =>
// 												p.key ===
// 												summary.largestPrompt.provider
// 										)?.name
// 									}
// 									.
// 								</li>
// 								<li>
// 									<span className="font-semibold text-zinc-900 dark:text-zinc-100">
// 										Streak legend
// 									</span>{" "}
// 									spent {summary.bestStreak.days} straight
// 									days with{" "}
// 									{
// 										PROVIDERS.find(
// 											(p) =>
// 												p.key ===
// 												summary.bestStreak.provider
// 										)?.name
// 									}
// 									.
// 								</li>
// 							</ul>
// 						</div>
// 					</div>
// 				),
// 			},
// 			{
// 				title: "When Inspiration Struck",
// 				subtitle: `Most active on ${summary.topDay}, especially around ${topHourFormatted}.`,
// 				accent: "from-rose-500/80 via-orange-400/60 to-amber-300/70",
// 				content: (
// 					<div className="grid gap-6 lg:grid-cols-2">
// 						<div className="rounded-3xl border border-white/70 bg-white/80 p-6 backdrop-blur dark:border-zinc-800/60 dark:bg-zinc-900/60">
// 							<h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
// 								Schedule heat
// 							</h3>
// 							<div className="mt-6 grid grid-cols-2 gap-4">
// 								<div className="rounded-2xl bg-gradient-to-br from-violet-500/30 via-violet-500/20 to-transparent p-4 text-zinc-900 dark:text-zinc-100">
// 									<div className="text-xs uppercase tracking-wide text-violet-900/70 dark:text-violet-200">
// 										Prime day
// 									</div>
// 									<div className="mt-2 text-2xl font-semibold">
// 										{summary.topDay}
// 									</div>
// 									<p className="mt-1 text-xs text-zinc-700 dark:text-zinc-300">
// 										{formatNumber(
// 											summary.totalMessages / 7
// 										)}{" "}
// 										avg messages that day
// 									</p>
// 								</div>
// 								<div className="rounded-2xl bg-gradient-to-br from-orange-500/20 via-orange-400/20 to-transparent p-4 text-zinc-900 dark:text-zinc-100">
// 									<div className="text-xs uppercase tracking-wide text-orange-900/70 dark:text-orange-200">
// 										Power hour
// 									</div>
// 									<div className="mt-2 text-2xl font-semibold">
// 										{topHourFormatted}
// 									</div>
// 									<p className="mt-1 text-xs text-zinc-700 dark:text-zinc-300">
// 										Responses typically in ~
// 										{summary.averageResponseSeconds}s
// 									</p>
// 								</div>
// 							</div>
// 						</div>
// 						<div className="rounded-3xl border border-white/70 bg-white/80 p-6 backdrop-blur dark:border-zinc-800/60 dark:bg-zinc-900/60">
// 							<h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
// 								Favorite vocabulary
// 							</h3>
// 							<div className="mt-4 flex flex-wrap gap-2">
// 								{summary.topWords.map((word) => (
// 									<Badge
// 										key={word}
// 										className="bg-gradient-to-r from-zinc-800 to-zinc-600 text-zinc-50 shadow-md dark:from-zinc-200 dark:to-zinc-400 dark:text-zinc-900"
// 									>
// 										#{word}
// 									</Badge>
// 								))}
// 							</div>
// 							<p className="mt-6 text-sm text-zinc-600 dark:text-zinc-300">
// 								"You turned {summary.topWords[0]} into your
// 								trademark. Keep it in the mix for next year's
// 								prompts."
// 							</p>
// 						</div>
// 					</div>
// 				),
// 			},
// 			{
// 				title: "Ready To Share Your Story?",
// 				subtitle: summary.funFact,
// 				accent: "from-indigo-500/80 via-emerald-500/60 to-sky-500/80",
// 				content: (
// 					<div className="grid gap-6 md:grid-cols-2">
// 						<div className="rounded-3xl border border-white/60 bg-white/70 p-6 text-zinc-800 shadow-inner dark:border-zinc-800/60 dark:bg-zinc-900/60 dark:text-zinc-200">
// 							<h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
// 								Share-ready caption
// 							</h3>
// 							<p className="mt-3 text-sm leading-relaxed">
// 								"In {new Date().getFullYear()}, I traded{" "}
// 								{formatNumber(summary.totalTokens)} tokens
// 								across {formatNumber(summary.totalMessages)}{" "}
// 								messages with{" "}
// 								{summary.providersBreakdown.length} AI copilots.
// 								We moved fastest around {topHourFormatted}, and
// 								my go-to muse was {summary.topWords[0]}. What
// 								did your AI year look like?"
// 							</p>
// 						</div>
// 						<div className="rounded-3xl border border-dashed border-white/60 bg-white/40 p-6 text-sm text-zinc-600 backdrop-blur dark:border-zinc-800/60 dark:bg-zinc-900/40 dark:text-zinc-300">
// 							<h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
// 								Tips
// 							</h3>
// 							<ul className="mt-3 space-y-2">
// 								<li>
// 									- Download assets to keep and share across
// 									socials.
// 								</li>
// 								<li>
// 									- Use the share button to send a quick recap
// 									to friends.
// 								</li>
// 								<li>
// 									- Re-run with fresh exports anytime for
// 									updated insights.
// 								</li>
// 							</ul>
// 						</div>
// 					</div>
// 				),
// 			},
// 		];
// 	}, [summary]);

// 	const handleDownload = async () => {
// 		if (!summary) return;
// 		setDownloadLoading(true);
// 		try {
// 			const payload = {
// 				summary,
// 				providers: Object.fromEntries(
// 					PROVIDERS.map((provider) => [
// 						provider.key,
// 						{
// 							file:
// 								providerState[provider.key]?.file?.name ?? null,
// 							metrics:
// 								providerState[provider.key]?.metrics ?? null,
// 						},
// 					])
// 				),
// 				generatedAt: new Date().toISOString(),
// 			};
// 			const blob = new Blob([JSON.stringify(payload, null, 2)], {
// 				type: "application/json",
// 			});
// 			const url = URL.createObjectURL(blob);
// 			const link = document.createElement("a");
// 			link.href = url;
// 			link.download = "ai-wrapped-summary.json";
// 			link.click();
// 			URL.revokeObjectURL(url);
// 		} finally {
// 			setDownloadLoading(false);
// 		}
// 	};

// 	const handleShare = async () => {
// 		if (!summary) return;

// 		const shareText = `My AI Wrapped: ${formatNumber(
// 			summary.totalTokens
// 		)} tokens * ${formatNumber(summary.totalMessages)} messages * ${
// 			summary.topWords[0]
// 		} was my word of the year.`;

// 		if (navigator.share) {
// 			try {
// 				await navigator.share({
// 					title: "My AI Wrapped",
// 					text: shareText,
// 					url: window.location.href,
// 				});
// 			} catch (error) {
// 				console.error("Share cancelled/failed", error);
// 			}
// 		} else if (navigator.clipboard) {
// 			try {
// 				await navigator.clipboard.writeText(
// 					`${shareText}\n${window.location.href}`
// 				);
// 				alert("Copied a shareable summary to your clipboard!");
// 			} catch (error) {
// 				alert("Unable to copy automatically -- please copy manually.");
// 			}
// 		}
// 	};

// 	const processedCount = PROVIDERS.filter(
// 		(p) => providerState[p.key]?.status === "ready"
// 	).length;

// 	return (
// 		<div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-zinc-50 via-white to-zinc-100 pb-20 text-zinc-900 dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-900 dark:text-zinc-100">
// 			<div
// 				className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.25),_transparent_45%),_radial-gradient(circle_at_bottom_right,_rgba(236,72,153,0.15),_transparent_55%)]"
// 				aria-hidden="true"
// 			/>
// 			<header className="relative mx-auto max-w-6xl px-4 pb-12 pt-16 sm:px-6 lg:px-8">
// 				<div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
// 					<div className="space-y-6">
// 						<div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/80 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-zinc-500 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-300">
// 							<Sparkles className="h-4 w-4" />
// 							Coming this season
// 						</div>
// 						<h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
// 							Relive your year in AI, one prompt at a time.
// 						</h1>
// 						<p className="max-w-2xl text-lg text-zinc-600 dark:text-zinc-300">
// 							Upload exports from your favorite AI copilots and
// 							watch them transform into a Spotify Wrapped-style
// 							story. Everything runs in your browser -- your data
// 							never leaves the page.
// 						</p>
// 						<div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400">
// 							<div className="flex items-center gap-2">
// 								<CheckCircle2 className="h-4 w-4 text-emerald-500" />
// 								Client-side parsing
// 							</div>
// 							<div className="flex items-center gap-2">
// 								<CheckCircle2 className="h-4 w-4 text-emerald-500" />
// 								Supports ChatGPT, Claude, Gemini, Grok, T3 Chat,
// 								Scira AI
// 							</div>
// 							<div className="flex items-center gap-2">
// 								<CheckCircle2 className="h-4 w-4 text-emerald-500" />
// 								Best viewed with sound, if you want the vibes ??
// 							</div>
// 						</div>
// 					</div>
// 					<div className="relative overflow-hidden rounded-3xl border border-white/50 bg-white/80 p-6 shadow-lg backdrop-blur dark:border-zinc-700/50 dark:bg-zinc-950/80">
// 						<div className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
// 							Example exports
// 						</div>
// 						<ul className="mt-3 space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
// 							<li>- Total tokens across copilots</li>
// 							<li>- Response wait times & streaks</li>
// 							<li>- Favorite prompts and key themes</li>
// 							<li>- Share-ready slides & captions</li>
// 						</ul>
// 						<div className="mt-4 text-xs text-zinc-400 dark:text-zinc-500">
// 							We'll soon add automatic importers -- stay tuned!
// 						</div>
// 						<Link
// 							href="https://discord.gg/zDw73wamdX"
// 							className="mt-4 inline-flex items-center text-xs font-semibold text-indigo-600 transition hover:text-indigo-400 dark:text-indigo-300"
// 							target="_blank"
// 							rel="noopener noreferrer"
// 						>
// 							Request additional providers
// 							<ArrowUpRight className="ml-1 h-3 w-3" />
// 						</Link>
// 					</div>
// 				</div>
// 			</header>

// 			<main className="relative mx-auto max-w-6xl space-y-12 px-4 sm:px-6 lg:px-8">
// 				<section className="space-y-6">
// 					<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
// 						{PROVIDERS.map((provider) => (
// 							<UploadCard
// 								key={provider.key}
// 								config={provider}
// 								state={providerState[provider.key]}
// 								onFileSelected={(file) =>
// 									handleFileForProvider(provider, file)
// 								}
// 							/>
// 						))}
// 					</div>
// 				</section>

// 				{summary ? (
// 					<section className="space-y-6">
// 						<div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
// 							<h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
// 								Preview your highlights
// 							</h2>
// 							<Button
// 								size="lg"
// 								className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500 px-6 py-5 text-white shadow-lg shadow-purple-500/30 transition hover:shadow-xl hover:shadow-purple-500/40"
// 								onClick={() => {
// 									setShowcaseStep(0);
// 									setShowcaseOpen(true);
// 								}}
// 							>
// 								<span>Generate my Wrapped</span>
// 								<ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
// 							</Button>
// 						</div>

// 						<div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
// 							<SummaryCard
// 								title="Total tokens"
// 								value={formatNumber(summary.totalTokens)}
// 								icon={<Sparkles className="h-5 w-5" />}
// 								footnote={`${processedCount} providers connected`}
// 							/>
// 							<SummaryCard
// 								title="Total minutes waiting"
// 								value={`${summary.totalMinutes.toLocaleString()} min`}
// 								icon={<Loader2 className="h-5 w-5" />}
// 								footnote={`${summary.averageResponseSeconds}s avg response`}
// 							/>
// 							<SummaryCard
// 								title="Top day"
// 								value={summary.topDay}
// 								icon={<ArrowUpRight className="h-5 w-5" />}
// 								footnote={`Peak around ${summary.topHour}:00`}
// 							/>
// 							<SummaryCard
// 								title="Signature word"
// 								value={summary.topWords[0] ?? "--"}
// 								icon={<Sparkles className="h-5 w-5" />}
// 								footnote="Tap to discover more in the show"
// 							/>
// 						</div>
// 					</section>
// 				) : (
// 					<section className="rounded-3xl border border-dashed border-zinc-300/70 bg-white/70 p-8 text-sm text-zinc-500 dark:border-zinc-700/70 dark:bg-zinc-900/60 dark:text-zinc-400">
// 						Add at least one export above to unlock your Wrapped
// 						experience.
// 					</section>
// 				)}

// 				<section className="rounded-3xl border border-zinc-200/70 bg-white/80 p-8 shadow-sm backdrop-blur dark:border-zinc-800/70 dark:bg-zinc-950/80">
// 					<h2 className="text-2xl font-semibold">
// 						Need help exporting?
// 					</h2>
// 					<p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
// 						We're preparing step-by-step guides for each platform.
// 						Join our Discord to get early access and share feedback.
// 					</p>
// 					<div className="mt-4 flex flex-wrap gap-3">
// 						<Link
// 							href="https://discord.gg/zDw73wamdX"
// 							target="_blank"
// 							rel="noopener noreferrer"
// 						>
// 							<Button variant="outline" className="gap-2">
// 								<Sparkles className="h-4 w-4" />
// 								Join the community
// 							</Button>
// 						</Link>
// 						<Link href="mailto:team@ai-stats.com">
// 							<Button variant="ghost" className="gap-2">
// 								<ArrowUpRight className="h-4 w-4" />
// 								Request a platform
// 							</Button>
// 						</Link>
// 					</div>
// 				</section>
// 			</main>

// 			<AnimatePresence>
// 				{showcaseOpen && summary ? (
// 					<motion.div
// 						className="fixed inset-0 z-50 flex flex-col bg-gradient-to-br from-zinc-100 via-white to-zinc-200 text-zinc-900 dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-900 dark:text-zinc-100"
// 						initial={{ opacity: 0 }}
// 						animate={{ opacity: 1 }}
// 						exit={{ opacity: 0 }}
// 						transition={{ duration: 0.3 }}
// 					>
// 						<div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.35),_transparent_45%),_radial-gradient(circle_at_bottom_left,_rgba(236,72,153,0.25),_transparent_55%)]" />
// 						<header className="relative z-10 flex items-center justify-between px-6 py-6 sm:px-10">
// 							<Button
// 								variant="ghost"
// 								size="icon"
// 								className="rounded-full bg-white/60 text-zinc-700 shadow hover:bg-white/80 dark:bg-zinc-900/70 dark:text-zinc-200"
// 								onClick={() => setShowcaseOpen(false)}
// 							>
// 								<X className="h-5 w-5" />
// 							</Button>

// 							<div className="flex items-center gap-3">
// 								<Button
// 									variant="ghost"
// 									className="gap-2"
// 									onClick={handleShare}
// 								>
// 									<Share2 className="h-4 w-4" />
// 									Share
// 								</Button>
// 								<Button
// 									variant="default"
// 									className="gap-2 bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
// 									onClick={handleDownload}
// 									disabled={downloadLoading}
// 								>
// 									{downloadLoading ? (
// 										<Loader2 className="h-4 w-4 animate-spin" />
// 									) : (
// 										<Download className="h-4 w-4" />
// 									)}
// 									Download summary
// 								</Button>
// 							</div>
// 						</header>

// 						<div className="relative z-10 flex flex-1 flex-col">
// 							<motion.div
// 								key={showcaseStep}
// 								initial={{ opacity: 0, x: 48 }}
// 								animate={{ opacity: 1, x: 0 }}
// 								exit={{ opacity: 0, x: -48 }}
// 								transition={{ duration: 0.4, ease: "easeOut" }}
// 								className="flex-1"
// 							>
// 								{slides[showcaseStep] ? (
// 									<SlideLayout>
// 										<div className="space-y-6">
// 											<div className="space-y-2">
// 												<Badge className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow">
// 													AI Wrapped {"\u2022"}{" "}
// 													{showcaseStep + 1} /{" "}
// 													{slides.length}
// 												</Badge>
// 												<h2 className="text-4xl font-semibold sm:text-5xl lg:text-6xl">
// 													{
// 														slides[showcaseStep]!
// 															.title
// 													}
// 												</h2>
// 												<p className="max-w-2xl text-lg text-zinc-600 dark:text-zinc-300">
// 													{
// 														slides[showcaseStep]!
// 															.subtitle
// 													}
// 												</p>
// 											</div>
// 											<div
// 												className={cn(
// 													"rounded-3xl border border-white/70 bg-white/80 p-8 shadow-xl backdrop-blur dark:border-zinc-800/70 dark:bg-zinc-900/70",
// 													"bg-gradient-to-br",
// 													slides[showcaseStep]!.accent
// 												)}
// 											>
// 												<div className="rounded-2xl border border-white/40 bg-white/80 p-6 shadow-inner backdrop-blur-sm dark:border-zinc-800/50 dark:bg-zinc-950/70">
// 													{
// 														slides[showcaseStep]!
// 															.content
// 													}
// 												</div>
// 											</div>
// 										</div>
// 									</SlideLayout>
// 								) : null}
// 							</motion.div>

// 							<footer className="relative z-10 flex items-center justify-between px-6 py-6 sm:px-10">
// 								<div className="flex items-center gap-2">
// 									{slides.map((_, index) => (
// 										<button
// 											key={index}
// 											type="button"
// 											onClick={() =>
// 												setShowcaseStep(index)
// 											}
// 											className={cn(
// 												"h-2.5 w-8 rounded-full transition",
// 												index === showcaseStep
// 													? "bg-zinc-900 dark:bg-zinc-100"
// 													: "bg-zinc-400/40 dark:bg-zinc-600/40"
// 											)}
// 											aria-label={`Go to slide ${
// 												index + 1
// 											}`}
// 										/>
// 									))}
// 								</div>

// 								<div className="flex items-center gap-3">
// 									<Button
// 										variant="outline"
// 										className="gap-2 rounded-full"
// 										onClick={() =>
// 											setShowcaseStep((step) =>
// 												Math.max(step - 1, 0)
// 											)
// 										}
// 										disabled={showcaseStep === 0}
// 									>
// 										<ArrowLeft className="h-4 w-4" />
// 										Prev
// 									</Button>
// 									<Button
// 										className="gap-2 rounded-full bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
// 										onClick={() => {
// 											if (
// 												showcaseStep ===
// 												slides.length - 1
// 											) {
// 												setShowcaseOpen(false);
// 												return;
// 											}
// 											setShowcaseStep((step) =>
// 												Math.min(
// 													step + 1,
// 													slides.length - 1
// 												)
// 											);
// 										}}
// 									>
// 										{showcaseStep === slides.length - 1 ? (
// 											<>
// 												Close
// 												<X className="h-4 w-4" />
// 											</>
// 										) : (
// 											<>
// 												Next
// 												<ArrowRight className="h-4 w-4" />
// 											</>
// 										)}
// 									</Button>
// 								</div>
// 							</footer>
// 						</div>
// 					</motion.div>
// 				) : null}
// 			</AnimatePresence>
// 		</div>
// 	);
// }
