import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import type { ExtendedModel } from "@/data/types";

interface SotAModelProps {
	models: ExtendedModel[];
}

// Common model type for both available and announced models
type TopModel = {
	id: string;
	name: string;
	provider: string;
	provider_id: string;
	releaseDate: string;
	score: number;
	rd?: number; // Rating Deviation for Glicko scores
	description: string;
	announcedDate?: string;
};

// Get the available benchmarks that have at least 3 models with scores
function getAvailableBenchmarks(
	models: ExtendedModel[]
): { id: string; name: string }[] {
	const benchmarks: Map<string, { id: string; name: string; count: number }> =
		new Map();

	// Add Glicko rating as a special benchmark
	benchmarks.set("glicko", {
		id: "glicko",
		name: "AI Stats Score",
		count: 0,
	});

	// Count models for each benchmark
	models.forEach((model) => {
		// Count Glicko ratings
		if (model.glickoRating?.rating) {
			const glicko = benchmarks.get("glicko")!;
			glicko.count++;
		}

		// Count benchmark scores
		model.benchmark_results?.forEach((result) => {
			const benchmarkId = result.benchmark_id.toLowerCase();
			if (!benchmarks.has(benchmarkId)) {
				benchmarks.set(benchmarkId, {
					id: benchmarkId,
					name: result.benchmark.name,
					count: 0,
				});
			}
			const benchmark = benchmarks.get(benchmarkId)!;
			if (result.score) benchmark.count++;
		});
	});

	// Filter benchmarks with at least 3 models and sort by count
	return Array.from(benchmarks.values())
		.filter((b) => b.count >= 3)
		.sort((a, b) => b.count - a.count);
}

function findTopModels(
	models: ExtendedModel[],
	benchmarkId: string,
	showReleased = true
): TopModel[] {
	const currentDate = new Date();

	const modelsWithScores = models
		.map((model) => {
			let score = 0;
			let rd: number | undefined;
			let hasPercent = false;
			if (benchmarkId === "glicko") {
				score = model.glickoRating?.rating || 0;
				rd = model.glickoRating?.rd;
			} else {
				const result = model.benchmark_results?.find(
					(metric) =>
						metric.benchmark_id.toLowerCase() ===
						benchmarkId.toLowerCase()
				);
				if (result?.score) {
					const scoreStr = result.score.toString();
					hasPercent = scoreStr.includes("%");
					score =
						typeof result.score === "number"
							? result.score
							: parseFloat(scoreStr.replace("%", ""));
				}
			} // Store the hasPercent flag in the description field since we're not using it
			const hasPercentStr = hasPercent ? "percent" : "nopercent";
			return {
				id: model.id,
				name: model.name,
				provider: model.provider.name,
				provider_id: model.provider.provider_id,
				releaseDate: model.release_date || "TBA",
				announcedDate: model.announced_date || "TBA",
				score,
				rd,
				description: hasPercentStr, // Using description field to store format info
				benchmarkCount: model.benchmark_results?.length || 0, // Add benchmark count for filtering
			};
		})
		// Filter out models with no score
		.filter((model) => model.score > 0 && !!model.releaseDate)
		// Filter based on release date if needed
		.filter((model) => {
			if (!showReleased) {
				// For announced models, include all models with scores regardless of date
				return true;
			} else {
				// For available models, only include models with past or present release dates
				const releaseDate = new Date(model.releaseDate);
				return (
					!isNaN(releaseDate.getTime()) && releaseDate <= currentDate
				);
			}
		})
		// Only show AI Stats Score for models with 3+ benchmark results
		.filter(
			(model) => benchmarkId !== "glicko" || model.benchmarkCount >= 3
		)
		.sort((a, b) => b.score - a.score);

	return modelsWithScores.slice(0, 3);
}

