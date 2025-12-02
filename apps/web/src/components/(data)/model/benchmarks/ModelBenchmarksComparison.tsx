import { Card } from "@/components/ui/card";
import type { BenchmarkComparisonChart } from "@/lib/fetchers/models/getModelBenchmarkData";
import { ModelBenchmarksComparisonGrid } from "./ModelBenchmarksComparisonGrid";

interface ModelBenchmarksComparisonProps {
	comparisons: BenchmarkComparisonChart[];
}

export default function ModelBenchmarksComparison({
	comparisons,
}: ModelBenchmarksComparisonProps) {
	if (!comparisons.length) {
		return (
			<Card className="border border-dashed bg-muted/30 p-6 text-center text-sm text-muted-foreground">
				No comparison data yet. Once we have benchmark scores for this
				model and its competitors, we will visualise them here.
			</Card>
		);
	}

	return (
		<section className="mt-12 space-y-4">
			<div>
				<h3 className="text-lg font-medium">Benchmark comparisons</h3>
				<p className="text-sm text-muted-foreground">
					Use the selector to switch benchmarks and see how this model
					stacks up against its closest competitors.
				</p>
			</div>
			<ModelBenchmarksComparisonGrid comparisons={comparisons} />
		</section>
	);
}
