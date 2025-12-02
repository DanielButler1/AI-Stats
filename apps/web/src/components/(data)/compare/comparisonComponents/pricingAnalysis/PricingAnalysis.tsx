import { ExtendedModel, Price } from "@/data/types";
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import PricingBarChart from "./PricingBarChart";
import React from "react";
import {
	HoverCard,
	HoverCardTrigger,
	HoverCardContent,
} from "@/components/ui/hover-card";
import Link from "next/link";
import { Logo } from "@/components/Logo";

interface PricingAnalysisProps {
	selectedModels: ExtendedModel[];
}

// Helper functions to get prices (summary-level)
function getModelPrices(model: ExtendedModel): Price | null {
	if (!model.prices || model.prices.length === 0) return null;
	// By convention, loadCompareModels puts a synthetic "summary"
	// entry first, derived from the underlying pricing rules.
	return model.prices[0];
}

function getInputPrice(model: ExtendedModel): number | null {
	const prices = getModelPrices(model);
	return prices?.input_token_price ?? null;
}

function getOutputPrice(model: ExtendedModel): number | null {
	const prices = getModelPrices(model);
	return prices?.output_token_price ?? null;
}

function getTotalPrice(model: ExtendedModel): number | null {
	const input = getInputPrice(model);
	const output = getOutputPrice(model);
	if (input === null || output === null) return null;
	return ((input * 1 + output * 3) * 1_000_000) / 4;
}

function getCheapestBadge(models: ExtendedModel[]) {
	if (models.length < 2) return null;
	const totalPrices = models.map((m) => getTotalPrice(m) ?? 0);
	const minTotal = Math.min(...totalPrices);
	const cheapestIdxs = totalPrices
		.map((p, i) => (p === minTotal ? i : -1))
		.filter((i) => i !== -1);
	if (cheapestIdxs.length === 1) {
		return (
			<Badge
				variant="default"
				className="bg-green-100 text-green-800 border border-green-300 hover:bg-green-200 hover:text-green-900 hover:border-green-400 transition-colors"
			>
				{models[cheapestIdxs[0]].name} is cheapest
			</Badge>
		);
	}
	return (
		<Badge
			variant="secondary"
			className="bg-blue-100 text-blue-800 border border-blue-300"
		>
			Tied: {cheapestIdxs.map((i) => models[i].name).join(", ")}
		</Badge>
	);
}

