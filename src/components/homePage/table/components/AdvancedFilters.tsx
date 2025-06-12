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
	providers: string[];
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
		Object.values(table.getState().columnVisibility || {}).some(
			(v) => v === false
		);

	const handleReset = () => {
		// Reset all filters and column visibility
		setSelectedProviders(DEFAULT_SELECTED_PROVIDERS);
		setParameterRange(DEFAULT_PARAMETER_RANGE as [number, number]);
		setContextLengthRange(DEFAULT_CONTEXT_LENGTH_RANGE);
		setSelectedLicenses(DEFAULT_SELECTED_LICENSES);
		table.resetColumnVisibility();
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
						<div className="flex flex-col gap-4">
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
