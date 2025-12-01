"use client";

import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis } from "recharts";

type Row = {
	created_at: string;
	usage?: any;
	cost_nanos?: number | null;
	model_id?: string | null;
	success?: boolean;
};

const TOP_MODELS = 10;
const UNKNOWN_MODEL_LABEL = "Unknown model";
const DEFAULT_PASTELS = [
	"#A7C7E7",
	"#F7C5CC",
	"#C1E5C0",
	"#F8D7A9",
	"#D4C2FC",
	"#FFE3A3",
	"#BFE3F2",
	"#FFD0E1",
	"#C8F0DD",
	"#FBE2B4",
];
const GOLDEN_ANGLE = 137.508;

function formatDayLabel(date: Date) {
	return date.toLocaleDateString(undefined, {
		month: "short",
		day: "numeric",
	});
}

function getTokens(u: any) {
	const input = Number(u?.input_text_tokens ?? u?.input_tokens ?? 0) || 0;
	const output = Number(u?.output_text_tokens ?? u?.output_tokens ?? 0) || 0;
	return input + output;
}

function hash32(str: string) {
	let h = 0x811c9dc5 >>> 0;
	for (let i = 0; i < str.length; i++) {
		h ^= str.charCodeAt(i);
		h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
	}
	return h >>> 0;
}

function assignSeriesColours(
	models: string[],
	palette?: string[]
): Record<string, { fill: string; stroke: string }> {
	const entries = models
		.map((m) => ({ m, h: hash32(m) }))
		.sort((a, b) => a.h - b.h);

	const out: Record<string, { fill: string; stroke: string }> = {};

	if (palette && palette.length) {
		const step = Math.max(1, Math.round(palette.length * 0.381966));
		entries.forEach((e, i) => {
			const idx = (e.h + i * step) % palette.length;
			const fill = palette[idx];
			out[e.m] = { fill, stroke: fill };
		});
		return out;
	}

	const SAT = 45;
	const LIT = 78;
	entries.forEach((e, i) => {
		const hue = ((e.h % 360) + i * GOLDEN_ANGLE) % 360;
		const fill = `hsl(${hue} ${SAT}% ${LIT}% / 0.88)`;
		const stroke = `hsl(${hue} ${Math.max(30, SAT - 10)}% ${Math.max(
			55,
			LIT - 20
		)}% / 0.95)`;
		out[e.m] = { fill, stroke };
	});
	return out;
}

function keyForModel(model: string) {
	return `m_${model.replace(/[^a-zA-Z0-9]+/g, "_")}`;
}

type TooltipProps = {
	seriesStyle: Record<string, { label: string; color: string }>;
	hoveredKey: string | null;
	setHoveredKey: (key: string | null) => void;
};

function AppUsageTooltipContent(
	props: TooltipProps & Record<string, any>
) {
	const { seriesStyle, hoveredKey, setHoveredKey, ...rest } = props;

	return (
		<ChartTooltipContent
			{...rest}
			labelFormatter={(label) => String(label ?? "")}
			formatter={(value, name, item) => {
				const val = Number(value ?? 0);
				const formatted = Intl.NumberFormat().format(Math.round(val));
				const key = String(item?.dataKey ?? name ?? "");
				const cfg = seriesStyle[key];
				const label = cfg?.label ?? key;
				const color = cfg?.color ?? "hsl(0 0% 70%)";
				const isActive = hoveredKey === key;

				return (
					<div
						className="flex w-full items-center justify-between gap-4"
						onMouseEnter={() => setHoveredKey(key)}
					>
						<span className="inline-flex items-center gap-2">
							<span
								className="inline-block rounded-[2px]"
								style={{
									backgroundColor: color,
									width: isActive ? 6 : 4,
									height: 14,
								}}
							/>
							<span className={isActive ? "font-medium" : ""}>
								{label}
							</span>
						</span>
						<span className="ml-auto font-mono">{formatted}</span>
					</div>
				);
			}}
		/>
	);
}

