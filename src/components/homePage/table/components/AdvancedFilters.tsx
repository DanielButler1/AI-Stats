"use client";

import * as React from "react";
import type { Table as TableInstance } from "@tanstack/react-table";
import type { ExtendedModel } from "@/data/types";
import { ProviderFilter } from "./filters/ProviderFilter";
import { ParameterRangeFilter } from "./filters/ParameterRangeFilter";
import { ContextLengthFilter } from "./filters/ContextLengthFilter";
import { LicenseFilter } from "./filters/LicenseFilter";
import { ColumnVisibilityFilter } from "./filters/ColumnVisibilityFilter";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { ChevronDown } from "lucide-react";

interface AdvancedFiltersProps {
	providers: { id: string; name: string }[];
	licenses: string[];
	selectedProviders: string[];
	setSelectedProviders: (value: string[]) => void;
	parameterRange: [number, number];
	setParameterRange: (value: [number, number]) => void;
	contextLengthRange: string[];
	setContextLengthRange: (value: string[]) => void;
	selectedLicenses: string[];
	setSelectedLicenses: (value: string[]) => void;
	table: TableInstance<ExtendedModel>;
	featureFilters: string[];
}

export function AdvancedFilters({
	providers,
	licenses,
	selectedProviders,
	setSelectedProviders,
	parameterRange,
	setParameterRange,
	contextLengthRange,
	setContextLengthRange,
	selectedLicenses,
	setSelectedLicenses,
	table,
	featureFilters,
}: AdvancedFiltersProps) {
	// Default values for comparison
	const DEFAULT_PARAMETER_RANGE = [0, 1000];
	const DEFAULT_CONTEXT_LENGTH_RANGE = ["all"];
	const DEFAULT_SELECTED_PROVIDERS: string[] = [];
	const DEFAULT_SELECTED_LICENSES: string[] = [];

	// Check if any filters or column visibility are not default
	const isFiltered =
		JSON.stringify(parameterRange) !==
			JSON.stringify(DEFAULT_PARAMETER_RANGE) ||
		JSON.stringify(contextLengthRange) !==
			JSON.stringify(DEFAULT_CONTEXT_LENGTH_RANGE) ||
		selectedProviders.length > 0 ||
		selectedLicenses.length > 0 ||
		(featureFilters && featureFilters.includes("multimodal")) ||
		// If any column other than parameter_count is hidden, or if parameter_count is visible (since it's hidden by default)
		Object.entries(table.getState().columnVisibility || {}).some(
			([key, value]) =>
				(key === "parameter_count" && value === true) ||
				(key !== "parameter_count" && value === false)
		);

	const handleReset = () => {
		// Reset all filters and column visibility
		setSelectedProviders(DEFAULT_SELECTED_PROVIDERS);
		setParameterRange(DEFAULT_PARAMETER_RANGE as [number, number]);
		setContextLengthRange(DEFAULT_CONTEXT_LENGTH_RANGE);
		setSelectedLicenses(DEFAULT_SELECTED_LICENSES);
		// Reset column visibility to default: hide 'parameter_count', show others
		const defaultVisibility: Record<string, boolean> = table
			.getAllLeafColumns()
			.reduce((acc, column) => {
				acc[column.id] = column.id !== "parameter_count";
				return acc;
			}, {} as Record<string, boolean>);
		table.setColumnVisibility(defaultVisibility);
	};

	const isMobile = useIsMobile();
	const [open, setOpen] = React.useState(false);

	if (isMobile) {
		return (
			<div className="w-full">
				<Sheet open={open} onOpenChange={setOpen}>
					<SheetTrigger asChild>
						<Button
							variant="outline"
							className="w-full flex items-center justify-between"
						>
							Advanced Filters
							<span className="ml-2">
								<ChevronDown />
							</span>
						</Button>
					</SheetTrigger>
					<SheetContent
						side="bottom"
						className="max-h-[90vh] overflow-y-auto p-4 space-y-6"
					>
						<div className="grid grid-cols-2 gap-4">
							<div>
								<ProviderFilter
									providers={providers}
									selectedProviders={selectedProviders}
									setSelectedProviders={setSelectedProviders}
								/>
							</div>
							<div>
								<ParameterRangeFilter
									parameterRange={parameterRange}
									setParameterRange={setParameterRange}
								/>
							</div>
							<div>
								<ContextLengthFilter
									contextLengthRange={contextLengthRange}
									setContextLengthRange={
										setContextLengthRange
									}
								/>
							</div>
							<div>
								<LicenseFilter
									licenses={licenses}
									selectedLicenses={selectedLicenses}
									setSelectedLicenses={setSelectedLicenses}
								/>
							</div>
							<div className="col-span-2">
								<ColumnVisibilityFilter table={table} />
							</div>
						</div>
					</SheetContent>
				</Sheet>
				{isFiltered && (
					<div className="pt-4">
						<Button
							variant="outline"
							size="lg"
							className="w-full"
							onClick={() => {
								handleReset();
								setOpen(false);
							}}
						>
							Reset Filters
						</Button>
					</div>
				)}
			</div>
		);
	}

	return (
		<div className="flex flex-col sm:flex-row items-center gap-1 w-full">
			<div className="flex flex-wrap gap-2 flex-1">
				<ProviderFilter
					providers={providers}
					selectedProviders={selectedProviders}
					setSelectedProviders={setSelectedProviders}
				/>
				<ParameterRangeFilter
					parameterRange={parameterRange}
					setParameterRange={setParameterRange}
				/>
				<ContextLengthFilter
					contextLengthRange={contextLengthRange}
					setContextLengthRange={setContextLengthRange}
				/>
				<LicenseFilter
					licenses={licenses}
					selectedLicenses={selectedLicenses}
					setSelectedLicenses={setSelectedLicenses}
				/>
				<ColumnVisibilityFilter table={table} />
			</div>
			{isFiltered && (
				<Button
					variant="outline"
					size="sm"
					className="ml-auto"
					onClick={handleReset}
				>
					Reset Filters
				</Button>
			)}
		</div>
	);
}
