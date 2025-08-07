import React, { useState, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
	Popover,
	PopoverTrigger,
	PopoverContent,
} from "@/components/ui/popover";
import { Search } from "lucide-react";
import { ExtendedModel, Provider, Benchmark, APIProvider } from "@/data/types";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export default function SearchPopover({
	aggregateData,
}: {
	aggregateData: ExtendedModel[];
}) {
	const router = useRouter();
	const [popoverOpen, setPopoverOpen] = useState(false);
	const [query, setQuery] = useState("");

	type SearchableItem =
		| (ExtendedModel & { type: "model" })
		| (Provider & { type: "provider" })
		| (Benchmark & { type: "benchmark" })
		| (APIProvider & { type: "api" });

	type Lookup = {
		models: (ExtendedModel & { type: "model" })[];
		providers: (Provider & { type: "provider" })[];
		benchmarks: (Benchmark & { type: "benchmark" })[];
		apis: (APIProvider & { type: "api" })[];
	};

	const [lookup, setLookup] = useState<Lookup>({
		models: [],
		providers: [],
		benchmarks: [],
		apis: [],
	});
	const [latestModels, setLatestModels] = useState<
		(ExtendedModel & { type: "model" })[]
	>([]);

	React.useEffect(() => {
		// Unique sets
		const modelMap = new Map<string, ExtendedModel & { type: "model" }>();
		const providerMap = new Map<string, Provider & { type: "provider" }>();
		const benchmarkMap = new Map<
			string,
			Benchmark & { type: "benchmark" }
		>();
		const apiProviderMap = new Map<string, APIProvider & { type: "api" }>();

		aggregateData.forEach((model) => {
			// Add model
			modelMap.set(model.id, { ...model, type: "model" });

			// Add provider
			if (
				model.provider &&
				typeof model.provider === "object" &&
				model.provider.provider_id
			) {
				const p = model.provider;
				providerMap.set(p.provider_id, { ...p, type: "provider" });
			}

			// Add benchmarks
			if (Array.isArray(model.benchmark_results)) {
				model.benchmark_results.forEach((br) => {
					if (br.benchmark && br.benchmark.id) {
						const b = br.benchmark;
						benchmarkMap.set(b.id, { ...b, type: "benchmark" });
					}
				});
			}

			// Add API providers from prices
			if (Array.isArray(model.prices)) {
				model.prices.forEach((price) => {
					if (
						price.api_provider &&
						typeof price.api_provider === "object" &&
						price.api_provider.api_provider_id
					) {
						const api = price.api_provider;
						apiProviderMap.set(api.api_provider_id, {
							...api,
							type: "api",
						});
					}
				});
			}
		});

		const models = Array.from(modelMap.values());
		const providers = Array.from(providerMap.values());
		const benchmarks = Array.from(benchmarkMap.values());
		const apis = Array.from(apiProviderMap.values());

		setLookup({ models, providers, benchmarks, apis });

		// Sort models by release_date desc, fallback to name
		const sortedModels = [...models]
			.sort((a, b) => {
				const dateA = a.release_date
					? new Date(a.release_date).getTime()
					: 0;
				const dateB = b.release_date
					? new Date(b.release_date).getTime()
					: 0;
				if (dateB !== dateA) return dateB - dateA;
				return a.name.localeCompare(b.name);
			})
			.slice(0, 20);
		setLatestModels(sortedModels);
	}, [aggregateData]);

	// Quick provider lookup for provider name and logo
	const providerById = useMemo(() => {
		const map = new Map<string, Provider & { type: "provider" }>();
		lookup.providers.forEach((p) => map.set(p.provider_id, p));
		return map;
	}, [lookup.providers]);

	function getMatches(q: string): SearchableItem[] {
		if (!q) return [];
		const lower = q.toLowerCase();
		const all: SearchableItem[] = [
			...lookup.models,
			...lookup.providers,
			...lookup.benchmarks,
			...lookup.apis,
		];
		// Filter items by matching name or id property
		return all
			.filter((item) => {
				let name = "";
				let id = "";
				if (item.type === "model") {
					name = item.name;
					id = item.id;
				} else if (item.type === "provider") {
					name = item.name;
					id = item.provider_id;
				} else if (item.type === "benchmark") {
					name = item.name;
					id = item.id;
				} else if (item.type === "api") {
					name = item.api_provider_name;
					id = item.api_provider_id;
				}
				return (
					name.toLowerCase().includes(lower) ||
					(id && id.toLowerCase().includes(lower))
				);
			})
			.slice(0, 20);
	}

	const results: SearchableItem[] = query ? getMatches(query) : latestModels;
	const showTypeTag = !!query;

	function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
		const value = e.target.value;
		setQuery(value);
		// Keep popover open while typing
		if (!popoverOpen) {
			setPopoverOpen(true);
		}
	}

	// Small UI helpers
	const formatDate = (iso?: string | null) =>
		iso
			? new Date(iso).toLocaleDateString(undefined, {
					month: "short",
					day: "numeric",
					year: "numeric",
			  })
			: "";

	const ProviderAvatar = ({
		providerId,
		name,
	}: {
		providerId?: string;
		name: string;
	}) => {
		const id = providerId ?? "";
		const src = id ? `/providers/${id}.svg` : "";
		if (id) {
			return (
				<Image
					src={src}
					alt={name}
					width={24}
					height={24}
					className="w-6 h-6 rounded"
				/>
			);
		}
		// Fallback initials
		const initials = name.slice(0, 2).toUpperCase();
		return (
			<div className="w-6 h-6 rounded bg-muted text-xs flex items-center justify-center font-medium">
				{initials}
			</div>
		);
	};

	return (
		<div className="relative flex items-center">
			<div className="relative w-72">
				<Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
					<PopoverTrigger asChild>
						{/* Make wrapper relative so the icon can be absolutely positioned */}
						<div className="relative min-w-0 w-full">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							<Input
								value={query}
								onChange={handleInputChange}
								placeholder="Search the database..."
								className="w-full h-9 pl-9 pr-3 rounded-full border bg-background placeholder:text-muted-foreground/70"
							/>
						</div>
					</PopoverTrigger>
					<PopoverContent
						className="w-[28rem] p-3 mt-2 z-50"
						align="end"
						onOpenAutoFocus={(e) => e.preventDefault()}
					>
						<ScrollArea className="h-[30vh] pr-2">
							<div>
								{query && results.length === 0 && (
									<div className="text-muted-foreground text-sm">
										No results found.
									</div>
								)}
								{results.map((item, idx) => {
									if (item.type === "model") {
										// provider can be a string id or a Provider object depending on upstream data
										const providerIdFromModel =
											typeof (item as any).provider ===
											"string"
												? (item as any).provider
												: (item as any).provider
														?.provider_id;
										const providerRecord =
											providerIdFromModel
												? providerById.get(
														providerIdFromModel
												  )
												: undefined;
										const providerName =
											providerRecord?.name ??
											(typeof (item as any).provider ===
											"object"
												? (item as any).provider?.name
												: providerIdFromModel ?? "");
										const providerId =
											providerRecord?.provider_id ??
											providerIdFromModel;
										const sub = [providerName]
											.filter(Boolean)
											.join(" ");
										return (
											<div
												key={`model-${item.id}-${idx}`}
												className="py-2 px-2 rounded transition-all duration-200 ease-out cursor-pointer flex items-center gap-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
												onClick={() => {
													setPopoverOpen(false);
													router.push(
														`/models/${item.id}`
													);
												}}
											>
												<ProviderAvatar
													providerId={providerId}
													name={
														providerName ||
														item.name
													}
												/>
												<div className="min-w-0 flex-1">
													<div className="flex items-center justify-between gap-2">
														<div className="truncate font-medium">
															{item.name}
														</div>
														<div className="flex items-center gap-2 shrink-0">
															{showTypeTag ? (
																<span className="inline-block rounded bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground border border-border">
																	Model
																</span>
															) : (
																item.release_date && (
																	<span className="text-xs text-muted-foreground">
																		{formatDate(
																			item.release_date
																		)}
																	</span>
																)
															)}
														</div>
													</div>
													<div className="text-xs text-muted-foreground truncate">
														{sub}
													</div>
												</div>
											</div>
										);
									}
									if (item.type === "provider") {
										return (
											<div
												key={`provider-${item.provider_id}-${idx}`}
												className="py-2 px-2 rounded border border-transparent transition-all duration-200 ease-out cursor-pointer flex items-center gap-3 hover:bg-accent/40 hover:border-border/60 hover:shadow-md hover:-translate-y-[1px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
												onClick={() => {
													setPopoverOpen(false);
													router.push(
														`/providers/${item.provider_id}`
													);
												}}
											>
												<ProviderAvatar
													providerId={
														item.provider_id
													}
													name={item.name}
												/>
												<div className="min-w-0 flex-1">
													<div className="flex items-center justify-between gap-2">
														<div className="font-medium truncate">
															{item.name}
														</div>
														{showTypeTag && (
															<span className="inline-block rounded bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground border border-border">
																Provider
															</span>
														)}
													</div>
													{item.website && (
														<div className="text-xs text-muted-foreground truncate">
															{item.website}
														</div>
													)}
												</div>
											</div>
										);
									}
									if (item.type === "benchmark") {
										return (
											<div
												key={`benchmark-${item.id}-${idx}`}
												className="py-2 px-2 rounded border border-transparent transition-all duration-200 ease-out cursor-pointer hover:bg-accent/40 hover:border-border/60 hover:shadow-md hover:-translate-y-[1px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
												onClick={() => {
													setPopoverOpen(false);
													router.push(
														`/benchmarks/${item.id}`
													);
												}}
											>
												<div className="flex items-center justify-between gap-2">
													<div className="font-medium truncate">
														{item.name}
													</div>
													{showTypeTag && (
														<span className="inline-block rounded bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground border border-border">
															Benchmark
														</span>
													)}
												</div>
												{item.category && (
													<div className="text-xs text-muted-foreground truncate">
														{item.category}
													</div>
												)}
											</div>
										);
									}
									// API Provider
									return (
										<div
											key={`api-${item.api_provider_id}-${idx}`}
											className="py-2 px-2 rounded border border-transparent transition-all duration-200 ease-out cursor-pointer hover:bg-accent/40 hover:border-border/60 hover:shadow-md hover:-translate-y-[1px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
											onClick={() => {
												setPopoverOpen(false);
												router.push(
													`/prices/${item.api_provider_id}`
												);
											}}
										>
											<div className="flex items-center justify-between gap-2">
												<div className="font-medium truncate">
													{item.api_provider_name}
												</div>
												{showTypeTag && (
													<span className="inline-block rounded bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground border border-border">
														API Provider
													</span>
												)}
											</div>
											{item.link && (
												<div className="text-xs text-muted-foreground truncate">
													{item.link}
												</div>
											)}
										</div>
									);
								})}
							</div>
							<ScrollBar />
						</ScrollArea>
					</PopoverContent>
				</Popover>
			</div>
		</div>
	);
}
