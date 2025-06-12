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

export default function ComparisonDisplay({
	selectedModels,
}: {
	selectedModels: ExtendedModel[];
}) {
	return (
		<div className="max-w-6xl mx-auto py-8 flex flex-col space-y-4">
			<ComparisonHeader selectedModels={selectedModels} />
			<OverviewCard selectedModels={selectedModels} />
			<PerformanceBenchmarkGraph selectedModels={selectedModels} />
			<PricingAnalysis selectedModels={selectedModels} />
			<ContextWindowComparison selectedModels={selectedModels} />
			<LicenseType selectedModels={selectedModels} />
			<ReleaseTimeline selectedModels={selectedModels} />
			<KnowledgeCutoffTimeline selectedModels={selectedModels} />
			{/* <KeyTakeaways selectedModels={selectedModels} /> */}
			<ComparisonTable selectedModels={selectedModels} />
		</div>
	);
}
