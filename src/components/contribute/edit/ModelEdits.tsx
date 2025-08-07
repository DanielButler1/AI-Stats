"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Info, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { ExtendedModel } from "@/data/types";
import Image from "next/image";
import { useMemo, useState } from "react";
import { ModelCard } from "./ModelCard";

const PROVIDER_QUICK_FILTERS = [
	{ id: "openai", label: "OpenAI" },
	{ id: "anthropic", label: "Anthropic" },
	{ id: "google", label: "Google" },
	{ id: "meta", label: "Meta" },
	{ id: "qwen", label: "Qwen" },
	{ id: "mistral", label: "Mistral" },
	{ id: "deepseek", label: "Deepseek" },
	{ id: "x-ai", label: "xAI" },
] as const;

// Helper functions to get prices
function getModelPrices(model: ExtendedModel) {
	if (!model.prices || model.prices.length === 0) return null;
	// For now, just use the first pricing entry
	return model.prices[0];
}

interface ModelEditsProps {
	models: ExtendedModel[];
}

function validateModel(model: ExtendedModel) {
	const criticalErrors: string[] = [];
	const warnings: string[] = [];
	const suggestions: string[] = [];
	const MAX_VISIBLE_ERRORS = 3;

	// Critical (Required) Fields - only check for null
	if (model.id === null) criticalErrors.push("Missing ID");
	if (model.name === null) criticalErrors.push("Missing Name");
	if (model.provider?.provider_id === null)
		criticalErrors.push("Missing Provider ID");
	if (model.benchmark_results === null) {
		criticalErrors.push("No benchmarks provided");
	}
	if (model.release_date === null)
		criticalErrors.push("Missing release date");

	// Important (Warning) Fields - only check for null
	if (model.status === null) warnings.push("Missing status");
	if (model.announced_date === null)
		warnings.push("Missing announcement date");
	if (model.deprecation_date === null)
		warnings.push("Missing deprecation date");
	if (model.retirement_date === null)
		warnings.push("Missing retirement date");
	if (model.open_router_model_id === null)
		warnings.push("Missing OpenRouter model ID");
	if (model.input_context_length === null)
		warnings.push("Missing input context length");
	if (model.output_context_length === null)
		warnings.push("Missing output context length");
	if (model.license === null) warnings.push("Missing license");
	if (model.multimodal === null) warnings.push("Missing multimodal status");
	if (model.input_types === null) warnings.push("Missing input types");
	if (model.output_types === null) warnings.push("Missing output types");

	// Nice to Have (Suggestions) Fields - only check for null
	if (model.previous_model_id === null)
		suggestions.push("Missing previous model ID");
	if (model.web_access === null)
		suggestions.push("Missing web access status");
	if (model.reasoning === null)
		suggestions.push("Missing reasoning capability status");
	if (model.fine_tunable === null)
		suggestions.push("Missing fine-tuning capability status");
	if (model.knowledge_cutoff === null)
		suggestions.push("Missing knowledge cutoff date");
	if (model.api_reference_link === null)
		suggestions.push("Missing API reference");
	if (model.playground_link === null)
		suggestions.push("Missing playground link");
	if (model.paper_link === null) suggestions.push("Missing paper link");
	if (model.announcement_link === null)
		suggestions.push("Missing announcement link");
	if (model.repository_link === null)
		suggestions.push("Missing repository link");
	if (model.weights_link === null) suggestions.push("Missing weights link");
	if (model.parameter_count === null)
		suggestions.push("Missing parameter count");
	if (model.training_tokens === null)
		suggestions.push("Missing training tokens count");

	// Pricing and Performance Metrics - only check for null
	const prices = getModelPrices(model);
	if (prices === null) {
		warnings.push("Missing pricing information");
	}

	// Categorize the overall status
	let status: "critical" | "warning" | "complete" = "complete";
	if (criticalErrors.length > 0) {
		status = "critical";
	} else if (warnings.length > 0) {
		status = "warning";
	}

	// Return object with visible and hidden errors for each category
	const visibleCritical = criticalErrors.slice(0, MAX_VISIBLE_ERRORS);
	const visibleWarnings = warnings.slice(0, MAX_VISIBLE_ERRORS);
	const visibleSuggestions = suggestions.slice(0, MAX_VISIBLE_ERRORS);

	return {
		status,
		criticalErrors: visibleCritical,
		warnings: visibleWarnings,
		suggestions: visibleSuggestions,
		hiddenCriticalCount: Math.max(
			0,
			criticalErrors.length - MAX_VISIBLE_ERRORS
		),
		hiddenWarningCount: Math.max(0, warnings.length - MAX_VISIBLE_ERRORS),
		hiddenSuggestionCount: Math.max(
			0,
			suggestions.length - MAX_VISIBLE_ERRORS
		),
		allCriticalErrors: criticalErrors,
		allWarnings: warnings,
		allSuggestions: suggestions,
	};
}

