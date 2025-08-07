"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface PricingHeatmapControlsProps {
	searchQuery: string;
	setSearchQuery: (query: string) => void;
	sortMethod: "release-desc" | "coverage-desc" | "coverage-asc" | "name";
	setSortMethod: (
		method: "release-desc" | "coverage-desc" | "coverage-asc" | "name"
	) => void;
}

export default function PricingHeatmapControls({
	searchQuery,
	setSearchQuery,
	sortMethod,
	setSortMethod,
}: PricingHeatmapControlsProps) {
	const showReset =
		sortMethod !== "coverage-desc" || searchQuery.trim() !== "";

	const handleReset = () => {
		setSortMethod("release-desc");
		setSearchQuery("");
	};

	const handleSortChange = (value: string) => {
		setSortMethod(
			value as "release-desc" | "coverage-desc" | "coverage-asc" | "name"
		);
	};

	return (
		<div className="mb-6 flex flex-col md:flex-row md:items-center gap-4">
			{/* Search */}
			<div className="flex-1 flex items-center relative">
				<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
				<Input
					placeholder="Search models..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className="pl-9 pr-4"
				/>
			</div>

			{/* Sort Dropdown */}
			<div className="flex flex-wrap items-center gap-2">
				<Select value={sortMethod} onValueChange={handleSortChange}>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="Sort by...">
							{sortMethod === "release-desc"
								? "Newest Release"
								: sortMethod === "coverage-desc"
								? "Most Coverage"
								: sortMethod === "coverage-asc"
								? "Least Coverage"
								: "Alphabetical (A-Z)"}
						</SelectValue>
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="release-desc">
							Newest Release
						</SelectItem>
						<SelectItem value="coverage-desc">
							Most Coverage
						</SelectItem>
						<SelectItem value="coverage-asc">
							Least Coverage
						</SelectItem>
						<SelectItem value="name">Alphabetical (A-Z)</SelectItem>
					</SelectContent>
				</Select>
			</div>
		</div>
	);
}
