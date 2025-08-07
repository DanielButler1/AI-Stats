import { ModelCard } from "@/components/models/Models/ModelCard";
import type { ExtendedModel } from "@/data/types";

interface ModelsGridProps {
	filteredModels: ExtendedModel[];
}

export function ModelsGrid({ filteredModels }: ModelsGridProps) {
	// Helper to check if a given date is within the last 7 days (including today)
	const isRecent = (dateStr?: string | null) => {
		if (!dateStr) return false;
		const now = new Date();
		const d = new Date(dateStr);
		// Set both dates to midnight for accurate day comparison
		d.setHours(0, 0, 0, 0);
		now.setHours(0, 0, 0, 0);
		const diffDays = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
		return diffDays >= 0 && diffDays < 7;
	};

	// Helper to get the most recent date for sorting
	const getMostRecentDate = (m: ExtendedModel) => {
		const dates = [m.release_date, m.announced_date]
			.filter(Boolean)
			.map((d) => new Date(d as string));
		if (dates.length === 0) return new Date(0);
		return new Date(Math.max(...dates.map((d) => d.getTime())));
	};

	const recentModels = filteredModels
		.filter((m) => isRecent(m.release_date) || isRecent(m.announced_date))
		.sort(
			(a, b) =>
				getMostRecentDate(b).getTime() - getMostRecentDate(a).getTime()
		);

	const otherModels = filteredModels
		.filter((m) => !isRecent(m.release_date) && !isRecent(m.announced_date))
		.sort(
			(a, b) =>
				getMostRecentDate(b).getTime() - getMostRecentDate(a).getTime()
		);

	if (filteredModels.length === 0) {
		return (
			<div className="col-span-full text-center text-muted-foreground py-12">
				No models found for the selected filters.
			</div>
		);
	}

	return (
		<div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
			{/* Show today's models first */}
			{recentModels.length > 0 && (
				<>
					<div className="col-span-full flex items-center my-2">
						<div className="flex-grow border-t border-dashed border-primary opacity-50"></div>
						<span className="mx-4 text-xs text-primary uppercase tracking-wider font-semibold">
							Recently Released or Announced
						</span>
						<div className="flex-grow border-t border-dashed border-primary opacity-50"></div>
					</div>
					{recentModels.map((model) => (
						<ModelCard key={model.id} model={model} />
					))}
					{/* Separator */}
					<div className="col-span-full flex items-center my-2">
						<div className="flex-grow border-t border-dashed border-muted-foreground opacity-50"></div>
						<span className="mx-4 text-xs text-muted-foreground uppercase tracking-wider">
							Earlier Models
						</span>
						<div className="flex-grow border-t border-dashed border-muted-foreground opacity-50"></div>
					</div>
				</>
			)}
			{/* Show other models */}
			{otherModels.map((model) => (
				<ModelCard key={model.id} model={model} />
			))}
		</div>
	);
}
