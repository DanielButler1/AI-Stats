"use client";

import { useMemo } from "react";
import { useQueryState } from "nuqs";
import BenchmarkCard from "./BenchmarkCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Benchmark } from "@/data/types";

interface BenchmarksDisplayProps {
	benchmarks: Benchmark[];
}

export default function BenchmarksDisplay({
	benchmarks,
}: BenchmarksDisplayProps) {
	// Filter and always sort A-Z
	const [search, setSearch] = useQueryState("search", {
		defaultValue: "",
	});
	const filteredBenchmarks = useMemo(() => {
		let filtered = benchmarks;
		if (search.trim()) {
			const q = search.trim().toLowerCase();
			filtered = filtered.filter(
				(b) =>
					b.name.toLowerCase().includes(q) ||
					(b.description && b.description.toLowerCase().includes(q))
			);
		}
		return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
	}, [benchmarks, search]);

	return (
		<div>
			<div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
				<h1 className="font-bold text-xl text-black mb-2 md:mb-0">
					All Benchmarks
				</h1>
				<div className="relative w-full max-w-xs md:w-80">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
					<Input
						placeholder="Search benchmarks..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="pl-9 pr-2 py-1.5 text-sm rounded-full bg-background border focus:outline-hidden focus:ring-2 focus:ring-primary w-full"
						style={{ minWidth: 0 }}
					/>
				</div>
			</div>
			<div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
				{filteredBenchmarks.length > 0 ? (
					filteredBenchmarks.map((benchmark) => (
						<BenchmarkCard
							key={benchmark.id}
							id={benchmark.id}
							name={benchmark.name}
							benchmarkLink={benchmark.link}
						/>
					))
				) : (
					<div className="col-span-full text-center text-muted-foreground py-12">
						No benchmarks found.
					</div>
				)}
			</div>
		</div>
	);
}