export default function AppUsageChart({
	rows,
	windowLabel,
	fullWidth = false,
}: {
	rows: Row[];
	windowLabel: string;
	fullWidth?: boolean;
}) {
	const [hoveredKey, setHoveredKey] = useState<string | null>(null);

	const { chartData, seriesKeys, seriesStyle, totalTokens } = useMemo(() => {
		const today = new Date();
		today.setHours(12, 0, 0, 0);

		const buckets = Array.from({ length: 28 }, (_, index) => {
			const date = new Date(today);
			date.setDate(today.getDate() - (27 - index));
			const dayKey = date.toISOString().slice(0, 10);
			return { dayKey, label: formatDayLabel(date) };
		});

		const perBucketPerModel = new Map<string, Map<string, number>>();
		const totalsByModel = new Map<string, number>();
		let totalTokens = 0;

		rows.forEach((row) => {
			if (!row.created_at) return;
			if (row.success === false) return;

			const date = new Date(row.created_at);
			if (Number.isNaN(date.getTime())) return;

			const dayKey = date.toISOString().slice(0, 10);
			const rawModel = row.model_id ?? UNKNOWN_MODEL_LABEL;
			const modelName =
				typeof rawModel === "string"
					? rawModel.trim() || UNKNOWN_MODEL_LABEL
					: String(rawModel);
			const tokens = getTokens(row.usage);
			if (tokens === 0) return;

			totalTokens += tokens;

			const bucketMap =
				perBucketPerModel.get(dayKey) ?? new Map<string, number>();
			bucketMap.set(modelName, (bucketMap.get(modelName) ?? 0) + tokens);
			perBucketPerModel.set(dayKey, bucketMap);

			totalsByModel.set(
				modelName,
				(totalsByModel.get(modelName) ?? 0) + tokens
			);
		});

		const sortedModels = Array.from(totalsByModel.entries())
			.sort((a, b) => b[1] - a[1])
			.map(([model]) => model);
		const topModels = sortedModels.slice(0, TOP_MODELS);
		const useOther = sortedModels.length > TOP_MODELS;
		const isTop = new Set(topModels);
		const colourMap = assignSeriesColours(topModels, DEFAULT_PASTELS);

		const seriesStyle: Record<
			string,
			{ label: string; color: string; stroke: string }
		> = {};
		const seriesKeys: string[] = [];

		topModels.forEach((model) => {
			const key = keyForModel(model);
			const colour = colourMap[model];
			const fill = colour?.fill ?? "hsl(0 0% 80% / 0.6)";
			const stroke = colour?.stroke ?? fill;
			seriesKeys.push(key);
			seriesStyle[key] = {
				label: model,
				color: fill,
				stroke,
			};
		});

		if (useOther) {
			seriesKeys.push("other");
			seriesStyle["other"] = {
				label: "Other",
				color: "hsl(210 10% 68% / 0.7)",
				stroke: "hsl(210 10% 55%)",
			};
		}

		const chartData = buckets.map((bucket) => {
			const row: Record<string, number | string> = {
				bucket: bucket.label,
			};
			seriesKeys.forEach((key) => {
				row[key] = 0;
			});

			let otherSum = 0;
			const bucketMap = perBucketPerModel.get(bucket.dayKey);
			if (bucketMap) {
				bucketMap.forEach((value, model) => {
					if (isTop.has(model)) {
						const key = keyForModel(model);
						row[key] = (row[key] as number) + value;
					} else if (useOther) {
						otherSum += value;
					}
				});
			}

			if (useOther) {
				row["other"] = otherSum;
			}

			return row;
		});

		return {
			chartData,
			seriesKeys,
			seriesStyle,
			totalTokens,
		};
	}, [rows]);

	const header = (
		<CardHeader className="space-y-1 pb-3">
			<CardTitle>Usage Over Time</CardTitle>
			<p className="text-sm text-muted-foreground">{windowLabel}</p>
			<p className="text-xs text-muted-foreground">
				Token usage split by the models powering this app.
			</p>
		</CardHeader>
	);

	if (!rows.length || totalTokens === 0) {
		return (
			<Card
				className={fullWidth ? "-mx-4 rounded-none border-x-0" : ""}
			>
				{header}
				<CardContent>
					<p className="text-muted-foreground">
						No token usage recorded within this window.
					</p>
				</CardContent>
			</Card>
		);
	}

	const chartConfig = Object.fromEntries(
		Object.entries(seriesStyle).map(([key, style]) => [
			key,
			{ label: style.label, color: style.color },
		])
	) as Record<string, { label: string; color: string }>;

	return (
		<Card className={fullWidth ? "-mx-4 rounded-none border-x-0" : ""}>
			{header}
			<CardContent>
				<ChartContainer
					config={chartConfig}
					className="h-[340px] w-full flex-none aspect-auto"
				>
					<BarChart
						data={chartData}
						margin={{ left: 0, right: 12 }}
						onMouseLeave={() => setHoveredKey(null)}
					>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis
							dataKey="bucket"
							tick={{ fontSize: 12 }}
							interval="preserveStartEnd"
						/>
						<YAxis
							tick={{ fontSize: 12 }}
							tickFormatter={(value) =>
								Number(value).toLocaleString()
							}
						/>
						<ChartTooltip
							content={
								<AppUsageTooltipContent
									seriesStyle={seriesStyle}
									hoveredKey={hoveredKey}
									setHoveredKey={setHoveredKey}
								/>
							}
						/>
						{seriesKeys.map((key) => {
							const style = seriesStyle[key];
							const active = hoveredKey
								? hoveredKey === key
								: true;
							return (
								<Bar
									key={key}
									dataKey={key}
									name={style.label}
									stackId="a"
									fill={`var(--color-${key}, ${style.color})`}
									stroke={style.stroke}
									fillOpacity={
										hoveredKey
											? active
												? 0.95
												: 0.4
											: 0.9
									}
									strokeOpacity={
										hoveredKey
											? active
												? 0.95
												: 0.5
											: 0.9
									}
									strokeWidth={active ? 1.1 : 0.8}
									onMouseOver={() => setHoveredKey(key)}
									onMouseOut={() => setHoveredKey(null)}
									isAnimationActive={false}
								/>
							);
						})}
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
