"use client";

import { ModelCard } from "./ModelCard";
import type { ExtendedModel } from "@/data/types";

interface ModelsDisplayProps {
	models: ExtendedModel[];
}

export default function ModelsDisplay({ models }: ModelsDisplayProps) {
	// Sort models by most recent (announced or released)
	const sortedModels = [...models].sort((a, b) => {
		const getDateValue = (date: string | null) =>
			date ? new Date(date).getTime() : 0;
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

	return (
		<div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
			{sortedModels.map((model) => (
				<div key={model.id}>
					<ModelCard model={model} />
				</div>
			))}
		</div>
	);
}
