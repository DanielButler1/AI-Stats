// BenchmarkDialog.tsx
"use client";

import React from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogClose,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import {
	ResponsiveContainer,
	BarChart,
	Bar,
	XAxis,
	YAxis,
	Tooltip,
	LabelList,
	BarProps,
} from "recharts";
import { Badge } from "@/components/ui/badge";

interface BenchmarkDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	benchmarkName: string;
	modelsWithThisBenchmark: Array<{
		modelName: string;
		provider: string;
		score: number;
		isCurrent: boolean;
		fill: string;
		allResults?: Array<{
			score: number;
			isPercentage: boolean;
			other_info?: string | null;
			source_link?: string | null;
		}>;
	}>;
	currentIdx: number;
	current: any;
}

export function BenchmarkDialog({
	open,
	onOpenChange,
	benchmarkName,
	modelsWithThisBenchmark,
	currentIdx,
	current,
}: BenchmarkDialogProps) {
	// Limit to 20 models on either side of current position
	const getFilteredModels = () => {
		if (currentIdx < 0) return modelsWithThisBenchmark;

		const maxRange = 20;
		const start = Math.max(0, currentIdx - maxRange);
		const end = Math.min(
			modelsWithThisBenchmark.length,
			currentIdx + maxRange + 1
		);

		return modelsWithThisBenchmark.slice(start, end);
	};

	const filteredModels = getFilteredModels();

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-5xl w-[900px] sm:w-[95vw] overflow-visible">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						{benchmarkName}
						<Badge variant="secondary">
							{current
								? benchmarkName === "Codeforces"
									? current.score.toFixed(0)
									: current.score.toFixed(2) + "%"
								: "-"}
						</Badge>
						{currentIdx >= 0 && (
							<span className="text-xs text-muted-foreground ml-2">
								Rank #{currentIdx + 1} of{" "}
								{modelsWithThisBenchmark.length}
								{filteredModels.length <
									modelsWithThisBenchmark.length &&
									` (showing ${filteredModels.length} models)`}
							</span>
						)}
					</DialogTitle>
				</DialogHeader>
				<div className="w-full h-[500px] mt-4 overflow-visible">
					<ResponsiveContainer width="100%" height="100%">
						<BarChart
							data={filteredModels}
							layout="horizontal"
							margin={{
								top: 20,
								right: 30,
								left: 20,
								bottom: 40,
							}}
						>
							<XAxis
								dataKey="modelName"
								angle={-25}
								textAnchor="end"
								interval={0}
								minTickGap={0}
								tick={{ fill: "#888", fontSize: 12 }}
								axisLine={true}
							/>
							<YAxis
								type="number"
								domain={[0, 100]}
								tick={{ fontSize: 12 }}
							/>
							<Tooltip
								wrapperStyle={{ zIndex: 10000 }}
								content={({ active, payload }) => {
									if (!active || !payload || !payload.length)
										return null;
									const d = payload[0].payload;
									return (
										<div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-3 border border-zinc-200 dark:border-zinc-800 min-w-[180px]">
											<div className="font-semibold text-sm mb-1">
												{d.modelName}
											</div>
											<div className="text-xs text-muted-foreground mb-1">
												{d.provider}
											</div>
											{d.allResults &&
											d.allResults.length > 1 ? (
												<div className="space-y-1">
													{d.allResults.map(
														(r: any, i: number) => (
															<div
																key={i}
																className="flex items-center gap-2"
															>
																<span className="font-mono text-base">
																	{r.score.toFixed(
																		2
																	)}
																	{r.isPercentage
																		? "%"
																		: ""}
																</span>
																{r.other_info && (
																	<span className="text-xs text-zinc-500">
																		(
																		{
																			r.other_info
																		}
																		)
																	</span>
																)}
															</div>
														)
													)}
												</div>
											) : (
												<div className="font-mono text-base">
													{d.score.toFixed(2) + "%"}
												</div>
											)}
											{d.isCurrent && (
												<div className="mt-1 text-xs text-indigo-600 font-bold">
													Selected Model
												</div>
											)}
										</div>
									);
								}}
							/>
							<Bar
								dataKey="score"
								isAnimationActive={false}
								barSize={24}
								shape={(props: any) => {
									const {
										x,
										y,
										width,
										height,
										fill,
										payload,
									} = props;
									return (
										<g>
											<rect
												x={x}
												y={y}
												width={width}
												height={height}
												fill={fill}
												stroke={
													payload.isCurrent
														? "#ff0000"
														: undefined
												}
												strokeWidth={
													payload.isCurrent ? 4 : 0
												}
												rx={4}
											/>
										</g>
									);
								}}
								fill="#6366f1"
							/>
						</BarChart>
					</ResponsiveContainer>
				</div>
			</DialogContent>
		</Dialog>
	);
}
