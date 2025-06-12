"use client";

import { useState, useMemo } from "react";
import ModelPriceCard from "./ModelPriceCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	Search,
	ArrowDownAZ,
	ArrowUpZA,
	ArrowDown01,
	ArrowUp10,
	ArrowDown,
	X,
} from "lucide-react";
import type { ExtendedModel } from "@/data/types";

interface ProviderModelsDisplayProps {
	providerModels: Array<{
		model: ExtendedModel;
		providerPrices: {
			input_token_price: number | null;
			output_token_price: number | null;
		};
	}>;
}

interface SortOption {
	key: string;
	label: string;
	asc: string;
	desc: string;
	iconAsc: JSX.Element;
	iconDesc: JSX.Element;
	hover: string;
}

export default function ProviderModelsDisplay({
	providerModels,
}: ProviderModelsDisplayProps) {
	// State for sort and search
	const [sort, setSort] = useState<string>("release_desc");
	const [search, setSearch] = useState<string>("");

	// Sort button config
	const sortOptions: SortOption[] = [
		{
			key: "release",
			label: "Release",
			asc: "release_asc",
			desc: "release_desc",
			iconAsc: <ArrowUpZA className="w-4 h-4" />,
			iconDesc: <ArrowDownAZ className="w-4 h-4" />,
			hover: "Sort by release date (newest/oldest)",
		},
		{
			key: "alpha",
			label: "Name",
			asc: "alpha_asc",
			desc: "alpha_desc",
			iconAsc: <ArrowDownAZ className="w-4 h-4" />,
			iconDesc: <ArrowUpZA className="w-4 h-4" />,
			hover: "Sort alphabetically (A-Z/Z-A)",
		},
		{
			key: "input_price",
			label: "Input Price",
			asc: "input_price_asc",
			desc: "input_price_desc",
			iconAsc: <ArrowUp10 className="w-4 h-4" />,
			iconDesc: <ArrowDown01 className="w-4 h-4" />,
			hover: "Sort by input token price (low to high/high to low)",
		},
		{
			key: "output_price",
			label: "Output Price",
			asc: "output_price_asc",
			desc: "output_price_desc",
			iconAsc: <ArrowUp10 className="w-4 h-4" />,
			iconDesc: <ArrowDown01 className="w-4 h-4" />,
			hover: "Sort by output token price (low to high/high to low)",
		},
		{
			key: "context",
			label: "Context",
			asc: "context_asc",
			desc: "context_desc",
			iconAsc: <ArrowDown className="w-4 h-4" />,
			iconDesc: <ArrowDown className="w-4 h-4" rotate={180} />,
			hover: "Sort by context window size (small to large/large to small)",
		},
	];

	// Filter and sort logic
	const filteredModels = useMemo(() => {
		let filtered = providerModels;

		// Search filter
		if (search.trim()) {
			const q = search.trim().toLowerCase();
			filtered = filtered.filter(
				({ model }) =>
					model.name.toLowerCase().includes(q) ||
					(model.description &&
						model.description.toLowerCase().includes(q))
			);
		}

		// Sorting
		filtered = [...filtered].sort((a, b) => {
			// Always prioritize released models over announced ones
			const aIsReleased = Boolean(a.model.release_date);
			const bIsReleased = Boolean(b.model.release_date);

			if (aIsReleased !== bIsReleased) {
				return aIsReleased ? -1 : 1;
			}

			const getDateValue = (model: ExtendedModel) => {
				return model.release_date
					? new Date(model.release_date).getTime()
					: model.announced_date
					? new Date(model.announced_date).getTime()
					: 0;
			};

			if (sort === "release_desc") {
				return getDateValue(b.model) - getDateValue(a.model);
			}
			if (sort === "release_asc") {
				return getDateValue(a.model) - getDateValue(b.model);
			}
			if (sort === "alpha_asc") {
				return a.model.name.localeCompare(b.model.name);
			}
			if (sort === "alpha_desc") {
				return b.model.name.localeCompare(a.model.name);
			}
			if (sort === "input_price_asc") {
				const aPrice = a.providerPrices.input_token_price;
				const bPrice = b.providerPrices.input_token_price;
				return (aPrice ?? Infinity) - (bPrice ?? Infinity);
			}
			if (sort === "input_price_desc") {
				const aPrice = a.providerPrices.input_token_price;
				const bPrice = b.providerPrices.input_token_price;
				return (bPrice ?? 0) - (aPrice ?? 0);
			}
			if (sort === "output_price_asc") {
				const aPrice = a.providerPrices.output_token_price;
				const bPrice = b.providerPrices.output_token_price;
				return (aPrice ?? Infinity) - (bPrice ?? Infinity);
			}
			if (sort === "output_price_desc") {
				const aPrice = a.providerPrices.output_token_price;
				const bPrice = b.providerPrices.output_token_price;
				return (bPrice ?? 0) - (aPrice ?? 0);
			}
			if (sort === "context_asc") {
				return (
					(a.model.input_context_length ?? 0) -
					(b.model.input_context_length ?? 0)
				);
			}
			if (sort === "context_desc") {
				return (
					(b.model.input_context_length ?? 0) -
					(a.model.input_context_length ?? 0)
				);
			}
			return 0;
		});

		return filtered;
	}, [providerModels, sort, search]);

	const handleReset = () => {
		setSort("release_desc");
		setSearch("");
	};

	const showReset = sort !== "release_desc" || search.trim() !== "";

	return (
		<TooltipProvider>
			<Card className="mb-8 shadow-lg">
				<div className="flex flex-col md:flex-row md:items-end gap-2 p-4">
					{/* Sort and Reset Buttons */}
					<div className="flex gap-1 md:mr-auto">
						<TooltipProvider>
							{sortOptions.map((option) => {
								const isCurrentSort = sort.startsWith(
									option.key
								);
								const isAsc = sort === option.asc;
								return (
									<Tooltip key={option.key}>
										<TooltipTrigger asChild>
											<Button
												variant={
													isCurrentSort
														? "secondary"
														: "ghost"
												}
												size="icon"
												onClick={() => {
													if (isCurrentSort) {
														setSort(
															isAsc
																? option.desc
																: option.asc
														);
													} else {
														setSort(option.asc);
													}
												}}
											>
												{isCurrentSort
													? isAsc
														? option.iconAsc
														: option.iconDesc
													: option.iconAsc}
											</Button>
										</TooltipTrigger>
										<TooltipContent>
											{option.hover}
										</TooltipContent>
									</Tooltip>
								);
							})}
						</TooltipProvider>

						{/* Reset Button */}
						{showReset && (
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											variant="ghost"
											size="icon"
											onClick={handleReset}
										>
											<X className="h-4 w-4" />
										</Button>
									</TooltipTrigger>
									<TooltipContent>
										Reset sorting
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						)}
					</div>

					{/* Search - forced right */}
					<div className="flex-1 flex justify-end">
						<div className="relative w-full max-w-xs">
							<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
							<Input
								placeholder="Search models..."
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								className="pl-9 pr-2 py-1.5 text-sm rounded-full bg-background border focus:outline-none focus:ring-2 focus:ring-primary w-full"
							/>
						</div>
					</div>
				</div>
			</Card>

			{/* Models Grid */}
			<div className="space-y-8">
				{/* Released Models with Pricing */}
				<div className="space-y-6">
					<Card className="p-4">
						<h2 className="text-center text-lg font-semibold text-muted-foreground">
							Released Models with Pricing
						</h2>
					</Card>
					<div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
						{filteredModels
							.filter(
								({ model, providerPrices }) =>
									model.release_date &&
									(providerPrices.input_token_price !==
										null ||
										providerPrices.output_token_price !==
											null)
							)
							.map(({ model, providerPrices }) => (
								<ModelPriceCard
									key={model.id}
									model={model}
									providerPrices={providerPrices}
								/>
							))}
					</div>
				</div>
				{/* Unreleased or Unpriced Models */}{" "}
				{filteredModels.some(
					(item) =>
						!item.model.release_date ||
						(item.providerPrices.input_token_price === null &&
							item.providerPrices.output_token_price === null)
				) && (
					<div className="space-y-6">
						<Card className="p-4">
							<h2 className="text-center text-lg font-semibold text-muted-foreground">
								Rumoured, Unreleased, or Unpriced Models
							</h2>
						</Card>
						<div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
							{filteredModels
								.filter(
									({ model, providerPrices }) =>
										!model.release_date ||
										(providerPrices.input_token_price ===
											null &&
											providerPrices.output_token_price ===
												null)
								)
								.map(({ model, providerPrices }) => (
									<ModelPriceCard
										key={model.id}
										model={model}
										providerPrices={providerPrices}
									/>
								))}
						</div>
					</div>
				)}
			</div>
		</TooltipProvider>
	);
}
