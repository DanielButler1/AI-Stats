"use client";

import { useState, useMemo } from "react";
import { ModelCard } from "@/components/provider/ModelCard";
import { MetricModelCard } from "@/components/provider/MetricModelCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
	Popover,
	PopoverTrigger,
	PopoverContent,
} from "@/components/ui/popover";
import {
	Filter,
	Search,
	ArrowDownAZ,
	ArrowUpZA,
	ArrowUp10,
	ArrowDown01,
	CalendarArrowUp,
	CalendarArrowDown,
	ArrowUp,
	ArrowDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";
import type { ExtendedModel } from "@/data/types";
import Image from "next/image";

interface ModelsDisplayProps {
	models: ExtendedModel[];
}

export default function ModelsDisplay({ models }: ModelsDisplayProps) {
	// State for filters
	const [provider, setProvider] = useState<string>("all");
	const [sort, setSort] = useState<string>("release_desc");
	const [search, setSearch] = useState<string>("");
	const [view, setView] = useState<"card" | "metric">("card");
	// Get unique providers for filter
	const providers = useMemo(() => {
		// Create a Map using provider_id as the key to ensure uniqueness
		const uniqueProviders = new Map();
		models.forEach((m) => {
			if (!uniqueProviders.has(m.provider.provider_id)) {
				uniqueProviders.set(m.provider.provider_id, m.provider);
			}
		});
		// Convert to array and sort by name
		return Array.from(uniqueProviders.values()).sort((a, b) =>
			a.name.localeCompare(b.name)
		);
	}, [models]);

	// Sort button config
	const cardSortOptions = [
		{
			key: "release",
			label: "Release Date",
			asc: "release_asc",
			desc: "release_desc",
			iconAsc: <CalendarArrowUp className="w-4 h-4" />,
			iconDesc: <CalendarArrowDown className="w-4 h-4" />,
			hover: "Sort by release date (ascending/descending)",
		},
		{
			key: "price",
			label: "Price",
			asc: "price_asc",
			desc: "price_desc",
			iconAsc: <ArrowUp10 className="w-4 h-4" />,
			iconDesc: <ArrowDown01 className="w-4 h-4" />,
			hover: "Sort by price per input token (ascending/descending)",
		},
		{
			key: "alpha",
			label: "Alphabetically",
			asc: "alpha_asc",
			desc: "alpha_desc",
			iconAsc: <ArrowDownAZ className="w-4 h-4" />,
			iconDesc: <ArrowUpZA className="w-4 h-4" />,
			hover: "Sort alphabetically (A-Z/Z-A)",
		},
	];

	const metricSortOptions = [
		{
			key: "score",
			label: "AI Stats Score",
			asc: "score_asc",
			desc: "score_desc",
			iconAsc: <ArrowUp className="w-4 h-4" />,
			iconDesc: <ArrowDown className="w-4 h-4" />,
			hover: "Sort by AI Stats Score (ascending/descending)",
		},
		{
			key: "rd",
			label: "RD",
			asc: "rd_asc",
			desc: "rd_desc",
			iconAsc: <ArrowUp className="w-4 h-4" />,
			iconDesc: <ArrowDown className="w-4 h-4" />,
			hover: "Sort by RD (ascending/descending)",
		},
		{
			key: "vol",
			label: "Vol",
			asc: "vol_asc",
			desc: "vol_desc",
			iconAsc: <ArrowUp className="w-4 h-4" />,
			iconDesc: <ArrowDown className="w-4 h-4" />,
			hover: "Sort by Vol (ascending/descending)",
		},
		{
			key: "valueScore",
			label: "Price Adjusted",
			asc: "valueScore_asc",
			desc: "valueScore_desc",
			iconAsc: <ArrowUp10 className="w-4 h-4" />,
			iconDesc: <ArrowDown01 className="w-4 h-4" />,
			hover: "Sort by Price Adjusted (ascending/descending)",
		},
	];

	const sortOptions = view === "metric" ? metricSortOptions : cardSortOptions;

	const getSortState = () => {
		for (const opt of sortOptions) {
			if (sort === opt.asc) return { ...opt, dir: "asc" };
			if (sort === opt.desc) return { ...opt, dir: "desc" };
		}
		return { ...sortOptions[0], dir: "desc" };
	};

	const currentSort = getSortState();

	// Filtering and sorting logic
	const filteredModels = useMemo(() => {
		let filtered = models;
		// Provider filter
		if (provider !== "all") {
			filtered = filtered.filter(
				(m) => m.provider.provider_id === provider
			);
		}
		// Search filter (now matches model name and provider name)
		if (search.trim()) {
			const q = search.trim().toLowerCase();
			filtered = filtered.filter(
				(m) =>
					m.name.toLowerCase().includes(q) ||
					(m.description &&
						m.description.toLowerCase().includes(q)) ||
					m.provider.name.toLowerCase().includes(q)
			);
		}
		// Sorting
		filtered = [...filtered].sort((a, b) => {
			const getDateValue = (model: ExtendedModel) => {
				return (
					model.release_date || model.announced_date || "1970-01-01"
				);
			};

			if (view === "card") {
				if (sort === "release_desc") {
					return (
						new Date(getDateValue(b)).getTime() -
						new Date(getDateValue(a)).getTime()
					);
				}
				if (sort === "release_asc") {
					return (
						new Date(getDateValue(a)).getTime() -
						new Date(getDateValue(b)).getTime()
					);
				}
				if (sort === "price_asc") {
					const aPrice = a.prices?.[0]?.input_token_price;
					const bPrice = b.prices?.[0]?.input_token_price;
					return (aPrice ?? Infinity) - (bPrice ?? Infinity);
				}
				if (sort === "price_desc") {
					const aPrice = a.prices?.[0]?.input_token_price;
					const bPrice = b.prices?.[0]?.input_token_price;
					return (bPrice ?? 0) - (aPrice ?? 0);
				}
				if (sort === "alpha_asc") {
					return a.name.localeCompare(b.name);
				}
				if (sort === "alpha_desc") {
					return b.name.localeCompare(a.name);
				}
			} else if (view === "metric") {
				if (sort === "score_asc") {
					return (
						(a.glickoRating?.rating ?? -Infinity) -
						(b.glickoRating?.rating ?? -Infinity)
					);
				}
				if (sort === "score_desc") {
					return (
						(b.glickoRating?.rating ?? -Infinity) -
						(a.glickoRating?.rating ?? -Infinity)
					);
				}
				if (sort === "rd_asc") {
					return (
						(a.glickoRating?.rd ?? Infinity) -
						(b.glickoRating?.rd ?? Infinity)
					);
				}
				if (sort === "rd_desc") {
					return (
						(b.glickoRating?.rd ?? -Infinity) -
						(a.glickoRating?.rd ?? -Infinity)
					);
				}
				if (sort === "vol_asc") {
					return (
						(a.glickoRating?.vol ?? Infinity) -
						(b.glickoRating?.vol ?? Infinity)
					);
				}
				if (sort === "vol_desc") {
					return (
						(b.glickoRating?.vol ?? -Infinity) -
						(a.glickoRating?.vol ?? -Infinity)
					);
				}
				if (sort === "valueScore_asc") {
					return (
						(a.valueScore ?? Infinity) - (b.valueScore ?? Infinity)
					);
				}
				if (sort === "valueScore_desc") {
					return (
						(b.valueScore ?? -Infinity) -
						(a.valueScore ?? -Infinity)
					);
				}
			}
			return 0;
		});
		return filtered;
	}, [models, provider, sort, search, view]);

	const handleReset = () => {
		setProvider("all");
		setSort("release_desc");
		setSearch("");
	};

	const showReset =
		provider !== "all" || sort !== "release_desc" || search.trim() !== "";

	return (
		<TooltipProvider>
			<Card className="mb-8 shadow-lg">
				<CardContent className="flex flex-col md:flex-row md:items-end gap-2 p-4">
					{/* Provider Filter + Badge (centered) */}
					<div className="flex items-center gap-2">
						<Popover>
							<PopoverTrigger asChild>
								<Button
									variant="ghost"
									size="icon"
									className="mr-2"
									aria-label="Filter by provider"
								>
									<Filter className="w-5 h-5" />
								</Button>
							</PopoverTrigger>
							<PopoverContent align="start" className="w-48 p-2">
								<div className="font-semibold mb-2 text-sm">
									Provider
								</div>
								<Button
									variant={
										provider === "all" ? "default" : "ghost"
									}
									onClick={() => setProvider("all")}
									className="w-full justify-between mb-1 flex items-center"
								>
									<span>All Providers</span>
								</Button>{" "}
								{providers.map((p) => (
									<Button
										key={p.provider_id}
										variant={
											provider === p.provider_id
												? "default"
												: "ghost"
										}
										onClick={() =>
											setProvider(p.provider_id)
										}
										className="w-full justify-between mb-1 flex items-center"
									>
										<span>{p.name}</span>
										<Image
											src={`/providers/${p.provider_id}.svg`}
											alt={p.name}
											className="ml-2 w-5 h-5 rounded-full border bg-white object-contain"
											width={20}
											height={20}
										/>
									</Button>
								))}
							</PopoverContent>
						</Popover>{" "}
						{provider !== "all" && (
							<Badge
								variant="outline"
								className="flex items-center gap-2 px-2 py-1 text-xs"
							>
								<span>
									{
										providers.find(
											(p) => p.provider_id === provider
										)?.name
									}
								</span>
								<Image
									src={`/providers/${provider}.svg`}
									alt={
										providers.find(
											(p) => p.provider_id === provider
										)?.name || provider
									}
									className="w-4 h-4 rounded-full border bg-white object-contain"
									width={16}
									height={16}
								/>
							</Badge>
						)}
					</div>

					{/* Sort Buttons + Badge + Reset */}
					<div className="flex items-center gap-2">
						{sortOptions.map((opt) => {
							const isActive =
								sort === opt.asc || sort === opt.desc;
							const isAsc = sort === opt.asc;
							return (
								<HoverCard key={opt.key}>
									<HoverCardTrigger asChild>
										<Button
											variant={
												isActive ? "default" : "ghost"
											}
											size="icon"
											aria-label={opt.label}
											onClick={() =>
												setSort(
													isAsc ? opt.desc : opt.asc
												)
											}
										>
											{isAsc ? opt.iconAsc : opt.iconDesc}
										</Button>
									</HoverCardTrigger>
									<HoverCardContent
										side="bottom"
										className="text-xs"
									>
										<span className="text-muted-foreground">
											{opt.hover}
										</span>
									</HoverCardContent>
								</HoverCard>
							);
						})}
						<Badge
							variant="outline"
							className="flex items-center gap-2 px-2 py-1 text-xs"
						>
							{currentSort.label}{" "}
							{currentSort.dir === "asc" ? (
								<ArrowUp className="ml-2 w-4 h-4" />
							) : (
								<ArrowDown className="ml-2 w-4 h-4" />
							)}
						</Badge>
						{showReset && (
							<Button
								variant="outline"
								size="sm"
								className="ml-2"
								onClick={handleReset}
							>
								Reset
							</Button>
						)}
					</div>

					{/* View Toggle */}
					<div className="flex items-center gap-2 ml-auto">
						<Button
							variant={view === "card" ? "default" : "ghost"}
							size="sm"
							onClick={() => setView("card")}
						>
							Card View
						</Button>
						<Button
							variant={view === "metric" ? "default" : "ghost"}
							size="sm"
							onClick={() => setView("metric")}
						>
							Metric View
						</Button>
					</div>

					{/* Search Bar */}
					<div className="flex-1 flex justify-end">
						<div className="relative w-full max-w-xs">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Search models or providers..."
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								className="pl-9 pr-2 py-1.5 text-sm rounded-full bg-background border focus:outline-none focus:ring-2 focus:ring-primary w-full"
								style={{ minWidth: 0 }}
							/>
						</div>
					</div>
				</CardContent>
			</Card>
			{/* Models Grid */}
			<div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
				{filteredModels.length > 0 ? (
					filteredModels.map((model) =>
						view === "card" ? (
							<ModelCard key={model.id} model={model} />
						) : (
							<MetricModelCard key={model.id} model={model} />
						)
					)
				) : (
					<div className="col-span-full text-center text-muted-foreground py-12">
						No models found for the selected filters.
					</div>
				)}
			</div>
		</TooltipProvider>
	);
}
