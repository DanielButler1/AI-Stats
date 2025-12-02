"use client";

import { debounce, useQueryState } from "nuqs";
import { ModelsGrid } from "./ModelsGrid";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModelCard } from "@/lib/fetchers/models/getAllModels";
import {
	qParser,
	yearParser,
} from "@/app/(dashboard)/models/search-params";

interface ModelsDisplayProps {
	models: ModelCard[];
	years: number[];
	activeYear: number | null;
}

export default function ModelsDisplay({
	models,
	years,
	activeYear,
}: ModelsDisplayProps) {
	const [search, setSearch] = useQueryState("q", qParser);
	const [, setYear] = useQueryState("year", yearParser);

	return (
		<>
			<div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
				<h1 className="font-bold text-xl text-black mb-2 md:mb-0">
					Models
				</h1>
				<div className="relative w-full md:w-1/5">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
					<Input
						placeholder="Search models..."
						value={search}
						onChange={(e) =>
							setSearch(e.target.value || null, {
								limitUrlUpdates: debounce(250),
							})
						}
						className="pl-9 pr-2 py-1.5 text-sm rounded-full bg-background border focus:outline-hidden focus:ring-2 focus:ring-primary w-full"
						style={{ minWidth: 0 }}
					/>
				</div>
			</div>

			{years.length > 0 && (
				<div className="mb-4 -mx-1 overflow-x-auto">
					<div className="flex gap-2 px-1 pb-1">
						{years.map((year) => (
							<Button
								key={year}
								size="sm"
								variant={
									activeYear === year ? "default" : "outline"
								}
								onClick={() => setYear(year)}
								className="px-3 py-1 text-xs whitespace-nowrap rounded-full"
							>
								{year}
							</Button>
						))}
					</div>
				</div>
			)}

			<ModelsGrid filteredModels={models} />
		</>
	);
}
