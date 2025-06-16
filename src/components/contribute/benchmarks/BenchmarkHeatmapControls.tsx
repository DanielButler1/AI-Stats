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

type ViewMode = "BENCHMARK" | "MODEL";

interface BenchmarkHeatmapControlsProps {
	viewMode: ViewMode;
	searchQuery: string;
	setSearchQuery: (query: string) => void;
	modelSortMethod: "coverage-asc" | "coverage-desc" | "name";
	setModelSortMethod: (
		method: "coverage-asc" | "coverage-desc" | "name"
	) => void;
	benchmarkSortMethod: "coverage-asc" | "coverage-desc" | "name";
	setBenchmarkSortMethod: (
		method: "coverage-asc" | "coverage-desc" | "name"
	) => void;
}

export default function BenchmarkHeatmapControls({
	viewMode,
	searchQuery,
	setSearchQuery,
	modelSortMethod,
	setModelSortMethod,
	benchmarkSortMethod,
	setBenchmarkSortMethod,
}: BenchmarkHeatmapControlsProps) {
	return (
		<div className="flex flex-col sm:flex-row gap-2 mb-4">
			<div className="relative flex-1">
				<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
				<Input
					type="search"
					placeholder={
						viewMode === "MODEL"
							? "Search models or providers..."
							: "Search benchmarks..."
					}
					className="pl-8"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
				/>
			</div>
			{viewMode === "MODEL" ? (
				<Select
					value={modelSortMethod}
					onValueChange={(value) => setModelSortMethod(value as any)}
				>
					<SelectTrigger className="w-full sm:w-[180px]">
						<SelectValue placeholder="Sort by" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="coverage-desc">
							Highest Coverage
						</SelectItem>
						<SelectItem value="coverage-asc">
							Lowest Coverage
						</SelectItem>
						<SelectItem value="name">Model Name (A-Z)</SelectItem>
					</SelectContent>
				</Select>
			) : (
				<Select
					value={benchmarkSortMethod}
					onValueChange={(value) =>
						setBenchmarkSortMethod(value as any)
					}
				>
					<SelectTrigger className="w-full sm:w-[180px]">
						<SelectValue placeholder="Sort by" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="coverage-desc">Most Used</SelectItem>
						<SelectItem value="coverage-asc">Least Used</SelectItem>
						<SelectItem value="name">
							Benchmark Name (A-Z)
						</SelectItem>
					</SelectContent>
				</Select>
			)}
		</div>
	);
}
