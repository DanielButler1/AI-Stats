"use client";

import { useState, useMemo } from "react";
import ModelPriceCard from "@/components/prices/Provider/[Provider]/ModelPriceCard";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import type { ExtendedModel } from "@/data/types";

interface ProviderModelsDisplayProps {
	providerModels: Array<{
		model: ExtendedModel;
		providerPrices: {
			input_token_price: number | null;
			output_token_price: number | null;
		};
	}>;
	providerName: string;
}

export default function ProviderModelsDisplay({
	providerModels,
	providerName,
}: ProviderModelsDisplayProps) {
	// State for search only
	const [search, setSearch] = useState<string>("");

	// Filter and sort logic: sort by release_date (desc), then announce_date (desc) if no release_date
	const filteredModels = useMemo(() => {
		let filtered = providerModels;
		if (search.trim()) {
			const q = search.trim().toLowerCase();
			filtered = filtered.filter(
				({ model }) =>
					model.name.toLowerCase().includes(q) ||
					(model.description &&
						model.description.toLowerCase().includes(q))
			);
		}
		// Sort: release_date desc, then announce_date desc if no release_date
		filtered = [...filtered].sort((a, b) => {
			const aRelease = a.model.release_date
				? new Date(a.model.release_date).getTime()
				: null;
			const bRelease = b.model.release_date
				? new Date(b.model.release_date).getTime()
				: null;
			if (aRelease && bRelease) {
				return bRelease - aRelease;
			}
			if (aRelease) return -1;
			if (bRelease) return 1;
			// If neither has release_date, sort by announced_date desc
			const aAnnounce = a.model.announced_date
				? new Date(a.model.announced_date).getTime()
				: 0;
			const bAnnounce = b.model.announced_date
				? new Date(b.model.announced_date).getTime()
				: 0;
			return bAnnounce - aAnnounce;
		});
		return filtered;
	}, [providerModels, search]);

	return (
		<>
			<div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
				<div>
					<h1 className="font-bold text-xl text-black mb-2 md:mb-0">
						Models offered by {providerName}{" "}
					</h1>
				</div>
				<div className="flex-1 flex md:justify-end">
					<div className="relative w-full max-w-xs">
						<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
						<Input
							placeholder="Search models..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className="pl-9 pr-2 py-1.5 text-sm rounded-full bg-background border focus:outline-hidden focus:ring-2 focus:ring-primary w-full"
						/>
					</div>
				</div>
			</div>

			{/* Models Grid */}
			<div className="space-y-8">
				{/* Released Models with Pricing */}
				<div className="space-y-6">
					<h2 className="text-lg font-semibold text-muted-foreground">
						Released Models with Pricing
					</h2>
					<div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
						{filteredModels
							.filter(
								({ model, providerPrices }) =>
									model.release_date &&
									(providerPrices.input_token_price !==
										null ||
										providerPrices.output_token_price !==
											null)
							)
							.map(({ model }) => (
								<ModelPriceCard key={model.id} model={model} />
							))}
					</div>
				</div>
				{/* Unreleased or Unpriced Models */}
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
						<div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
							{filteredModels
								.filter(
									({ model, providerPrices }) =>
										!model.release_date ||
										(providerPrices.input_token_price ===
											null &&
											providerPrices.output_token_price ===
												null)
								)
								.map(({ model }) => (
									<ModelPriceCard
										key={model.id}
										model={model}
									/>
								))}
						</div>
					</div>
				)}
			</div>
		</>
	);
}