function getStatCards(models: ExtendedModel[]) {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
			{models.map((model) => {
				const input = getInputPrice(model);
				const output = getOutputPrice(model);
				const total = getTotalPrice(model);

				// Prepare multipliers for hover cards
				const inputComparisons = models
					.filter(
						(m) => m.id !== model.id && getInputPrice(m) != null
					)
					.map((m) => {
						const otherInput = getInputPrice(m);
						const mult =
							input && otherInput ? input / otherInput : 0;
						let color = "text-gray-500";
						if (mult > 1.01) color = "text-red-600 font-semibold";
						else if (mult < 0.99)
							color = "text-green-700 font-semibold";
						return (
							<div key={m.id} className={`mb-1 ${color}`}>
								{mult.toFixed(2)}x vs {m.name}
							</div>
						);
					});
				const outputComparisons = models
					.filter(
						(m) => m.id !== model.id && getOutputPrice(m) != null
					)
					.map((m) => {
						const otherOutput = getOutputPrice(m);
						const mult =
							output && otherOutput ? output / otherOutput : 0;
						let color = "text-gray-500";
						if (mult > 1.01) color = "text-red-600 font-semibold";
						else if (mult < 0.99)
							color = "text-green-700 font-semibold";
						return (
							<div key={m.id} className={`mb-1 ${color}`}>
								{mult.toFixed(2)}x vs {m.name}
							</div>
						);
					});
				const totalComparisons = models
					.filter(
						(m) => m.id !== model.id && getTotalPrice(m) != null
					)
					.map((m) => {
						const mTotal = getTotalPrice(m);
						const mult = total && mTotal ? total / mTotal : 0;
						let color = "text-gray-500";
						if (mult > 1.01) color = "text-red-600 font-semibold";
						else if (mult < 0.99)
							color = "text-green-700 font-semibold";
						return (
							<div key={m.id} className={`mb-1 ${color}`}>
								{mult.toFixed(2)}x vs {m.name}
							</div>
						);
					});

				return (
					<Card key={model.id} className="shadow border-none">
						<CardHeader className="pb-2">
							<CardTitle className="text-base font-semibold flex items-center gap-2">
								<Link
									href={`/organisations/${model.provider.provider_id}`}
								>
									<Logo
										id={model.provider.provider_id}
										alt={model.provider.name}
										width={20}
										height={20}
										className="mr-2 h-5 w-5 rounded-full border bg-white object-contain"
									/>
								</Link>
								<Link
									href={`/models/${encodeURIComponent(
										model.id
									)}`}
									className="group"
								>
									<span className="relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-current after:transition-all after:duration-300 group-hover:after:w-full">
										{model.name}
									</span>
								</Link>
							</CardTitle>
						</CardHeader>
						<CardContent className="pt-0">
							<div className="flex flex-col gap-2">
								<div className="flex items-center justify-between text-sm">
									<span>Input $/M</span>
									<HoverCard>
										<HoverCardTrigger asChild>
											<span className="font-mono font-bold cursor-help">
												{input != null
													? `$${(
															input * 1_000_000
													  ).toFixed(2)}`
													: "-"}
											</span>
										</HoverCardTrigger>
										<HoverCardContent>
											<div className="font-semibold mb-2">
												Input price comparison
											</div>
											{inputComparisons.length > 0 ? (
												inputComparisons
											) : (
												<span className="text-gray-400">
													No other models to compare.
												</span>
											)}
										</HoverCardContent>
									</HoverCard>
								</div>
								<div className="flex items-center justify-between text-sm">
									<span>Output $/M</span>
									<HoverCard>
										<HoverCardTrigger asChild>
											<span className="font-mono font-bold cursor-help">
												{output != null
													? `$${(
															output * 1_000_000
													  ).toFixed(2)}`
													: "-"}
											</span>
										</HoverCardTrigger>
										<HoverCardContent>
											<div className="font-semibold mb-2">
												Output price comparison
											</div>
											{outputComparisons.length > 0 ? (
												outputComparisons
											) : (
												<span className="text-gray-400">
													No other models to compare.
												</span>
											)}
										</HoverCardContent>
									</HoverCard>
								</div>
								<div className="flex items-center justify-between text-sm mt-1 border-t pt-2">
									<span>Total (1:3) $/M</span>
									<HoverCard>
										<HoverCardTrigger asChild>
											<span className="font-mono font-bold cursor-help">
												{total != null
													? `$${total.toFixed(2)}`
													: "-"}
											</span>
										</HoverCardTrigger>
										<HoverCardContent>
											<div className="font-semibold mb-2">
												Total price (1:3) comparison
											</div>
											{totalComparisons.length > 0 ? (
												totalComparisons
											) : (
												<span className="text-gray-400">
													No other models to compare.
												</span>
											)}
										</HoverCardContent>
									</HoverCard>
								</div>
							</div>
						</CardContent>
					</Card>
				);
			})}
		</div>
	);
}

function getBarChartData(models: ExtendedModel[]) {
	return [
		{
			type: "Input $/M",
			...Object.fromEntries(
				models.map((m) => [
					m.name,
					getInputPrice(m) != null
						? getInputPrice(m)! * 1_000_000
						: null,
				])
			),
		},
		{
			type: "Output $/M",
			...Object.fromEntries(
				models.map((m) => [
					m.name,
					getOutputPrice(m) != null
						? getOutputPrice(m)! * 1_000_000
						: null,
				])
			),
		},
	];
}

function BarChartTooltip({ active, payload, label }: any) {
	if (!active || !payload || payload.length === 0) return null;
	return (
		<Card className="bg-white dark:bg-zinc-950 rounded-lg p-4 min-w-60">
			<CardHeader className="pb-2 p-0 mb-2">
				<CardTitle className="font-semibold text-sm">{label}</CardTitle>
			</CardHeader>
			<CardContent className="p-0">
				{payload.map((p: any) => (
					<div
						key={p.name}
						className="flex justify-between text-xs mb-1"
					>
						<span>{p.name}</span>
						<span>
							${p.value != null ? p.value.toFixed(2) : "-"} per 1M
							Tokens
						</span>
					</div>
				))}
			</CardContent>
		</Card>
	);
}

// Build per-meter comparison rows using the enriched Price entries
// from loadCompareModels. We only keep meters that are present on
// at least two selected models so the comparison is meaningful.
type MeterComparisonRow = {
	meter: string;
	perModel: {
		modelId: string;
		modelName: string;
		pricePerMillion: number | null;
	}[];
};

