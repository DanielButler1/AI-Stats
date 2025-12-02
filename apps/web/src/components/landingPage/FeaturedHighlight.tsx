"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import {
	ArrowUpRight,
	FileText,
	MonitorPlay,
	Radio,
	Sparkles,
} from "lucide-react";
import type { FeaturedEntry } from "@/lib/content/featuredUpdate";
import { cn } from "@/lib/utils";

const FEATURED_TYPE_META: Record<
	"video" | "livestream" | "article",
	{
		label: string;
		icon: LucideIcon;
		subtleGlow: string;
	}
> = {
	video: {
		label: "Featured Video",
		icon: MonitorPlay,
		subtleGlow: "from-violet-500/20 via-transparent to-sky-500/20",
	},
	livestream: {
		label: "Featured Livestream",
		icon: Radio,
		subtleGlow: "from-emerald-500/20 via-transparent to-teal-500/20",
	},
	article: {
		label: "Featured Article",
		icon: FileText,
		subtleGlow: "from-amber-500/20 via-transparent to-rose-500/20",
	},
};

const AUTO_ROTATE_MS = 10000; // 10 seconds

export type FeaturedHighlightProps = {
	entries: FeaturedEntry[];
	autoRotateMs?: number;
};

export default function FeaturedHighlight({
	entries,
	autoRotateMs = AUTO_ROTATE_MS,
}: FeaturedHighlightProps) {
	const nonEmptyEntries = useMemo(
		() =>
			entries.filter(
				(entry): entry is FeaturedEntry =>
					entry !== undefined && entry !== null
			),
		[entries]
	);

	const [activeIndex, setActiveIndex] = useState(0);
	const [isPaused, setIsPaused] = useState(false);
	const resumeTimerRef = useRef<number | null>(null);

	const clearResumeTimer = useCallback(() => {
		if (resumeTimerRef.current) {
			window.clearTimeout(resumeTimerRef.current);
			resumeTimerRef.current = null;
		}
	}, []);

	const hasMultiple = nonEmptyEntries.length > 1;

	useEffect(() => {
		setActiveIndex(0);
	}, [nonEmptyEntries.length]);

	useEffect(() => {
		if (!hasMultiple || isPaused) {
			return;
		}

		const timer = window.setInterval(() => {
			setActiveIndex((current) => (current + 1) % nonEmptyEntries.length);
		}, autoRotateMs);

		return () => window.clearInterval(timer);
	}, [autoRotateMs, hasMultiple, isPaused, nonEmptyEntries.length]);

	useEffect(() => clearResumeTimer, [clearResumeTimer]);

	const scheduleResume = useCallback(() => {
		clearResumeTimer();
		resumeTimerRef.current = window.setTimeout(() => {
			setIsPaused(false);
			resumeTimerRef.current = null;
		}, Math.max(autoRotateMs, 4000));
	}, [autoRotateMs, clearResumeTimer]);

	const handleSelect = useCallback(
		(index: number) => {
			setActiveIndex(index);
			if (hasMultiple) {
				setIsPaused(true);
				scheduleResume();
			}
		},
		[hasMultiple, scheduleResume]
	);

	if (nonEmptyEntries.length === 0) {
		return null;
	}

	const currentEntry =
		nonEmptyEntries[Math.min(activeIndex, nonEmptyEntries.length - 1)];
	const meta = FEATURED_TYPE_META[currentEntry.type];
	const TypeIcon = meta.icon;

	return (
		<section
			className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-white text-left shadow-lg transition dark:border-zinc-800 dark:bg-zinc-950"
			onMouseEnter={() => {
				if (!hasMultiple) return;
				clearResumeTimer();
				setIsPaused(true);
			}}
			onMouseLeave={() => {
				if (!hasMultiple) return;
				clearResumeTimer();
				setIsPaused(false);
			}}
			onFocusCapture={() => {
				if (!hasMultiple) return;
				clearResumeTimer();
				setIsPaused(true);
			}}
			onBlurCapture={() => {
				if (!hasMultiple) return;
				clearResumeTimer();
				setIsPaused(false);
			}}
		>
			<AnimatePresence mode="wait">
				<motion.div
					key={`${currentEntry.id}-bg`}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.4, ease: "easeOut" }}
					aria-hidden="true"
					className={cn(
						"pointer-events-none absolute inset-0 bg-gradient-to-r",
						meta.subtleGlow
					)}
				/>
			</AnimatePresence>

			<AnimatePresence mode="wait">
				<motion.div
					key={currentEntry.id}
					initial={{ opacity: 0, y: 16 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -16 }}
					transition={{ duration: 0.45, ease: "easeOut" }}
					className="relative z-10 space-y-8 p-8 sm:p-12"
				>
					<div className="flex flex-wrap items-center gap-3 text-sm font-medium text-zinc-600 dark:text-zinc-300">
						<span className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50">
							<TypeIcon className="h-4 w-4" />
							{meta.label}
						</span>
						{currentEntry.highlight ? (
							<span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-300">
								<Sparkles className="h-4 w-4" />
								{currentEntry.highlight}
							</span>
						) : null}
					</div>

					<div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
						<div className="max-w-2xl space-y-4">
							<h2 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-50 md:text-4xl">
								{currentEntry.title}
							</h2>
							{/* Force two line height to prevent any layout shifts when moving between entries */}
							<p className="text-lg text-zinc-600 dark:text-zinc-300 min-h-[3rem] leading-6">
								{currentEntry.description}
							</p>
						</div>

						<div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
							<Link
								href={currentEntry.primaryAction.href}
								className="inline-flex items-center justify-center gap-2 rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-zinc-50 shadow-md transition hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
								{...(currentEntry.primaryAction.external
									? {
											target: "_blank",
											rel: "noopener noreferrer",
									  }
									: {})}
							>
								{currentEntry.primaryAction.label}
								<ArrowUpRight className="h-4 w-4" />
							</Link>

							{currentEntry.secondaryAction ? (
								<Link
									href={currentEntry.secondaryAction.href}
									className="inline-flex items-center justify-center gap-2 rounded-full border border-zinc-200 px-6 py-3 text-sm font-semibold text-zinc-900 transition hover:border-zinc-300 hover:text-zinc-700 dark:border-zinc-800 dark:text-zinc-50 dark:hover:border-zinc-700 dark:hover:text-zinc-200"
									{...(currentEntry.secondaryAction.external
										? {
												target: "_blank",
												rel: "noopener noreferrer",
										  }
										: {})}
								>
									{currentEntry.secondaryAction.label}
									<ArrowUpRight className="h-4 w-4" />
								</Link>
							) : null}
						</div>
					</div>

					{currentEntry.meta ? (
						<div className="flex flex-wrap gap-4 text-sm text-zinc-500 dark:text-zinc-400">
							{currentEntry.meta.source ? (
								<span>{currentEntry.meta.source}</span>
							) : null}
							{currentEntry.meta.publishedAt ? (
								<span>{currentEntry.meta.publishedAt}</span>
							) : null}
						</div>
					) : null}
				</motion.div>
			</AnimatePresence>

			{hasMultiple ? (
				<div className="absolute inset-x-0 bottom-5 z-20 flex flex-wrap items-center justify-center gap-2 px-6">
					{nonEmptyEntries.map((entry, index) => (
						<button
							key={entry.id}
							type="button"
							onClick={() => handleSelect(index)}
							className={cn(
								"inline-flex max-w-[220px] items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold transition whitespace-nowrap",
								index === activeIndex
									? "border-zinc-900 bg-zinc-900 text-zinc-50 shadow-sm dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
									: "border-zinc-300/70 bg-white/60 text-zinc-600 hover:border-zinc-400 hover:text-zinc-900 dark:border-zinc-700/70 dark:bg-zinc-950/60 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-zinc-200"
							)}
							aria-pressed={index === activeIndex}
							aria-label={`Show featured item ${index + 1}`}
						>
							<span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
							<span className="truncate">
								{entry.shortTitle ??
									entry.meta?.source ??
									entry.title}
							</span>
						</button>
					))}
				</div>
			) : null}
		</section>
	);
}
