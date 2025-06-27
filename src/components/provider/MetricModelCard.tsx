// MetricModelCard.tsx
"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { ExtendedModel } from "@/data/types";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";
import {
	Tooltip,
	TooltipTrigger,
	TooltipContent,
} from "@/components/ui/tooltip";
import { getUniqueCompletedBenchmarks } from "@/components/contribute/benchmarks/benchmarkUtils";

interface MetricModelCardProps {
	model: ExtendedModel;
}

export function MetricModelCard({ model }: MetricModelCardProps) {
	// Extract metrics from glickoRating and prices
	const aiStatsScore =
		model.glickoRating?.rating != null
			? model.glickoRating.rating.toFixed(2)
			: "-";
	const rd =
		model.glickoRating?.rd != null ? model.glickoRating.rd.toFixed(2) : "-";
	// Use the lowest input_token_price as price adjusted
	const priceAdjusted = model.valueScore?.toFixed(2) || "-";

	// Count unique benchmarks
	const uniqueBenchmarks = getUniqueCompletedBenchmarks(model);
	const showInfo = uniqueBenchmarks < 3;

	return (
		<Card
			style={{ borderColor: model.provider.colour || undefined }}
			className={cn(
				"h-full flex flex-col shadow-lg relative dark:shadow-zinc-900/25 dark:bg-zinc-950 transition-transform transform hover:scale-[1.01] duration-200 ease-in-out",
				model.provider.colour && "border-2"
			)}
		>
			<CardHeader className="pb-0 flex flex-row items-center gap-3">
				<div className="w-10 h-10 relative flex items-center justify-center rounded-full border bg-white">
					<div className="w-7 h-7 relative">
						<Image
							src={`/providers/${model.provider.provider_id}.svg`}
							alt={model.provider.name}
							className="object-contain"
							fill
						/>
					</div>
				</div>
				<div className="flex flex-col min-w-0 flex-1">
					<span className="font-semibold truncate text-lg leading-tight">
						{model.name}
					</span>
					<span className="text-xs text-muted-foreground truncate flex items-center gap-1">
						{model.provider.name}
					</span>
				</div>
				<div className="ml-auto flex gap-1">
					<Button
						asChild
						size="icon"
						variant="ghost"
						tabIndex={-1}
						className="group"
						style={
							{
								"--provider-color":
									model.provider.colour ?? "inherit",
							} as React.CSSProperties
						}
					>
						<a
							href={`/models/${model.id}`}
							aria-label={`Go to ${model.name} details`}
							tabIndex={-1}
						>
							<ArrowRight className="w-5 h-5 transition-colors group-hover:text-[color:var(--provider-color)]" />
						</a>
					</Button>
				</div>
			</CardHeader>
			<CardContent className="flex-1 flex flex-col justify-center gap-2">
				<div className="grid grid-cols-2 gap-2 text-sm">
					<div className="flex flex-col items-start">
						<span className="font-medium">AI Stats Score</span>
						<div className="flex items-center gap-1">
							<Badge variant="secondary">{aiStatsScore}</Badge>
							{showInfo && (
								<Tooltip delayDuration={0}>
									<TooltipTrigger asChild>
										<span className="ml-1 align-middle text-red-500 cursor-pointer">
											<Info
												size={14}
												aria-label="Potentially inaccurate score"
											/>
										</span>
									</TooltipTrigger>
									<TooltipContent side="top">
										This model&apos;s score is potentially
										inaccurate due to limited benchmark
										data.
									</TooltipContent>
								</Tooltip>
							)}
						</div>
					</div>
					<div className="flex flex-col items-start">
						<span className="font-medium">RD</span>
						<Badge variant="secondary">{rd}</Badge>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
