"use client";

import {
	Card,
	CardHeader,
	CardContent,
	CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	Accordion,
	AccordionItem,
	AccordionTrigger,
	AccordionContent,
} from "@/components/ui/accordion";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ExtendedModel } from "@/data/types";

interface ModelCardProps {
	model: ExtendedModel;
	sortedBenchmarks: any[];
	getCoveragePercentage: (model: ExtendedModel) => number;
	getUniqueCompletedBenchmarks: (model: ExtendedModel) => number;
	hasModelBenchmark: (model: ExtendedModel, benchmarkId: string) => boolean;
	getBenchmarkScore: (
		model: ExtendedModel,
		benchmarkId: string
	) => string | null;
	getScoreColorClass: (score: string | null) => string;
}

export default function ModelCard({
	model,
	sortedBenchmarks,
	getCoveragePercentage,
	getUniqueCompletedBenchmarks,
	hasModelBenchmark,
	getBenchmarkScore,
	getScoreColorClass,
}: ModelCardProps) {
	return (
		<Card key={model.id} className="overflow-hidden">
			<CardHeader className="p-4 pb-0">
				<div className="flex items-center gap-2">
					<Link
						href={`/providers/${model.provider?.provider_id}`}
						className="w-6 h-6 relative shrink-0 block"
					>
						<Image
							src={`/providers/${model.provider?.provider_id}.svg`}
							alt={model.provider?.name || ""}
							fill
							className="rounded-sm object-contain"
						/>
					</Link>
					<Tooltip delayDuration={0}>
						<TooltipTrigger asChild>
							<Link
								href={`/models/${model.id}`}
								className="hover:text-primary transition-colors font-medium"
							>
								{model.name}
							</Link>
						</TooltipTrigger>
						<TooltipContent>
							<p>Model ID: {model.id}</p>
						</TooltipContent>
					</Tooltip>
				</div>
			</CardHeader>

			<CardContent className="p-4">
				{/* Coverage percentage */}
				<div className="flex justify-between items-center mb-4">
					<p className="text-sm font-medium">Coverage</p>
					<div className="flex items-center gap-2">
                        <Badge
                            className={cn(
                                "px-2 py-0.5 transition-colors duration-150 cursor-pointer",
                                getCoveragePercentage(model) > 60
                                    ? "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-800/40"
                                    : getCoveragePercentage(model) > 30
                                    ? "bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-300 dark:hover:bg-amber-800/40"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800/50 dark:text-gray-400 dark:hover:bg-gray-700/60"
                            )}
                        >
                            {getCoveragePercentage(model)}%
                        </Badge>
						<Badge
							variant="outline"
							className="px-2 py-0.5 text-xs text-muted-foreground border-muted-foreground/30 bg-transparent"
						>
							{getUniqueCompletedBenchmarks(model)}/
							{sortedBenchmarks.length}
						</Badge>
					</div>
				</div>
			</CardContent>

			<CardFooter className="p-4 pt-0">
				<Accordion type="single" collapsible className="w-full">
					<AccordionItem value="benchmarks" className="border-0">
						<AccordionTrigger className="py-1 text-sm text-muted-foreground hover:text-foreground">
							View all benchmarks
						</AccordionTrigger>
						<AccordionContent>
							<div className="grid grid-cols-2 gap-2 pt-2">
								{sortedBenchmarks.map((benchmark) => {
									const hasResult = hasModelBenchmark(
										model,
										benchmark.id
									);
									const score = hasResult
										? getBenchmarkScore(model, benchmark.id)
										: null;

									return (
										<div
											key={benchmark.id}
											className={cn(
												"p-2 rounded-md flex flex-col items-center text-center",
												hasResult
													? "bg-green-50 dark:bg-green-950/20"
													: "bg-gray-100 dark:bg-gray-800/20"
											)}
										>
											<Tooltip>
												<TooltipTrigger asChild>
													<p
														className="text-xs font-medium mb-1 truncate w-full"
														title={benchmark.name}
													>
														{benchmark.name}
													</p>
												</TooltipTrigger>
												{benchmark.description && (
													<TooltipContent>
														<p>
															{
																benchmark.description
															}
														</p>
													</TooltipContent>
												)}
											</Tooltip>

											{hasResult ? (
												<Badge
													variant="outline"
													className={cn(
														"text-xs font-mono",
														getScoreColorClass(
															score
														)
													)}
												>
													{score}
												</Badge>
											) : (
												<span className="text-xs text-muted-foreground">
													—
												</span>
											)}
										</div>
									);
								})}
							</div>
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			</CardFooter>
		</Card>
	);
}
