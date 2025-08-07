import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

interface ModelReleaseTimelineProps {
	model: any;
	allModels: any[];
}

function getTimelineEvents(model: any, allModels: any[]) {
	const events = [];

	// Add current model events
	if (model.retirement_date) {
		events.push({
			date: model.retirement_date,
			label: "Model Retired",
			description: "Model no longer available or supported",
			type: "retired",
			color: "bg-black",
			modelId: model.id,
		});
	}
	if (model.deprecation_date) {
		events.push({
			date: model.deprecation_date,
			label: "Model Deprecated",
			description: "Model no longer supported or maintained",
			type: "deprecated",
			color: "bg-red-500",
			modelId: model.id,
		});
	}
	if (model.release_date) {
		events.push({
			date: model.release_date,
			label: "Model Released",
			description: "Model first made available to the public",
			type: "released",
			color: "bg-green-500",
			modelId: model.id,
		});
	}
	if (model.announced_date) {
		events.push({
			date: model.announced_date,
			label: "Model Announced",
			description: "Model first introduced to the public",
			type: "announced",
			color: "bg-blue-500",
			modelId: model.id,
		});
	}

	// Get previous versions
	let currentModel = model;
	while (currentModel && currentModel.previous_model_id) {
		const previousModel = allModels.find(
			(m: any) => m.id === currentModel.previous_model_id
		);
		if (!previousModel) break;
		if (previousModel?.release_date) {
			events.push({
				date: previousModel.release_date,
				label: previousModel.name,
				description: "Previous version",
				type: "version",
				color: "bg-zinc-400",
				modelId: previousModel.id,
			});
		}
		currentModel = previousModel;
	}

	// Get future versions
	function getFutureVersions(modelId: string) {
		const futureModels = allModels.filter(
			(m) => m.previous_model_id === modelId
		);
		for (const futureModel of futureModels) {
			if (futureModel.release_date) {
				events.push({
					date: futureModel.release_date,
					label: futureModel.name,
					description: "Future version",
					type: "version",
					color: "bg-zinc-400",
					modelId: futureModel.id,
				});
			}
			// Recursively get future versions of this model
			getFutureVersions(futureModel.id);
		}
	}

	getFutureVersions(model.id);

	// Sort all events chronologically from newest to oldest
	return events.sort(
		(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
	);
}

export default function ModelReleaseTimeline({
	model,
	allModels,
}: ModelReleaseTimelineProps) {
	const timeline = getTimelineEvents(model, allModels);
	const formatDate = (dateStr: string) => {
		const date = new Date(dateStr);
		return date.toLocaleDateString("en-GB", {
			day: "2-digit",
			month: "short",
			year: "numeric",
		});
	};
	return (
		<div className="w-full mx-auto mb-8">
			<h2 className="text-xl font-semibold mb-4">Model Timeline</h2>
			<div className="space-y-6">
				{timeline.map((event, idx) => {
					// Choose border and text color based on event type
					let borderColor =
						"border-b-gray-300 dark:border-b-gray-600";
					let textColor = "text-zinc-800 dark:text-zinc-300";
					const dotColor = event.color;
					if (event.type === "announced") {
						borderColor =
							"border-b-blue-400 dark:border-b-blue-700";
						textColor = "text-blue-800 dark:text-blue-300";
					} else if (event.type === "released") {
						borderColor =
							"border-b-green-400 dark:border-b-green-700";
						textColor = "text-green-800 dark:text-green-300";
					} else if (event.type === "deprecated") {
						borderColor = "border-b-red-400 dark:border-b-red-700";
						textColor = "text-red-800 dark:text-red-300";
					} else if (event.type === "retired") {
						borderColor =
							"border-b-zinc-500 dark:border-b-zinc-600";
						textColor = "text-zinc-800 dark:text-zinc-300";
					} else if (event.type === "version") {
						borderColor =
							"border-b-zinc-400 dark:border-b-zinc-500";
						textColor = "text-zinc-700 dark:text-zinc-200";
					}
					return (
						<Card
							key={idx}
							className={`flex items-center relative pl-0 border border-gray-200 dark:border-gray-700 border-b-2 ${borderColor} rounded-lg bg-white dark:bg-gray-900 shadow-none`}
						>
							{/* Dot in the line, vertically centered */}
							<div className="absolute left-[-10px] top-1/2 -translate-y-1/2">
								<span
									className={`block w-4 h-4 rounded-full border-2 border-white shadow-xs ${dotColor}`}
								/>
							</div>
							<CardContent className="pl-6 py-4">
								<div className="text-xs mb-1 text-zinc-500">
									{formatDate(event.date)}
								</div>
								<div
									className={`font-bold text-lg mb-0.5 ${textColor}`}
								>
									{event.type !== "announced" &&
									event.type !== "released" &&
									event.type !== "deprecated" &&
									event.type !== "retired" ? (
										<Link href={`/models/${event.modelId}`}>
											<span className="relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full">
												{event.label}
											</span>
										</Link>
									) : (
										event.label
									)}
								</div>
								<div className="text-zinc-500 text-sm">
									{event.description}
								</div>
							</CardContent>
						</Card>
					);
				})}
			</div>
		</div>
	);
}
