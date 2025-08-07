/* eslint-disable no-console */
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { ExtendedModel } from "@/data/types";
import Link from "next/link";

interface DbStatsProps {
	data: ExtendedModel[];
}

export default function DatabaseStats({ data }: DbStatsProps) {
	// Unique models
	const modelCountRaw = new Set(data.map((m: ExtendedModel) => m.id)).size;
	const modelCount = Math.floor(modelCountRaw / 100) * 100;

	// Unique providers
	const providerCountRaw = new Set(
		data.map((m: ExtendedModel) => m.provider.provider_id)
	).size;
	const providerCount = Math.floor(providerCountRaw / 5) * 5;

	const benchmarks = data.flatMap(
		(m: ExtendedModel) => m.benchmark_results || []
	);

	// Total benchmark result count
	const benchmarkResultCountRaw = data.reduce(
		(acc: number, m: ExtendedModel) =>
			acc + (m.benchmark_results?.length || 0),
		0
	);
	const benchmarkResultCount =
		Math.floor(benchmarkResultCountRaw / 100) * 100;

	// Total API providers (providers with at least one model with a price)
	const apiProviderCountRaw = new Set(
		data.flatMap((m: ExtendedModel) =>
			m.prices &&
			m.prices.some(
				(p: any) =>
					p.input_token_price != null || p.output_token_price != null
			)
				? [m.provider?.name || m.provider.provider_id]
				: []
		)
	);
	const apiProviderCount = Math.floor(apiProviderCountRaw.size / 10) * 10;

	// Unique benchmark IDs
	const uniqueBenchmarkIds = new Set(
		benchmarks.map((b: any) => b.benchmark_id)
	);
	const uniqueBenchmarkIdCountRaw = uniqueBenchmarkIds.size;
	const uniqueBenchmarkIdCount =
		Math.floor(uniqueBenchmarkIdCountRaw / 10) * 10;

	// Total prices count across all models
	const totalPricesCountRaw = data.reduce(
		(acc: number, m: ExtendedModel) => acc + (m.prices?.length || 0),
		0
	);
	const totalPricesCount = Math.floor(totalPricesCountRaw / 100) * 100;

	function formatStat(num: number) {
		if (num >= 1000) {
			return `${Math.floor(num / 1000)}k+`;
		}
		return `${num}+`;
	}

	const stats = [
		{ label: "Models", value: formatStat(modelCount) },
		{ label: "Providers", value: formatStat(providerCount) },
		{ label: "Benchmarks", value: formatStat(uniqueBenchmarkIdCount) },
		{ label: "Benchmark Results", value: formatStat(benchmarkResultCount) },
		{ label: "API Providers", value: formatStat(apiProviderCount) },
		{ label: "Prices", value: formatStat(totalPricesCount) },
	];

	return (
		<div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 items-stretch">
			{stats.map((stat) => {
				let href = "";
				switch (stat.label) {
					case "Models":
						href = "models";
						break;
					case "Providers":
						href = "providers";
						break;
					case "Benchmarks":
					case "Benchmark Results":
						href = "benchmarks";
						break;
					case "API Providers":
					case "Prices":
						href = "prices";
						break;
					default:
						href = "/";
				}
				return (
					<Link
						href={href}
						className="hover:scale-105 transition-transform duration-150"
						key={stat.label}
						style={{ textDecoration: "none" }}
					>
						<Card className="h-full p-4 flex flex-col items-center justify-center border border-gray-200 dark:border-gray-700 border-b-2 border-b-gray-300 dark:border-b-gray-600 cursor-pointer">
							<CardHeader className="text-center p-0">
								<CardTitle className="text-3xl font-bold">
									{stat.value}
								</CardTitle>
							</CardHeader>
							<CardContent className="flex flex-col items-center justify-center p-0">
								<span className="text-sm font-medium text-center text-gray-500">
									{stat.label}
								</span>
							</CardContent>
						</Card>
					</Link>
				);
			})}
		</div>
	);
}
