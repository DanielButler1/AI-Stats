"use client";

import { ModelCard } from "@/components/models/Models/ModelCard";
import type { ExtendedModel } from "@/data/types";
import { Badge } from "@/components/ui/badge";
import { Megaphone, Rocket, Ban, Archive } from "lucide-react";

interface ModelsDisplayProps {
	models: ExtendedModel[];
	showStatusHeadings?: boolean;
}

// Remove duplicate export default
export default function ModelsDisplay({
	models,
	showStatusHeadings = true,
}: ModelsDisplayProps) {
	if (!showStatusHeadings) {
		return (
			<div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
				{sortModels(models).map((model) => (
					<div key={model.id}>
						<ModelCard model={model} />
					</div>
				))}
			</div>
		);
	}
	// Group models by status using model.status
	const rumoured: ExtendedModel[] = models.filter(
		(m: ExtendedModel) => m.status === "Rumoured"
	);
	const available: ExtendedModel[] = models.filter(
		(m: ExtendedModel) => m.status === "Available"
	);
	const deprecated: ExtendedModel[] = models.filter(
		(m: ExtendedModel) => m.status === "Deprecated"
	);
	const retired: ExtendedModel[] = models.filter(
		(m: ExtendedModel) => m.status === "Retired"
	);

	// Sort each group by most recent (announced or released)
	function sortModels(arr: ExtendedModel[]) {
		const getDateValue = (date: string | null) =>
			date ? new Date(date).getTime() : 0;
		return [...arr].sort((a, b) => {
			const aMostRecent = Math.max(
				getDateValue(a.announced_date),
				getDateValue(a.release_date)
			);
			const bMostRecent = Math.max(
				getDateValue(b.announced_date),
				getDateValue(b.release_date)
			);
			return bMostRecent - aMostRecent;
		});
	}

	// Badge components for section headers (from ModelUpdates)
	const SectionBadge = ({ status }: { status: string }) => {
		if (status === "Rumoured") {
			return (
				<Badge className="bg-blue-100 text-blue-800 border border-blue-300 px-2 py-1 text-xs flex items-center gap-1 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800 transition-colors hover:bg-blue-200 hover:border-blue-400 dark:hover:bg-blue-900 dark:hover:border-blue-500">
					<Megaphone size={14} className="mr-1" />
					Rumoured
				</Badge>
			);
		}
		if (status === "Available") {
			return (
				<Badge className="bg-green-100 text-green-800 border border-green-300 px-2 py-1 text-xs flex items-center gap-1 dark:bg-green-950 dark:text-green-300 dark:border-green-800 transition-colors hover:bg-green-200 hover:border-green-400 dark:hover:bg-green-900 dark:hover:border-green-500">
					<Rocket size={14} className="mr-1" />
					Available
				</Badge>
			);
		}
		if (status === "Deprecated") {
			return (
				<Badge className="bg-red-100 text-red-800 border border-red-300 px-2 py-1 text-xs flex items-center gap-1 dark:bg-red-950 dark:text-red-300 dark:border-red-800 transition-colors hover:bg-red-200 hover:border-red-400 dark:hover:bg-red-900 dark:hover:border-red-500">
					<Ban size={14} className="mr-1" />
					Deprecated
				</Badge>
			);
		}
		if (status === "Retired") {
			return (
				<Badge className="bg-zinc-300 text-zinc-800 border border-zinc-400 px-2 py-1 text-xs flex items-center gap-1 dark:bg-zinc-900 dark:text-zinc-300 dark:border-zinc-700 transition-colors hover:bg-zinc-400 hover:border-zinc-500 dark:hover:bg-zinc-800 dark:hover:border-zinc-500">
					<Archive size={14} className="mr-1" />
					Retired
				</Badge>
			);
		}
		return null;
	};

	// Render section if models exist
	function renderSection(title: string, models: ExtendedModel[]) {
		if (!models.length) return null;
		return (
			<div className="mb-8">
				<div className="flex items-center gap-2 mb-3">
					<SectionBadge status={title} />
					<span className="text-base font-semibold">
						{title} Models
					</span>
				</div>
				<div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
					{sortModels(models).map((model) => (
						<div key={model.id}>
							<ModelCard model={model} />
						</div>
					))}
				</div>
			</div>
		);
	}

	return (
		<div>
			{showStatusHeadings && renderSection("Rumoured", rumoured)}
			{showStatusHeadings && renderSection("Available", available)}
			{showStatusHeadings && renderSection("Deprecated", deprecated)}
			{showStatusHeadings && renderSection("Retired", retired)}
		</div>
	);
}
