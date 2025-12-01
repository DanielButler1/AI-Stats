"use client";

import { useMemo } from "react";
import { useQueryState } from "nuqs";
import APIProviderCard from "./APIProviderCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { APIProviderCard as APIProviderCardType } from "@/lib/fetchers/api-providers/getAllAPIProviders";

interface APIProvidersDisplayProps {
	providers: APIProviderCardType[];
}

export default function APIProvidersDisplay({
	providers,
}: APIProvidersDisplayProps) {
	// State for filters
	const [search, setSearch] = useQueryState("search", {
		defaultValue: "",
	});

	// Filtering and sorting logic
	const filteredProviders = useMemo(() => {
		let filtered = providers;

		// Search filter
		if (search.trim()) {
			const q = search.trim().toLowerCase();
			filtered = filtered.filter((p) =>
				p.api_provider_name.toLowerCase().includes(q)
			);
		}

		// Sorting
		filtered = [...filtered].sort((a, b) => {
			return a.api_provider_name.localeCompare(b.api_provider_name);
		});

		return filtered;
	}, [providers, search]);

	return (
		<>
			{/* Title and Search Bar Row */}
			<div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
				<h1 className="font-bold text-xl text-black mb-2 md:mb-0">
					API Providers
				</h1>
				<div className="flex-1 flex justify-end">
					<div className="relative w-full max-w-xs">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder="Search API providers..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className="pl-9 pr-2 py-1.5 text-sm rounded-full bg-background border focus:outline-hidden focus:ring-2 focus:ring-primary w-full"
							style={{ minWidth: 0 }}
						/>
					</div>
				</div>
			</div>

			{/* API Providers Grid */}
			<div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
				{filteredProviders.length > 0 ? (
					filteredProviders.map((provider) => (
						<APIProviderCard
							key={provider.api_provider_id}
							api_provider={provider}
						/>
					))
				) : (
					<div className="col-span-full text-center text-muted-foreground py-12">
						No price providers found for the selected filters.
					</div>
				)}
			</div>
		</>
	);
}
