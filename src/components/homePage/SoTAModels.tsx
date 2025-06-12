import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
	gpqaScore: number;
	description: string;
	announcedDate?: string;
};

export function findTopGPQA(
	models: ExtendedModel[],
	showReleased = true
): TopModel[] {
	const currentDate = new Date();

	const modelsWithScores = models
		.map((model) => ({
			id: model.id,
			name: model.name,
			provider: model.provider.name,
			provider_id: model.provider.provider_id,
			releaseDate: model.release_date || "TBA",
			announcedDate: model.announced_date || "TBA",
			gpqaScore: model.benchmark_results?.find(
				(metric) => metric.benchmark_id.toLowerCase() === "gpqa"
			)?.score
				? parseFloat(
						model.benchmark_results
							.find(
								(metric) =>
									metric.benchmark_id.toLowerCase() === "gpqa"
							)!
							.score.toString()
				  )
				: 0,
			description: model.description || "No description available",
		}))
		// Filter out models with no GPQA score
		.filter((model) => model.gpqaScore > 0 && !!model.releaseDate)
		// Filter based on release date if needed
		.filter((model) => {
			if (!showReleased) {
				// For announced models, include all models with GPQA scores regardless of date
				return true;
			} else {
				// For available models, only include models with past or present release dates
				const releaseDate = new Date(model.releaseDate);
				return (
					!isNaN(releaseDate.getTime()) && releaseDate <= currentDate
				);
			}
		})
		.sort((a, b) => b.gpqaScore - a.gpqaScore);

	return modelsWithScores.slice(0, 3);
}

export default function SotaModel({ models }: SotAModelProps) {
	const [showAnnounced, setShowAnnounced] = useState(false);
	const topAvailableModels = findTopGPQA(models, true);
	const topAnnouncedModels = findTopGPQA(models, false);

	// Explicit toggle handler
	const toggleShow = () => setShowAnnounced((prev) => !prev);

	if (topAvailableModels.length === 0 && !showAnnounced) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Current State of the Art</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-muted-foreground">No GPQA data found.</p>
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
									className="hover:underline"
								>
									<h2 className="text-xl font-semibold">
										{model.name}
									</h2>
								</Link>
								<Link
									href={`/providers/${model.provider_id}`}
									className="hover:underline"
								>
									<p className="text-sm text-muted-foreground">
										{model.provider}
									</p>
								</Link>
								<p className="font-bold mt-2">
									{model.gpqaScore.toFixed(2)}%
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
				<CardTitle className="text-2xl">
					The Best{" "}
					<button onClick={toggleShow} className="font-bold">
						{showAnnounced ? "Announced" : "Available"}
					</button>{" "}
					Models
				</CardTitle>
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
