import type { ExtendedModel } from "@/data/types";

// Get the count of unique benchmarks completed by a model
export const getUniqueCompletedBenchmarks = (model: ExtendedModel): number => {
    if (!model.benchmark_results) return 0;

    // Use a Set to track unique benchmark IDs
    const uniqueBenchmarks = new Set<string>();

    model.benchmark_results.forEach((result) => {
        if (result.benchmark && result.benchmark.id) {
            uniqueBenchmarks.add(result.benchmark.id);
        }
    });

    return uniqueBenchmarks.size;
};

// Get the count of models that have completed a specific benchmark
export const getModelsCompletingBenchmark = (benchmarkId: string, models: ExtendedModel[]): number => {
    return models.filter(
        (model) =>
            model.benchmark_results?.some(
                (result) => result.benchmark.id === benchmarkId
            ) || false
    ).length;
};

// Calculate percentage of benchmark coverage for each model
export const getCoveragePercentage = (model: ExtendedModel, totalBenchmarks: number) => {
    if (!model.benchmark_results || totalBenchmarks === 0) return 0;
    const uniqueCount = getUniqueCompletedBenchmarks(model);
    return Math.round((uniqueCount / totalBenchmarks) * 100);
};

// Calculate percentage of models that have completed a benchmark
export const getModelCoveragePercentage = (benchmarkId: string, models: ExtendedModel[]) => {
    if (models.length === 0) return 0;
    const modelsCount = getModelsCompletingBenchmark(benchmarkId, models);
    return Math.round((modelsCount / models.length) * 100);
};

// Check if a model has results for a specific benchmark
export const hasModelBenchmark = (model: ExtendedModel, benchmarkId: string) => {
    return (
        model.benchmark_results?.some(
            (result) => result.benchmark.id === benchmarkId
        ) || false
    );
};

// Get score value for a specific benchmark result
export const getBenchmarkScore = (model: ExtendedModel, benchmarkId: string) => {
    const result = model.benchmark_results?.find(
        (result) => result.benchmark.id === benchmarkId
    );
    if (!result) return null;

    if (typeof result.score === "number") {
        return result.score.toFixed(1);
    }

    if (typeof result.score === "string") {
        // Remove % if present, parse to number, and format to 1 decimal place
        const score = parseFloat(result.score.replace("%", ""));
        return !isNaN(score) ? score.toFixed(1) : result.score;
    }

    return String(result.score);
};

// Get the score color class based on the score value
export const getScoreColorClass = (score: string | null) => {
    if (!score) return "";

    const numScore = parseFloat(score);
    if (isNaN(numScore)) return "";

    if (numScore > 80) {
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    } else if (numScore > 60) {
        return "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300";
    } else if (numScore > 40) {
        return "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300";
    } else {
        return "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300";
    }
};
