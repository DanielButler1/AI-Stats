import type { ExtendedModel } from "@/data/types";
import ComparisonHeader from "./comparisonComponents/ComparisonHeader";
import OverviewCard from "./comparisonComponents/OverviewCard";
import PerformanceBenchmarkGraph from "./comparisonComponents/performanceComparison/PerformanceBenchmarkGraph";
import PricingAnalysis from "./comparisonComponents/pricingAnalysis/PricingAnalysis";
import ContextWindowComparison from "./comparisonComponents/contextWindow/ContextWindowComparison";
import LicenseType from "./comparisonComponents/licenseType/LicenceType";
import ReleaseTimeline from "./comparisonComponents/releaseTimeline/ReleaseTimeline";
import KnowledgeCutoffTimeline from "./comparisonComponents/KnowledgeCutoff";
import KeyTakeaways from "./comparisonComponents/KeyTakeaways";
import ComparisonTable from "./comparisonComponents/ComparisonTable";
import AvailabilityComparison from "./comparisonComponents/AvailabilityComparison";
import SubscriptionPlansComparison from "./comparisonComponents/SubscriptionPlansComparison";

export default function ComparisonDisplay({
	selectedModels,
}: {
	selectedModels: ExtendedModel[];
}) {
	selectedModels.forEach((model) => {
		console.log(`${model.name}: ${JSON.stringify(model.prices)}`);
	});

	return (
		<div className="w-full py-8 flex flex-col space-y-4">
			<ComparisonHeader selectedModels={selectedModels} />
			<OverviewCard selectedModels={selectedModels} />
			<PerformanceBenchmarkGraph selectedModels={selectedModels} />
			<PricingAnalysis selectedModels={selectedModels} />
			<AvailabilityComparison selectedModels={selectedModels} />
			<SubscriptionPlansComparison selectedModels={selectedModels} />
			<ContextWindowComparison selectedModels={selectedModels} />
			<LicenseType selectedModels={selectedModels} />
			<ReleaseTimeline selectedModels={selectedModels} />
			<KnowledgeCutoffTimeline selectedModels={selectedModels} />
			{/* <KeyTakeaways selectedModels={selectedModels} /> */}
			<ComparisonTable selectedModels={selectedModels} />
		</div>
	);
}
