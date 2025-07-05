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
		<Card className="mb-8 shadow-lg">
			<CardHeader>
				<CardTitle className="text-2xl font-bold">
					Model Release & Updates
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-6">
					{timeline.map((event, idx) => (
						<Card
							key={idx}
							className="flex items-center relative pl-0 border-l-4 border-zinc-200 dark:border-zinc-700 shadow-none border-t-0 border-b-0 border-r-0 rounded-none"
						>
							{/* Dot in the line, vertically centered */}
							<div className="absolute left-[-10px] top-1/2 -translate-y-1/2">
								<span
									className={`block w-4 h-4 rounded-full border-2 border-white shadow-sm ${event.color}`}
								/>
							</div>
							<CardContent className="pl-6 py-4">
								<div className="text-zinc-500 text-xs mb-1">
									{formatDate(event.date)}
								</div>
								<div className="font-semibold text-base mb-0.5">
									{event.type !== "announced" &&
									event.type !== "released" &&
									event.type !== "deprecated" &&
									event.type !== "retired" ? (
										<Link
											href={`/models/${event.modelId}`}
											className="hover:underline"
										>
											{event.label}
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
					))}
				</div>
			</CardContent>
		</Card>
	);
}
