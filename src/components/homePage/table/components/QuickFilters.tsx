import React from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { FEATURED_QUICK_FILTERS, PROVIDER_QUICK_FILTERS } from "../constants";
import { Separator } from "@/components/ui/separator";
import {
	ImageIcon,
	LockOpen,
	ScrollText,
	Rabbit,
	ChevronDown,
} from "lucide-react";
import Image from "next/image";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

interface QuickFiltersProps {
	selectedFeatureFilters: string[];
	setSelectedFeatureFilters: (value: string[]) => void;
	selectedProviderFilters: string[];
	setSelectedProviderFilters: (value: string[]) => void;
	selectedLicenses: string[];
	setSelectedLicenses: (value: string[]) => void;
	setContextLengthRange: (value: string[]) => void;
	setParameterRange: (value: [number, number]) => void;
}

export function QuickFilters({
	selectedFeatureFilters,
	setSelectedFeatureFilters,
	selectedProviderFilters,
	setSelectedProviderFilters,
	selectedLicenses,
	setSelectedLicenses,
	setContextLengthRange,
	setParameterRange,
}: QuickFiltersProps) {
	const isMobile = useIsMobile();
	const [quickOpen, setQuickOpen] = React.useState(false);

	// Helper to handle quick filter logic
	const handleFeatureFilterChange = (next: string[]) => {
		setSelectedFeatureFilters(next);

		// Open Models: set license filter
		if (next.includes("open")) {
			if (!selectedLicenses.includes("open")) {
				setSelectedLicenses([...selectedLicenses, "open"]);
			}
		} else {
			if (selectedLicenses.includes("open")) {
				setSelectedLicenses(
					selectedLicenses.filter((l) => l !== "open")
				);
			}
		}

		// Long Context: set context length range to both 128K-500K and 500K+
		if (next.includes("long-context")) {
			setContextLengthRange(["128k-500k", "500k+"]);
		} else {
			setContextLengthRange(["all"]);
		}

		// Small Models: set parameter range to 0-8B
		if (next.includes("small")) {
			setParameterRange([0, 8]);
		} else {
			setParameterRange([0, 1000]); // Reset to default
		}
	};

	return (
		<div className="space-y-4">
			{isMobile ? (
				<div>
					<Sheet open={quickOpen} onOpenChange={setQuickOpen}>
						<SheetTrigger asChild>
							<Button
								className="w-full flex items-center justify-between"
								variant="outline"
							>
								Quick Filters
								<span className="ml-2">
									<ChevronDown />
								</span>
							</Button>
						</SheetTrigger>
						<SheetContent
							side="bottom"
							className="max-h-[90vh] overflow-y-auto p-4 space-y-6"
						>
							<div>
								<div className="mb-2 font-semibold text-sm text-gray-700 dark:text-gray-200">
									Feature Filters
								</div>
								<ToggleGroup
									type="multiple"
									value={selectedFeatureFilters}
									onValueChange={handleFeatureFilterChange}
									className="grid grid-cols-2 gap-2"
								>
									{FEATURED_QUICK_FILTERS.map((filter) => (
										<ToggleGroupItem
											key={filter.id}
											value={filter.id}
											variant="outline"
											className="rounded-full transition-all duration-200 data-[state=on]:bg-gray-200 data-[state=on]:text-primary hover:bg-gray-100 flex items-center gap-2"
										>
											{filter.id === "multimodal" ? (
												<ImageIcon
													className="h-4 w-4"
													aria-hidden="true"
												/>
											) : filter.id === "open" ? (
												<LockOpen
													className="h-4 w-4"
													aria-hidden="true"
												/>
											) : filter.id === "long-context" ? (
												<ScrollText
													className="h-4 w-4"
													aria-hidden="true"
												/>
											) : filter.id === "small" ? (
												<Rabbit
													className="h-4 w-4"
													aria-hidden="true"
												/>
											) : null}
											{filter.label}
										</ToggleGroupItem>
									))}
								</ToggleGroup>
							</div>
							<div>
								<div className="mb-2 font-semibold text-sm text-gray-700 dark:text-gray-200">
									Provider Filters
								</div>
								<ToggleGroup
									type="multiple"
									value={selectedProviderFilters}
									onValueChange={setSelectedProviderFilters}
									className="grid grid-cols-2 gap-2"
								>
									{PROVIDER_QUICK_FILTERS.map((filter) => (
										<ToggleGroupItem
											key={filter.id}
											value={filter.id}
											variant="outline"
											className="rounded-full transition-all duration-200 data-[state=on]:bg-gray-200 data-[state=on]:text-primary hover:bg-gray-100 flex items-center gap-2"
										>
											<Image
												src={`/providers/${filter.id}.svg`}
												alt={filter.label}
												width={16}
												height={16}
												className="rounded-sm"
											/>
											{filter.label}
										</ToggleGroupItem>
									))}
								</ToggleGroup>
							</div>
						</SheetContent>
					</Sheet>
				</div>
			) : (
				<div className="flex gap-4 flex-wrap md:flex-nowrap">
					<ToggleGroup
						type="multiple"
						value={selectedFeatureFilters}
						onValueChange={handleFeatureFilterChange}
						className="flex flex-wrap md:flex-nowrap gap-2"
					>
						{FEATURED_QUICK_FILTERS.map((filter) => (
							<ToggleGroupItem
								key={filter.id}
								value={filter.id}
								variant="outline"
								className="rounded-full transition-all duration-200 data-[state=on]:bg-gray-200 data-[state=on]:text-primary hover:bg-gray-100 flex items-center gap-2"
							>
								{filter.id === "multimodal" ? (
									<ImageIcon
										className="h-4 w-4"
										aria-hidden="true"
									/>
								) : filter.id === "open" ? (
									<LockOpen
										className="h-4 w-4"
										aria-hidden="true"
									/>
								) : filter.id === "long-context" ? (
									<ScrollText
										className="h-4 w-4"
										aria-hidden="true"
									/>
								) : filter.id === "small" ? (
									<Rabbit
										className="h-4 w-4"
										aria-hidden="true"
									/>
								) : null}
								{filter.label}
							</ToggleGroupItem>
						))}
					</ToggleGroup>

					<Separator
						orientation="vertical"
						className="h-10 hidden md:block"
					/>

					<ToggleGroup
						type="multiple"
						value={selectedProviderFilters}
						onValueChange={setSelectedProviderFilters}
						className="flex flex-wrap md:flex-nowrap gap-2"
					>
						{PROVIDER_QUICK_FILTERS.map((filter) => (
							<ToggleGroupItem
								key={filter.id}
								value={filter.id}
								variant="outline"
								className="rounded-full transition-all duration-200 data-[state=on]:bg-gray-200 data-[state=on]:text-primary hover:bg-gray-100 flex items-center gap-2"
							>
								<Image
									src={`/providers/${filter.id}.svg`}
									alt={filter.label}
									width={16}
									height={16}
									className="rounded-sm"
								/>
								{filter.label}
							</ToggleGroupItem>
						))}
					</ToggleGroup>
				</div>
			)}
		</div>
	);
}
