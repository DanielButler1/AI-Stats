"use client";

import * as React from "react";
import {
	ColumnFiltersState,
	SortingState,
	VisibilityState,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { Separator } from "@/components/ui/separator";
import type { ExtendedModel } from "@/data/types";
import { columns } from "./columns";
import { QuickFilters } from "./components/QuickFilters";
import { AdvancedFilters } from "./components/AdvancedFilters";
import { ModelDataTable } from "./components/ModelDataTable";
import { CONTEXT_LENGTH_RANGES, PROVIDER_QUICK_FILTERS } from "./constants";

interface ModelTableProps {
	models: ExtendedModel[];
}

export function ModelTable({ models }: ModelTableProps) {
	const [sorting, setSorting] = React.useState<SortingState>([
		{
			id: "gpqa_score",
			desc: true,
		},
	]);

	const defaultColumnVisibility: VisibilityState = {
		parameter_count: false,
	};

	const [columnFilters, setColumnFilters] =
		React.useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>(defaultColumnVisibility);

	// Unified Filter State
	const [filterState, setFilterState] = React.useState({
		featureFilters: [] as string[],
		providerFilters: [] as string[],
		selectedProviders: [] as string[],
		parameterRange: [0, 1000] as [number, number],
		contextLengthRange: ["all"] as string[],
		selectedLicenses: [] as string[],
	});

	// Get unique provider objects for filters
	const providers = React.useMemo(() => {
		const map: Record<string, { id: string; name: string }> = {};
		models.forEach((m) => {
			map[m.provider.provider_id] = {
				id: m.provider.provider_id,
				name: m.provider.name,
			};
		});
		return Object.values(map).sort((a, b) => a.name.localeCompare(b.name));
	}, [models]);

	const licenses = React.useMemo(
		() =>
			Array.from(
				new Set(
					models
						.map((m) => m.license)
						.filter(
							(license): license is string => license !== null
						)
				)
			).sort(),
		[models]
	);

	// Handle filter updates
	const handleFilterUpdate = React.useCallback(
		(updates: Partial<typeof filterState>) => {
			setFilterState((current) => {
				const newState = { ...current, ...updates };

				// Always sync selectedProviders with providerFilters
				if (updates.providerFilters !== undefined) {
					const matchingIds = providers
						.filter((provider) =>
							updates.providerFilters!.some((filter) =>
								provider.name
									.toLowerCase()
									.includes(filter.toLowerCase())
							)
						)
						.map((p) => p.id);
					newState.selectedProviders = matchingIds;
				}

				// Always sync providerFilters with selectedProviders
				if (updates.selectedProviders !== undefined) {
					const quickFiltersToSelect = PROVIDER_QUICK_FILTERS.filter(
						(qf) =>
							updates.selectedProviders!.some((provider) =>
								provider
									.toLowerCase()
									.includes(qf.id.toLowerCase())
							)
					).map((qf) => qf.id);
					newState.providerFilters = quickFiltersToSelect;
				}

				// Sync license filters with open feature filter
				if (updates.featureFilters !== undefined) {
					if (
						updates.featureFilters.includes("open") &&
						!current.selectedLicenses.includes("open")
					) {
						newState.selectedLicenses = [
							...current.selectedLicenses,
							"open",
						];
					} else if (
						!updates.featureFilters.includes("open") &&
						current.selectedLicenses.includes("open")
					) {
						newState.selectedLicenses =
							current.selectedLicenses.filter(
								(l) => l !== "open"
							);
					}
				}

				if (updates.selectedLicenses !== undefined) {
					if (
						updates.selectedLicenses.includes("open") &&
						!current.featureFilters.includes("open")
					) {
						newState.featureFilters = [
							...current.featureFilters,
							"open",
						];
					} else if (
						!updates.selectedLicenses.includes("open") &&
						current.featureFilters.includes("open")
					) {
						newState.featureFilters = current.featureFilters.filter(
							(f) => f !== "open"
						);
					}
				}

				return newState;
			});
		},
		[providers]
	);

	// Filter the models
	const filteredModels = React.useMemo(() => {
		return models.filter((model) => {
			// Quick Filters
			if (filterState.featureFilters.length > 0) {
				if (
					filterState.featureFilters.includes("multimodal") &&
					!model.multimodal
				)
					return false;
				if (
					filterState.featureFilters.includes("open") &&
					model.license !== "open"
				)
					return false;
				if (
					filterState.featureFilters.includes("long-context") &&
					(!model.input_context_length ||
						model.input_context_length < 32768)
				)
					return false;
				if (filterState.featureFilters.includes("small")) {
					// Exclude models without parameter_count for small filter
					if (!model.parameter_count) return false;
					if (model.parameter_count >= 8000000000) return false;
				}
			}

			// Provider Filters
			if (filterState.selectedProviders.length > 0) {
				if (
					!filterState.selectedProviders.includes(model.provider.name)
				)
					return false;
			}

			// License Filters
			if (filterState.selectedLicenses.length > 0) {
				if (
					!model.license ||
					!filterState.selectedLicenses.includes(model.license)
				)
					return false;
			}

			// Parameter Range Filter
			if (
				filterState.parameterRange &&
				(filterState.parameterRange[0] > 0 ||
					filterState.parameterRange[1] < 1000)
			) {
				// Exclude models without parameter_count when parameter range is filtered
				if (!model.parameter_count) return false;
				const paramCountB = model.parameter_count / 1e9;
				if (
					paramCountB < filterState.parameterRange[0] ||
					paramCountB > filterState.parameterRange[1]
				)
					return false;
			}

			// Context Length Filter
			if (
				filterState.contextLengthRange &&
				!filterState.contextLengthRange.includes("all")
			) {
				// If there's no context length, filter it out when specific ranges are selected
				if (!model.input_context_length) return false;

				const matches = filterState.contextLengthRange.some(
					(rangeId) => {
						const range = CONTEXT_LENGTH_RANGES.find(
							(r) => r.id === rangeId
						);
						if (!range) return false;
						return (
							model.input_context_length! >= range.min &&
							model.input_context_length! < range.max
						);
					}
				);
				if (!matches) return false;
			}

			return true;
		});
	}, [models, filterState]);

	const table = useReactTable({
		data: filteredModels,
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
		},
		initialState: {
			pagination: {
				pageSize: 25,
			},
		},
	});

	return (
		<div className="w-full overflow-x-hidden">
			<div className="space-y-6 mb-6">
				<QuickFilters
					selectedFeatureFilters={filterState.featureFilters}
					setSelectedFeatureFilters={(value) =>
						handleFilterUpdate({ featureFilters: value })
					}
					selectedProviderFilters={filterState.providerFilters}
					setSelectedProviderFilters={(value) =>
						handleFilterUpdate({ providerFilters: value })
					}
					selectedLicenses={filterState.selectedLicenses}
					setSelectedLicenses={(value) =>
						handleFilterUpdate({ selectedLicenses: value })
					}
					setContextLengthRange={(value) =>
						handleFilterUpdate({ contextLengthRange: value })
					}
					setParameterRange={(value) =>
						handleFilterUpdate({ parameterRange: value })
					}
				/>
				<Separator />
				<AdvancedFilters
					table={table}
					providers={providers}
					licenses={licenses}
					selectedProviders={filterState.selectedProviders}
					setSelectedProviders={(value) =>
						handleFilterUpdate({ selectedProviders: value })
					}
					parameterRange={filterState.parameterRange}
					setParameterRange={(value) =>
						handleFilterUpdate({ parameterRange: value })
					}
					contextLengthRange={filterState.contextLengthRange}
					setContextLengthRange={(value) =>
						handleFilterUpdate({ contextLengthRange: value })
					}
					selectedLicenses={filterState.selectedLicenses}
					setSelectedLicenses={(value) =>
						handleFilterUpdate({ selectedLicenses: value })
					}
					featureFilters={filterState.featureFilters}
				/>
			</div>

			<ModelDataTable table={table} columns={columns} />
		</div>
	);
}