export default function SotaModel({ models }: SotAModelProps) {
	const [showAnnounced, setShowAnnounced] = useState(false);
	const [selectedBenchmark, setSelectedBenchmark] = useState<{
		id: string;
		name: string;
	}>({ id: "glicko", name: "AI Stats Score" });
	const availableBenchmarks = getAvailableBenchmarks(models);
	const topAvailableModels = findTopModels(
		models,
		selectedBenchmark.id,
		true
	);
	const topAnnouncedModels = findTopModels(
		models,
		selectedBenchmark.id,
		false
	);

	// Explicit toggle handler
	const toggleShow = () => setShowAnnounced((prev) => !prev);

	if (topAvailableModels.length === 0 && !showAnnounced) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Current State of the Art</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-muted-foreground">No data found.</p>
				</CardContent>
			</Card>
		);
	}

	if (topAnnouncedModels.length === 0 && showAnnounced) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Announced Models</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-muted-foreground">
						No announced models found.
					</p>
				</CardContent>
			</Card>
		);
	}

	// Function to render a model card
	const renderModelCard = (
		model: TopModel,
		position: string,
		index: number,
		isAnnounced: boolean
	) => {
		const positionClass =
			position === "first" ? "flex-1" : "flex-1 hidden sm:block";
		const badgeText =
			position === "first"
				? isAnnounced
					? "Upcoming Leader"
					: "Current Leader"
				: position === "second"
				? "2nd Place"
				: "3rd Place";
		const badgeVariant = position === "first" ? "default" : "secondary";
		const imageSize = position === "first" ? "w-12 h-12" : "w-8 h-8";

		return (
			<motion.div
				key={`${model.id}-${isAnnounced}`}
				className={positionClass}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				transition={{ duration: 0.3 }}
			>
				<Card className="shadow-lg h-full">
					<CardContent className="p-6 pb-8">
						<div className="flex flex-col items-center gap-3">
							<Badge variant={badgeVariant}>{badgeText}</Badge>
							<Link
								href={`/providers/${model.provider_id}`}
								className="group"
							>
								<div
									className={`relative flex items-center justify-center rounded-full border bg-white ${imageSize}`}
								>
									<div
										className={`relative ${
											position === "first"
												? "w-9 h-9"
												: "w-6 h-6"
										}`}
									>
										<Image
											src={`/providers/${model.provider_id}.svg`}
											alt={model.provider}
											className="object-contain group-hover:opacity-80 transition"
											fill
										/>
									</div>
								</div>
							</Link>
							<div className="text-center">
								<Link
									href={`/models/${encodeURIComponent(
										model.id
									)}`}
								>
									<h2 className="text-xl font-semibold">
										<span className="relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full">
											{model.name}
										</span>
									</h2>
								</Link>
								<Link href={`/providers/${model.provider_id}`}>
									<p className="text-sm text-muted-foreground">
										<span className="relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full">
											{model.provider}
										</span>
									</p>
								</Link>{" "}
								<p className="font-bold mt-2">
									{selectedBenchmark.id === "glicko" ? (
										<span className="flex items-center justify-center gap-1">
											{model.score.toFixed(2)}{" "}
											{/* {model.rd !== undefined && (
												<>
													<span className="text-muted-foreground mx-1">
														±
													</span>
													<span className="text-muted-foreground">
														{model.rd.toFixed(2)}
													</span>
												</>
											)} */}
										</span>
									) : model.description === "percent" ? (
										model.score.toFixed(2) + "%"
									) : (
										Math.round(model.score)
									)}
								</p>
								<p className="text-xs text-muted-foreground mt-1">
									{model.releaseDate &&
									model.releaseDate !== "TBA"
										? `R: ${new Date(
												model.releaseDate
										  ).toLocaleDateString(undefined, {
												year: "numeric",
												month: "long",
												day: "numeric",
										  })}`
										: model.announcedDate
										? `A: ${new Date(
												model.announcedDate
										  ).toLocaleDateString(undefined, {
												year: "numeric",
												month: "long",
												day: "numeric",
										  })}`
										: null}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</motion.div>
		);
	};

	return (
		<Card className="shadow-lg">
			<CardHeader className="pb-2">
				<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
					<CardTitle className="text-2xl">
						The Best{" "}
						<button onClick={toggleShow} className="font-bold">
							{showAnnounced ? "Announced" : "Available"}
						</button>{" "}
						Models
					</CardTitle>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="outline"
								className="whitespace-nowrap ml-0 sm:ml-4"
							>
								{selectedBenchmark.name}{" "}
								<ChevronDown className="ml-2 h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							{availableBenchmarks.map((benchmark) => (
								<DropdownMenuItem
									key={benchmark.id}
									onSelect={() =>
										setSelectedBenchmark(benchmark)
									}
									className="capitalize"
								>
									{benchmark.name}
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</CardHeader>
			<CardContent>
				<div className="flex justify-center items-end gap-4">
					<AnimatePresence mode="wait">
						{/* Second Place */}
						{showAnnounced
							? topAnnouncedModels[1] &&
							  renderModelCard(
									topAnnouncedModels[1],
									"second",
									1,
									true
							  )
							: topAvailableModels[1] &&
							  renderModelCard(
									topAvailableModels[1],
									"second",
									1,
									false
							  )}

						{/* First Place */}
						{showAnnounced
							? renderModelCard(
									topAnnouncedModels[0],
									"first",
									0,
									true
							  )
							: renderModelCard(
									topAvailableModels[0],
									"first",
									0,
									false
							  )}

						{/* Third Place */}
						{showAnnounced
							? topAnnouncedModels[2] &&
							  renderModelCard(
									topAnnouncedModels[2],
									"third",
									2,
									true
							  )
							: topAvailableModels[2] &&
							  renderModelCard(
									topAvailableModels[2],
									"third",
									2,
									false
							  )}
					</AnimatePresence>
				</div>
			</CardContent>
		</Card>
	);
}
