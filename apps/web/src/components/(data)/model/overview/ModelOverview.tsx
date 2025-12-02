import KeyDates from "./KeyDates";
import Performance from "./Performance";
// Pricing temporarily disabled while upgrading
// import Pricing from "./Pricing";
import Modalities from "./Modalities";
import OtherInfo from "./OtherInfo";
import ModelLinks, { hasModelLinks } from "./ModelLinks";
import ModelStatusBanner from "./ModelStatusBanner";
import { ModelOverviewPage } from "@/lib/fetchers/models/getModel";

export interface ModelOverviewProps {
	model: ModelOverviewPage;
}

export default function ModelOverview({ model }: ModelOverviewProps) {
	// Helper: format date as dd MMM yyyy
	const formatDate = (dateStr?: string) => {
		if (!dateStr) return "-";
		const date = new Date(dateStr);
		if (isNaN(date.getTime())) return "-";
		return date.toLocaleDateString("en-GB", {
			day: "2-digit",
			month: "short",
			year: "numeric",
		});
	};

	// Modalities logic: always show Text, Image, Audio, Video
	const parseTypes = (types: any) => {
		if (Array.isArray(types))
			return types.map((t: any) =>
				typeof t === "string"
					? t.toLowerCase()
					: String(t).toLowerCase()
			);
		if (typeof types === "string")
			return types
				.split(",")
				.map((t) => t.trim().toLowerCase())
				.filter(Boolean);
		return [];
	};
	const inputTypes = parseTypes(model.input_types);
	const outputTypes = parseTypes(model.output_types);

	console.log("Model Status:", model.status);

	return (
		<div className="w-full mx-auto space-y-4">
			{/* Status banner */}
			{model.status && <ModelStatusBanner status={model.status} />}
			{/* Links section (hidden when there are no links) */}
			{hasModelLinks(model) && (
				<div>
					<h2 className="text-xl font-semibold mb-2">Links</h2>
					<ModelLinks model={model} />
				</div>
			)}

			{/* Key dates + Performance (stacked) */}
			<div className="space-y-4">
				<KeyDates
					announced={model.announcement_date ?? undefined}
					released={model.release_date ?? undefined}
					deprecated={model.deprecation_date ?? undefined}
					retired={model.retirement_date ?? undefined}
					formatDate={formatDate}
				/>
				<Performance details={model.model_details} />
			</div>

			{/* Modalities & Other Info in 2-col grid */}
			<section>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<Modalities
							inputTypes={inputTypes}
							outputTypes={outputTypes}
						/>
					</div>
					<div>
						<OtherInfo details={model.model_details ?? undefined} />
					</div>
				</div>
			</section>

			{/* Pricing temporarily removed while upgrading */}
		</div>
	);
}
