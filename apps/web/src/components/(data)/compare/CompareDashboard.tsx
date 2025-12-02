"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import MainCard from "./MainCard";
import ComparisonDisplay from "./ComparisonDisplay";
import { ExtendedModel } from "@/data/types";
import { Logo } from "@/components/Logo";
import ModelCombobox from "./ModelCombobox";

type QuickComparison = {
	title: string;
	modelIds: string[];
	logos: string[];
};

const decodeModelIdFromUrl = (value: string): string => {
	const trimmed = value?.trim();
	if (!trimmed) return "";
	if (trimmed.includes("/")) return trimmed;
	if (!trimmed.includes("_")) return trimmed;
	const [organisationId, ...rest] = trimmed.split("_");
	if (!organisationId || rest.length === 0) return trimmed;
	return `${organisationId}/${rest.join("_")}`;
};

const encodeModelIdForUrl = (value: string): string => {
	if (!value) return "";
	const [organisationId, ...rest] = value.split("/");
	if (!organisationId || rest.length === 0) return value;
	return `${organisationId}_${rest.join("/")}`;
};

const quickComparisons: QuickComparison[] = [
	{
		title: "Gemini 2.5 Pro Preview vs Grok 4 vs GPT-5 vs Claude Sonnet 4.5",
		modelIds: [
			"google/gemini-2-5-pro-preview-2025-06-05",
			"x-ai/grok-4-2025-07-10",
			"openai/gpt-5-2025-08-07",
			"anthropic/claude-sonnet-4-5-2025-09-29",
		],
		logos: ["google", "xai", "openai", "anthropic"],
	},
	{
		title: "Grok 4 vs GPT-5.1",
		modelIds: ["x-ai/grok-4-2025-07-10", "openai/gpt-5-1-2025-11-12"],
		logos: ["xai", "openai"],
	},
	{
		title: "Claude Sonnet 4.5 vs Gemini 2.5 Pro Preview",
		modelIds: [
			"anthropic/claude-sonnet-4-5-2025-09-29",
			"google/gemini-2-5-pro-preview-2025-06-05",
		],
		logos: ["anthropic", "google"],
	},
	{
		title: "GPT-5 vs Claude Opus 4",
		modelIds: ["openai/gpt-5-2025-08-07", "anthropic/claude-opus-4-2025-05-21"],
		logos: ["openai", "anthropic"],
	},
	{
		title: "Grok 4 vs Claude Sonnet 4.5",
		modelIds: ["x-ai/grok-4-2025-07-10", "anthropic/claude-sonnet-4-5-2025-09-29"],
		logos: ["xai", "anthropic"],
	},
	{
		title: "Gemini 2.5 Pro Preview vs GPT-5.1",
		modelIds: [
			"google/gemini-2-5-pro-preview-2025-06-05",
			"openai/gpt-5-1-2025-11-12",
		],
		logos: ["google", "openai"],
	},
	{
		title: "Claude Sonnet 4.5 vs Grok 4 Max",
		modelIds: [
			"anthropic/claude-sonnet-4-5-2025-09-29",
			"x-ai/grok-4-heavy-2025-07-10",
		],
		logos: ["anthropic", "xai"],
	},
];

const buildQuickComparisonHref = (modelIds: string[]): string => {
	const params = new URLSearchParams();
	modelIds.forEach((id) => {
		if (id) params.append("models", encodeModelIdForUrl(id));
	});
	const queryString = params.toString();
	return queryString ? `/compare?${queryString}` : "/compare";
};

type CompareDashboardProps = {
	models: ExtendedModel[];
	comparisonData: ExtendedModel[];
};