export default function ModelEdits({ models }: ModelEditsProps) {
	const [selectedProviders, setSelectedProviders] = useState<string[]>([]);

	const results = useMemo(() => {
		return models.map((model) => {
			const validation = validateModel(model);
			return { model, ...validation };
		});
	}, [models]);

	const filteredResults = useMemo(() => {
		return results.filter(
			(result) =>
				selectedProviders.length === 0 ||
				selectedProviders.includes(result.model.provider?.provider_id)
		);
	}, [results, selectedProviders]);

	// Split models into released and unreleased based on status
	const releasedResults = filteredResults.filter(
		(result) => result.model.status !== "Rumoured"
	);
	const unreleasedResults = filteredResults.filter(
		(result) => result.model.status === "Rumoured"
	);

	// Always sort: by date (release_date, announced_date) DESC, then status priority
	const statusRank = { critical: 0, warning: 1, complete: 2 } as const;
	const sortResults = (arr: typeof filteredResults) => {
		return [...arr].sort((a, b) => {
			const getSortDate = (model: ExtendedModel) =>
				new Date(
					model.release_date || model.announced_date || 0
				).getTime();

			const dateDiff = getSortDate(b.model) - getSortDate(a.model);
			if (dateDiff !== 0) return dateDiff;
			return statusRank[a.status] - statusRank[b.status];
		});
	};

	const sortedReleasedResults = sortResults(releasedResults);
	const sortedUnreleasedResults = sortResults(unreleasedResults);

	return (
		<TooltipProvider>
			<div className="space-y-4">
				{/* Compact filter bar */}
				<Card>
					<CardContent className="pt-4 pb-3">
						<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
							<ToggleGroup
								type="multiple"
								value={selectedProviders}
								onValueChange={setSelectedProviders}
								className="flex flex-wrap gap-2"
							>
								{PROVIDER_QUICK_FILTERS.map((filter) => (
									<ToggleGroupItem
										key={filter.id}
										value={filter.id}
										variant="outline"
										className="h-8 rounded-full px-3 text-sm transition-all duration-200 data-[state=on]:bg-gray-200 data-[state=on]:text-primary hover:bg-gray-100 flex items-center gap-2"
										aria-label={`Filter by ${filter.label}`}
									>
										<Image
											src={`/providers/${filter.id}.svg`}
											alt={filter.label}
											width={14}
											height={14}
											className="rounded-sm"
										/>
										{filter.label}
									</ToggleGroupItem>
								))}
							</ToggleGroup>
						</div>
					</CardContent>
				</Card>

				<div className="space-y-6">
					{/* Released Models Section */}
					<div className="space-y-3">
						<Card>
							<CardContent className="pt-4 pb-3">
								<div className="flex items-center justify-between gap-3">
									<h2 className="text-lg font-semibold">
										Available Models
									</h2>
									<Info
										className="h-4 w-4 text-muted-foreground"
										aria-hidden="true"
									/>
								</div>
							</CardContent>
						</Card>
						<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
							{sortedReleasedResults.map((result) => (
								<ModelCard key={result.model.id} {...result} />
							))}
							{sortedReleasedResults.length === 0 && (
								<div className="col-span-full flex flex-col items-center justify-center rounded-md border border-dashed p-6 text-center">
									<Sparkles className="h-5 w-5 text-muted-foreground mb-1.5" />
									<p className="text-sm text-muted-foreground">
										No released models match your filters.
									</p>
									<Button
										className="mt-2"
										size="sm"
										variant="outline"
										onClick={() => setSelectedProviders([])}
									>
										Reset filters
									</Button>
								</div>
							)}
						</div>
					</div>

					{/* Unreleased Models Section */}
					{sortedUnreleasedResults.length > 0 && (
						<div className="space-y-3">
							<Card>
								<CardContent className="pt-4 pb-3">
									<h2 className="text-lg font-semibold">
										Rumoured Models
									</h2>
								</CardContent>
							</Card>
							<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
								{sortedUnreleasedResults.map((result) => (
									<ModelCard
										key={result.model.id}
										{...result}
									/>
								))}
							</div>
						</div>
					)}
				</div>
			</div>
		</TooltipProvider>
	);
}