function buildMeterComparisonRows(
	models: ExtendedModel[]
): MeterComparisonRow[] {
	const meterMap = new Map<
		string,
		Map<string, { pricePerMillion: number | null }>
	>();

	for (const model of models) {
		const prices = model.prices ?? [];
		for (const price of prices) {
			if (!price.meter || price.meter === "summary") continue;
			const meterKey = price.meter;

			const basePrice =
				price.input_token_price ??
				price.output_token_price ??
				price.cached_input_token_price ??
				null;

			const perMillion =
				basePrice != null && Number.isFinite(basePrice)
					? basePrice * 1_000_000
					: null;

			if (!meterMap.has(meterKey)) {
				meterMap.set(
					meterKey,
					new Map<string, { pricePerMillion: number | null }>()
				);
			}

			meterMap
				.get(meterKey)!
				.set(model.id, { pricePerMillion: perMillion });
		}
	}

	const rows: MeterComparisonRow[] = [];

	for (const [meter, byModel] of meterMap.entries()) {
		if (byModel.size < 2) continue;

		const perModel = models.map((model) => {
			const entry = byModel.get(model.id);
			return {
				modelId: model.id,
				modelName: model.name,
				pricePerMillion: entry?.pricePerMillion ?? null,
			};
		});

		rows.push({ meter, perModel });
	}

	rows.sort((a, b) => a.meter.localeCompare(b.meter));
	return rows;
}

export default function PricingAnalysis({
	selectedModels,
}: PricingAnalysisProps) {
	if (!selectedModels || selectedModels.length === 0) return null;

	const meterRows = buildMeterComparisonRows(selectedModels);

	return (
		<Card className="mb-6 bg-white dark:bg-zinc-950 rounded-lg shadow">
			<CardHeader className="flex flex-row items-start justify-between border-b border-b-zinc-200">
				<div className="flex flex-col">
					<CardTitle className="text-lg font-semibold">
						Pricing Analysis
					</CardTitle>
					<CardDescription className="text-muted-foreground text-sm">
						Price comparison per million tokens
					</CardDescription>
				</div>
				{getCheapestBadge(selectedModels)}
			</CardHeader>
			<CardContent className="p-6">
				{getStatCards(selectedModels)}
				<div className="hidden sm:block bg-muted p-4 rounded-lg text-center">
					<PricingBarChart
						chartData={getBarChartData(selectedModels)}
						models={selectedModels.map((m) => ({
							name: m.name,
							provider: m.provider.name,
						}))}
						CustomTooltip={BarChartTooltip}
					/>
				</div>

				{meterRows.length > 0 && (
					<div className="mt-6 space-y-2">
						<div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
							<div>
								<div className="text-sm font-semibold">
									Pricing by meter
								</div>
								<p className="text-xs text-muted-foreground">
									Comparing only meters that are present on at
									least two selected models.
								</p>
							</div>
						</div>
						<div className="overflow-x-auto rounded-md border border-border bg-background/60 mt-2">
							<table className="min-w-full text-xs">
								<thead>
									<tr className="border-b border-border bg-muted/60">
										<th className="px-3 py-2 text-left font-medium">
											Meter
										</th>
										{selectedModels.map((model) => (
											<th
												key={model.id}
												className="px-3 py-2 text-right font-medium whitespace-nowrap"
											>
												{model.name}
											</th>
										))}
									</tr>
								</thead>
								<tbody>
									{meterRows.map((row) => (
										<tr
											key={row.meter}
											className="border-b border-border/60 last:border-b-0"
										>
											<td className="px-3 py-2 text-left font-mono text-[11px]">
												{row.meter}
											</td>
											{row.perModel.map(
												(entry, idx) => {
													const value =
														entry.pricePerMillion;
													const all =
														row.perModel
															.map(
																(v) =>
																	v.pricePerMillion
															)
															.filter(
																(v) =>
																	v != null &&
																	Number.isFinite(
																		v
																	)
															) as number[];
													const min =
														all.length > 0
															? Math.min(
																	...all
															  )
															: null;
													const isBest =
														min != null &&
														value != null &&
														value === min;
													return (
														<td
															key={`${row.meter}-${entry.modelId}-${idx}`}
															className="px-3 py-2 text-right font-mono"
														>
															{value != null &&
															Number.isFinite(
																value
															) ? (
																<span
																	className={
																		isBest
																			? "font-semibold text-emerald-600 dark:text-emerald-400"
																			: ""
																	}
																>
																	$
																	{value.toFixed(
																		2
																	)}
																</span>
															) : (
																<span className="text-muted-foreground">
																	-
																</span>
															)}
														</td>
													);
												}
											)}
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