export default function CompareDashboard({
	models,
	comparisonData,
}: CompareDashboardProps) {
	const searchParams = useSearchParams();
	const router = useRouter();
	const selected = searchParams
		.getAll("models")
		.map((value) => decodeModelIdFromUrl(value))
		.filter(Boolean);

	const selectionLookup = useMemo(() => {
		const map = new Map<string, string>();
		models.forEach((model) => {
			if (!model.id) return;
			map.set(model.id, model.id);
		});
		return map;
	}, [models]);

	const resolvedSelectionIds = useMemo(
		() => selected.map((value) => selectionLookup.get(value) ?? value),
		[selected, selectionLookup]
	);

	const resolvedSelectionSet = useMemo(
		() => new Set(resolvedSelectionIds),
		[resolvedSelectionIds]
	);

	const setSelected = (ids: string[]) => {
		const params = new URLSearchParams(searchParams.toString());
		params.delete("models");
		ids.forEach((id) => params.append("models", encodeModelIdForUrl(id)));
		router.replace(`?${params.toString()}`);
	};

	const selectedModels = models.filter((m) => resolvedSelectionSet.has(m.id));

	const notFound = resolvedSelectionIds.filter(
		(id) => !selectedModels.some((m) => m.id === id)
	);

	if (selected.length === 0) {
		const previewComparisons = quickComparisons.slice(0, 3);

		return (
			<div className="flex flex-col items-center gap-8">
				<div className="text-center space-y-2 max-w-2xl">
					<h2 className="text-3xl font-bold tracking-tight">
						Start a Model Comparison
					</h2>
					<p className="text-muted-foreground">
						Choose a curated matchup or pick any models yourself to
						launch the comparison workspace.
					</p>
				</div>

				<div className="grid w-full gap-6 lg:grid-cols-2 items-start">
					<section className="rounded-2xl border border-border/60 bg-card text-card-foreground p-6 shadow-sm flex flex-col gap-5">
						<div className="space-y-1">
							<p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
								Option 1
							</p>
							<h3 className="text-2xl font-semibold">
								Use a Quick Comparison
							</h3>
							<p className="text-muted-foreground text-sm">
								Pick from popular matchups curated by our team.
								We&apos;ll load the results instantly.
							</p>
						</div>
						<div className="space-y-3">
							{previewComparisons.map((comparison) => (
								<Link
									key={comparison.title}
									href={buildQuickComparisonHref(
										comparison.modelIds
									)}
									className="flex flex-col gap-3 rounded-xl border border-border/60 bg-muted/30 p-4 transition hover:border-primary"
								>
									<div className="flex flex-wrap items-center gap-2">
										{comparison.logos.map((logoId) => (
											<Logo
												key={`${comparison.title}-${logoId}`}
												id={logoId}
												width={28}
												height={28}
												className="h-7 w-7"
											/>
										))}
									</div>
									<span className="text-sm font-medium leading-tight">
										{comparison.title}
									</span>
								</Link>
							))}
						</div>
						<p className="text-xs text-muted-foreground">
							We keep these templates refreshed with the most
							popular matchups each week.
						</p>
					</section>

					<section className="rounded-2xl border border-border/60 bg-card text-card-foreground p-6 shadow-sm flex flex-col gap-4">
						<div className="space-y-1">
							<p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
								Option 2
							</p>
							<h3 className="text-2xl font-semibold">
								Select Your Own Models
							</h3>
							<p className="text-sm text-muted-foreground">
								Search for any combination (up to four models)
								to build a bespoke comparison.
							</p>
						</div>
						<div className="rounded-xl border border-dashed border-border/60 bg-muted/20 p-4">
							<ModelCombobox
								models={models}
								selected={selected}
								setSelected={setSelected}
							/>
						</div>
						<p className="text-xs text-muted-foreground">
							Tip: you can also use the picker pinned to the top
							of the page - this panel just gives you a dedicated
							starting point.
						</p>
					</section>
				</div>
			</div>
		);
	}

	if (selected.length > 0 && selectedModels.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
				<div className="max-w-2xl w-full bg-yellow-50 border border-yellow-200 rounded-lg p-6">
					<h2 className="text-xl font-semibold text-yellow-900 mb-2">
						Models Not Found
					</h2>
					<p className="text-yellow-800 mb-4">
						The following model IDs from the URL could not be found
						in the database:
					</p>
					<ul className="list-disc list-inside text-yellow-700 mb-4">
						{notFound.map((id) => (
							<li key={id} className="font-mono text-sm">
								{id}
							</li>
						))}
					</ul>
					<p className="text-sm text-yellow-700">
						Please use the search below to find valid model IDs.
					</p>
				</div>
				<Separator className="my-8 w-full max-w-4xl" />
				<MainCard
					models={models}
					selected={[]}
					setSelected={setSelected}
				/>
			</div>
		);
	}

	if (notFound.length > 0 && selectedModels.length > 0) {
		console.warn(
			`[CompareDashboard] ${selectedModels.length} models found, but ${notFound.length} not found:`,
			notFound
		);
	}

	if (selected.length > 0 && comparisonData.length === 0) {
		console.warn("[compare] No comparison data resolved", {
			selection: selected,
			resolvedIds: resolvedSelectionIds,
		});
		return (
			<div className="flex flex-col items-center justify-center min-h-[40vh] text-center text-muted-foreground space-y-2">
				<p>We couldn&apos;t load the comparison data for this query.</p>
				<button
					type="button"
					className="text-sm font-medium underline underline-offset-4"
					onClick={() => setSelected(resolvedSelectionIds)}
				>
					Refresh selection
				</button>
			</div>
		);
	}

	return <ComparisonDisplay selectedModels={comparisonData} />;
}
