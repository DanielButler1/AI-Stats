import { Card } from "@/components/ui/card";
import type {
	BenchmarkComparisonChart,
	ModelBenchmarkHighlight,
	ModelBenchmarkResult,
} from "@/lib/fetchers/models/getModelBenchmarkData";
import { ModelBenchmarksGrid } from "./ModelBenchmarksGrid";
import { ModelBenchmarksTable } from "./ModelBenchmarksTable";
import ModelBenchmarksComparison from "./ModelBenchmarksComparison";

type Props = {
	modelId: string;
	highlightCards: ModelBenchmarkHighlight[];
	benchmarkTableData: Record<string, ModelBenchmarkResult[]>;
	benchmarkComparisonData: BenchmarkComparisonChart[];
};

export default function ModelBenchmarks({
	modelId,
	highlightCards,
	benchmarkTableData,
	benchmarkComparisonData,
}: Props) {
	return (
		<div className="space-y-8">
			<section className="space-y-3">
				<div>
					<h2 className="text-xl font-semibold">Highlights</h2>
					<p className="text-sm text-muted-foreground">
						Top benchmark results for {modelId}.
					</p>
				</div>
				{highlightCards.length ? (
					<ModelBenchmarksGrid highlights={highlightCards} />
				) : (
					<Card className="border border-dashed bg-muted/30 p-6 text-center text-sm text-muted-foreground">
						No benchmark highlights available yet.
					</Card>
				)}
			</section>

			<section className="space-y-3">
				<div>
					<h2 className="text-xl font-semibold">Benchmark table</h2>
					<p className="text-sm text-muted-foreground">
						Detailed scores across tracked benchmarks.
					</p>
				</div>
				<ModelBenchmarksTable grouped={benchmarkTableData} />
			</section>

			<ModelBenchmarksComparison comparisons={benchmarkComparisonData} />
		</div>
	);
}
