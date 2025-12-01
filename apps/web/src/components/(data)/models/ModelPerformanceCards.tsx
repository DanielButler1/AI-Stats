"use client";

import type { ComponentType, ReactNode, SVGProps } from "react";
import { cn } from "@/lib/utils";
import { Gauge, Timer, Hourglass } from "lucide-react";
import {
	LatencyChart,
	ThroughputChart,
	E2ELatencyChart,
} from "@/components/(data)/api-providers/Gateway/PerformanceCharts";
import type {
	ModelPerformancePoint,
	ModelPerformanceSummary,
} from "@/lib/fetchers/models/getModelPerformance";

type Trend = "up" | "down" | "neutral";

const ACCENTS = {
	cyan: {
		border: "border-b-cyan-400 dark:border-b-cyan-700",
		icon: "bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-200",
	},
	orange: {
		border: "border-b-amber-400 dark:border-b-amber-700",
		icon: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-100",
	},
	violet: {
		border: "border-b-violet-400 dark:border-b-violet-700",
		icon: "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-200",
	},
} as const;

function TrendBadge({
	value,
	trend,
	invertColors = false,
	className,
}: {
	value: string;
	trend: Trend;
	invertColors?: boolean;
	className?: string;
}) {
	const isPositive = trend === "up";
	const isNeutral = trend === "neutral";
	const isGood = invertColors ? !isPositive : isPositive;

	const styles = isNeutral
		? "bg-gray-50 text-gray-700 dark:bg-gray-500/10 dark:text-gray-200"
		: isGood
		? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200"
		: "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-200";

	return (
		<span
			className={cn(
				"inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold",
				"ring-1 ring-inset ring-black/5 dark:ring-white/5",
				styles,
				className
			)}
			aria-label={`Change ${value}`}
		>
			{value}
		</span>
	);
}

function PerformanceCard({
	title,
	value,
	delta,
	trend,
	accent = "cyan",
	invertDeltaColors = false,
	icon,
	children,
}: {
	title: string;
	value: string;
	delta?: string;
	trend?: Trend;
	accent?: keyof typeof ACCENTS;
	invertDeltaColors?: boolean;
	icon: ComponentType<SVGProps<SVGSVGElement>>;
	children: ReactNode;
}) {
	const accentConfig = ACCENTS[accent];
	const isEmpty = value.trim().length === 0;
	const IconComponent = icon;

	return (
		<div
			className={cn(
				"w-full min-w-0 rounded-lg border border-gray-200 dark:border-gray-700 border-b-2 p-5 space-y-4",
				accentConfig.border
			)}
		>
			<div className="flex items-start justify-between gap-4">
				<div className="space-y-1">
					<p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
						{title}
					</p>
					<div className="flex items-center gap-3">
						<span className="text-3xl font-semibold tracking-tight text-foreground">
							{isEmpty ? "—" : value}
						</span>
						{!isEmpty && delta && trend && (
							<TrendBadge
								value={delta}
								trend={trend}
								invertColors={invertDeltaColors}
							/>
						)}
					</div>
				</div>
				<div
					className={cn(
						"inline-flex h-10 w-10 items-center justify-center rounded-lg",
						"ring-1 ring-inset ring-black/5 dark:ring-white/5",
						accentConfig.icon
					)}
					aria-hidden
				>
					<IconComponent className="h-5 w-5" />
				</div>
			</div>

			<div className="h-[200px] w-full">{children}</div>
		</div>
	);
}

interface ModelPerformanceCardsProps {
	summary: ModelPerformanceSummary;
	hourly: ModelPerformancePoint[];
}

function calculateDelta(
	data: ModelPerformancePoint[],
	key: "avgThroughput" | "avgLatencyMs" | "avgGenerationMs"
) {
	const filtered = data.filter((point) => point[key] != null);
	if (filtered.length < 2) {
		return { value: "+0.0%", trend: "neutral" as Trend };
	}

	const last = filtered[filtered.length - 1][key];
	const prev = filtered[filtered.length - 2][key];

	if (last == null || prev == null || prev === 0) {
		return { value: "+0.0%", trend: "neutral" as Trend };
	}

	const delta = ((last - prev) / prev) * 100;

	return {
		value: `${delta >= 0 ? "+" : ""}${delta.toFixed(1)}%`,
		trend: delta > 0 ? "up" : delta < 0 ? "down" : ("neutral" as Trend),
	};
}

export default function ModelPerformanceCards({
	summary,
	hourly,
}: ModelPerformanceCardsProps) {
	const recentHourly = hourly.slice(-24);
	const throughputDelta = calculateDelta(recentHourly, "avgThroughput");
	const latencyDelta = calculateDelta(recentHourly, "avgLatencyMs");
	const e2eDelta = calculateDelta(recentHourly, "avgGenerationMs");

	const hourlyWithTimestamp = recentHourly.map((point) => ({
		...point,
		timestamp: point.bucket,
	}));

	const throughputValue =
		summary.avgThroughput != null
			? `${summary.avgThroughput.toFixed(2)} t/s`
			: "—";
	const latencyValue =
		summary.avgLatencyMs != null
			? `${Math.round(summary.avgLatencyMs)} ms`
			: "—";
	const e2eValue =
		summary.avgGenerationMs != null
			? `${Math.round(summary.avgGenerationMs)} ms`
			: "—";

	return (
		<div className="grid gap-6 sm:grid-cols-1 md:grid-cols-3">
			<PerformanceCard
				title="Throughput"
				value={throughputValue}
				delta={throughputDelta.value}
				trend={throughputDelta.trend}
				accent="cyan"
				icon={Gauge}
			>
				<ThroughputChart data={hourlyWithTimestamp} />
			</PerformanceCard>

			<PerformanceCard
				title="Latency"
				value={latencyValue}
				delta={latencyDelta.value}
				trend={latencyDelta.trend}
				accent="orange"
				invertDeltaColors
				icon={Timer}
			>
				<LatencyChart data={hourlyWithTimestamp} />
			</PerformanceCard>

			<PerformanceCard
				title="E2E latency"
				value={e2eValue}
				delta={e2eDelta.value}
				trend={e2eDelta.trend}
				accent="violet"
				invertDeltaColors
				icon={Hourglass}
			>
				<E2ELatencyChart data={hourlyWithTimestamp} />
			</PerformanceCard>
		</div>
	);
}
