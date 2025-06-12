"use client";

import { useState, useMemo } from "react";
import PriceProviderCard from "./PriceProviderCard";
import { Card, CardContent } from "@/components/ui/card";
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
	DollarSign,
} from "lucide-react";

interface PriceProvider {
	id: string;
	name: string;
	description?: string;
	minInputPrice?: number | null;
	minOutputPrice?: number | null;
}

interface PriceProvidersDisplayProps {
	providers: PriceProvider[];
	providerUsage: Record<string, number>;
}

export default function PriceProvidersDisplay({
	providers,
	providerUsage,
}: PriceProvidersDisplayProps) {
	// State for filters
	const [sort, setSort] = useState<string>("alpha_asc");
	const [search, setSearch] = useState<string>("");

	// Filtering and sorting logic
	const filteredProviders = useMemo(() => {
		let filtered = providers;

		// Search filter
		if (search.trim()) {
			const q = search.trim().toLowerCase();
			filtered = filtered.filter(
				(p) =>
					p.name.toLowerCase().includes(q) ||
					(p.description && p.description.toLowerCase().includes(q))
			);
		}

		// Sorting
		filtered = [...filtered].sort((a, b) => {
			if (sort === "alpha_asc") {
				return a.name.localeCompare(b.name);
			}
			if (sort === "alpha_desc") {
				return b.name.localeCompare(a.name);
			}
			if (sort === "usage_desc") {
				return (providerUsage[b.id] || 0) - (providerUsage[a.id] || 0);
			}
			if (sort === "usage_asc") {
				return (providerUsage[a.id] || 0) - (providerUsage[b.id] || 0);
			} // Helper function to calculate blended rate
			return 0;
		});

		return filtered;
	}, [providers, sort, search, providerUsage]);

	const handleReset = () => {
		setSort("alpha_asc");
		setSearch("");
	};

	const showReset = sort !== "alpha_asc" || search.trim() !== "";

	return (
		<TooltipProvider>
			{/* Filters Card */}
			<Card className="mb-8 shadow-lg">
				<CardContent className="flex flex-col md:flex-row md:items-center gap-4 p-4">
					{/* Sort Buttons */}
					<div className="flex flex-wrap items-center gap-2">
						<div className="flex">
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant={
											sort === "alpha_asc"
												? "default"
												: "ghost"
										}
										size="icon"
										className="rounded-r-none"
										aria-label="Sort alphabetically A to Z"
										onClick={() => setSort("alpha_asc")}
									>
										<ArrowDownAZ className="w-4 h-4" />
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									<p>Sort alphabetically A to Z</p>
								</TooltipContent>
							</Tooltip>

							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant={
											sort === "alpha_desc"
												? "default"
												: "ghost"
										}
										size="icon"
										className="rounded-l-none border-l-0"
										aria-label="Sort alphabetically Z to A"
										onClick={() => setSort("alpha_desc")}
									>
										<ArrowUpZA className="w-4 h-4" />
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									<p>Sort alphabetically Z to A</p>
								</TooltipContent>
							</Tooltip>
						</div>
						<div className="flex">
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant={
											sort === "usage_desc"
												? "default"
												: "ghost"
										}
										size="icon"
										className="rounded-r-none"
										aria-label="Sort by most used"
										onClick={() => setSort("usage_desc")}
									>
										<ArrowUp10 className="w-4 h-4" />
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									<p>Sort by most used first</p>
								</TooltipContent>
							</Tooltip>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant={
											sort === "usage_asc"
												? "default"
												: "ghost"
										}
										size="icon"
										className="rounded-l-none border-l-0"
										aria-label="Sort by least used"
										onClick={() => setSort("usage_asc")}
									>
										<ArrowDown01 className="w-4 h-4" />
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									<p>Sort by least used first</p>
								</TooltipContent>
							</Tooltip>{" "}
						</div>{" "}
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

					{/* Search Bar */}
					<div className="flex-1 flex justify-end">
						<div className="relative w-full max-w-xs">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Search providers..."
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								className="pl-9 pr-2 py-1.5 text-sm rounded-full bg-background border focus:outline-none focus:ring-2 focus:ring-primary w-full"
								style={{ minWidth: 0 }}
							/>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Providers Grid */}
			<div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
				{filteredProviders.length > 0 ? (
					filteredProviders.map((provider) => (
						<PriceProviderCard
							key={provider.id}
							id={provider.id}
							name={provider.name}
							description={provider.description || ""}
							usageCount={providerUsage[provider.id] || 0}
						/>
					))
				) : (
					<div className="col-span-full text-center text-muted-foreground py-12">
						No price providers found for the selected filters.
					</div>
				)}
			</div>
		</TooltipProvider>
	);
}
