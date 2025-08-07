"use client";

import { useMemo } from "react";
import { useQueryState } from "nuqs";
import { ModelsGrid } from "./ModelsGrid";
import type { ExtendedModel } from "@/data/types";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ModelsDisplayProps {
	models: ExtendedModel[];
}

export default function ModelsDisplay({ models }: ModelsDisplayProps) {
	const [search, setSearch] = useQueryState("search", {
		defaultValue: "",
	});

	const filteredModels = useMemo(() => {
		let filtered = models;

		if (search.trim()) {
			const q = search.trim().toLowerCase();
			filtered = filtered.filter(
				(m: ExtendedModel) =>
					m.name.toLowerCase().includes(q) ||
					(m.description &&
						m.description.toLowerCase().includes(q)) ||
					m.provider.name.toLowerCase().includes(q)
			);
		}
		filtered = [...filtered].sort((a: ExtendedModel, b: ExtendedModel) => {
			// First sort by provider name, then by release date (newest first)
			const providerCompare = a.provider.name.localeCompare(
				b.provider.name
			);
			if (providerCompare !== 0) return providerCompare;
			// Assuming releaseDate is a string or Date; newest first
			const dateA = a.release_date
				? new Date(a.release_date).getTime()
				: 0;
			const dateB = b.release_date
				? new Date(b.release_date).getTime()
				: 0;
			return dateB - dateA;
		});
		return filtered;
	}, [models, search]);

	return (
		<>
			<div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
				<h1 className="font-bold text-xl text-black mb-2 md:mb-0">
					Models
				</h1>
				<div className="relative w-full md:w-1/4">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
					<Input
						placeholder="Search models or providers..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="pl-9 pr-2 py-1.5 text-sm rounded-full bg-background border focus:outline-hidden focus:ring-2 focus:ring-primary w-full"
						style={{ minWidth: 0 }}
					/>
				</div>
			</div>
			<ModelsGrid filteredModels={filteredModels} />
		</>
	);
}
