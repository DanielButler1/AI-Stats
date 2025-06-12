"use client";

import { Settings, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	DropdownMenuCheckboxItem,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";

interface ChartControlsProps {
	isToScale: boolean;
	setIsToScale: (isToScale: boolean) => void;
	scoringType: "gpqa" | "glicko";
	setScoringType: (scoringType: "gpqa" | "glicko") => void;
	selectedProviders: string[];
	setSelectedProviders: (providers: string[]) => void;
	selectedModels: string[];
	setSelectedModels: (models: string[]) => void;
	uniqueProviders: string[];
	uniqueModels: string[];
	allChartData: any[];
	getModelsForProvider: (providerId: string) => string[];
}

export const ChartControls = ({
	isToScale,
	setIsToScale,
	scoringType,
	setScoringType,
	selectedProviders,
	setSelectedProviders,
	selectedModels,
	setSelectedModels,
	uniqueProviders,
	uniqueModels,
	allChartData,
	getModelsForProvider,
}: ChartControlsProps) => {
	// Helper function to handle provider selection changes
	const handleProviderChange = (providerId: string, checked: boolean) => {
		const providerModels = getModelsForProvider(providerId);

		if (checked) {
			// Add provider
			if (selectedProviders.length === 0) {
				setSelectedProviders([providerId]);
			} else {
				setSelectedProviders([
					...selectedProviders.filter((p) => p !== providerId),
					providerId,
				]);
			}

			// Add all models from this provider to selected models
			if (selectedModels.length === 0) {
				setSelectedModels(providerModels);
			} else {
				const newModels = providerModels.filter(
					(model) => !selectedModels.includes(model)
				);
				setSelectedModels([...selectedModels, ...newModels]);
			}
		} else {
			// Remove provider
			if (selectedProviders.length === 0) {
				setSelectedProviders(
					uniqueProviders.filter((p) => p !== providerId)
				);
			} else {
				setSelectedProviders(
					selectedProviders.filter((p) => p !== providerId)
				);
			}

			// Remove all models from this provider
			if (selectedModels.length === 0) {
				setSelectedModels(
					uniqueModels.filter(
						(model) => !providerModels.includes(model)
					)
				);
			} else {
				setSelectedModels(
					selectedModels.filter(
						(model) => !providerModels.includes(model)
					)
				);
			}
		}
	};

	// Helper function to handle model selection changes
	const handleModelChange = (modelName: string, checked: boolean) => {
		const modelProvider = allChartData.find((d) => d.name === modelName)
			?.provider.provider_id;

		if (checked) {
			// Add model
			if (selectedModels.length === 0) {
				setSelectedModels([modelName]);
			} else {
				setSelectedModels([
					...selectedModels.filter((m) => m !== modelName),
					modelName,
				]);
			}

			// Add provider if not already selected
			if (
				modelProvider &&
				selectedProviders.length > 0 &&
				!selectedProviders.includes(modelProvider)
			) {
				setSelectedProviders([...selectedProviders, modelProvider]);
			}
		} else {
			// Remove model
			if (selectedModels.length === 0) {
				setSelectedModels(uniqueModels.filter((m) => m !== modelName));
			} else {
				setSelectedModels(
					selectedModels.filter((m) => m !== modelName)
				);
			}

			// Check if this was the last model from its provider
			if (modelProvider) {
				const providerModels = getModelsForProvider(modelProvider);
				const remainingModels =
					selectedModels.length === 0
						? uniqueModels.filter((m) => m !== modelName)
						: selectedModels.filter((m) => m !== modelName);

				const hasOtherModelsFromProvider = providerModels.some(
					(model) =>
						model !== modelName && remainingModels.includes(model)
				);

				// If no other models from this provider are selected, remove the provider
				if (
					!hasOtherModelsFromProvider &&
					selectedProviders.includes(modelProvider)
				) {
					setSelectedProviders(
						selectedProviders.filter((p) => p !== modelProvider)
					);
				}
			}
		}
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="outline"
					size="sm"
					className="absolute top-4 right-4"
				>
					<Settings className="h-4 w-4 mr-2" />
					Options
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-80">
				<DropdownMenuLabel>Chart Options</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					onClick={() =>
						setScoringType(
							scoringType === "gpqa" ? "glicko" : "gpqa"
						)
					}
					className="cursor-pointer"
				>
					<Check
						className={`h-4 w-4 mr-2 ${
							scoringType === "glicko"
								? "opacity-100"
								: "opacity-0"
						}`}
					/>
					Show Glicko Scores
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => setIsToScale(!isToScale)}
					className="cursor-pointer"
				>
					<Check
						className={`h-4 w-4 mr-2 ${
							isToScale ? "opacity-100" : "opacity-0"
						}`}
					/>
					Show To Scale
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuSub>
					<DropdownMenuSubTrigger>
						<span>Filter by Provider</span>
						{selectedProviders.length > 0 && (
							<span className="ml-auto text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
								{selectedProviders.length}
							</span>
						)}
					</DropdownMenuSubTrigger>
					<DropdownMenuSubContent className="w-80 max-h-80 overflow-y-auto">
						<div className="flex gap-2 p-2 border-b">
							<Button
								variant="outline"
								size="sm"
								className="flex-1"
								onClick={() => {
									setSelectedProviders(uniqueProviders);
									// Also select all models when selecting all providers
									setSelectedModels(uniqueModels);
								}}
							>
								Select All
							</Button>
							<Button
								variant="outline"
								size="sm"
								className="flex-1"
								onClick={() => {
									// Select only OpenAI and its models
									const openaiModels =
										getModelsForProvider("openai");
									setSelectedProviders(["openai"]);
									setSelectedModels(openaiModels);
								}}
							>
								Deselect All
							</Button>
						</div>
						{uniqueProviders.map((providerId) => {
							const providerName =
								allChartData.find(
									(d) => d.provider.provider_id === providerId
								)?.provider.name || providerId;
							return (
								<DropdownMenuCheckboxItem
									key={providerId}
									checked={
										selectedProviders.length === 0 ||
										selectedProviders.includes(providerId)
									}
									onCheckedChange={(checked) =>
										handleProviderChange(
											providerId,
											checked
										)
									}
									onSelect={(e) => e.preventDefault()}
								>
									<div className="flex items-center gap-2">
										<div className="w-4 h-4 relative">
											<Image
												src={`/providers/${providerId.toLowerCase()}.svg`}
												alt={providerName}
												className="object-contain"
												fill
											/>
										</div>
										{providerName}
									</div>
								</DropdownMenuCheckboxItem>
							);
						})}
					</DropdownMenuSubContent>
				</DropdownMenuSub>
				<DropdownMenuSub>
					<DropdownMenuSubTrigger>
						<span>Filter by Model</span>
						{selectedModels.length > 0 && (
							<span className="ml-auto text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
								{selectedModels.length}
							</span>
						)}
					</DropdownMenuSubTrigger>
					<DropdownMenuSubContent className="w-80 max-h-80 overflow-y-auto">
						<div className="flex gap-2 p-2 border-b">
							<Button
								variant="outline"
								size="sm"
								className="flex-1"
								onClick={() => {
									setSelectedModels(uniqueModels);
									// Also select all providers when selecting all models
									setSelectedProviders(uniqueProviders);
								}}
							>
								Select All
							</Button>
							<Button
								variant="outline"
								size="sm"
								className="flex-1"
								onClick={() => {
									// Select only OpenAI and its models
									const openaiModels =
										getModelsForProvider("openai");
									setSelectedProviders(["openai"]);
									setSelectedModels(openaiModels);
								}}
							>
								Deselect All
							</Button>
						</div>
						{uniqueModels.map((modelName) => {
							const modelData = allChartData.find(
								(d) => d.name === modelName
							);
							const providerId =
								modelData?.provider.provider_id || "";
							return (
								<DropdownMenuCheckboxItem
									key={modelName}
									checked={
										selectedModels.length === 0 ||
										selectedModels.includes(modelName)
									}
									onCheckedChange={(checked) =>
										handleModelChange(modelName, checked)
									}
									onSelect={(e) => e.preventDefault()}
								>
									<div className="flex items-center gap-2">
										<div className="w-4 h-4 relative">
											<Image
												src={`/providers/${providerId.toLowerCase()}.svg`}
												alt={
													modelData?.provider.name ||
													""
												}
												className="object-contain"
												fill
											/>
										</div>
										<span className="truncate">
											{modelName}
										</span>
									</div>
								</DropdownMenuCheckboxItem>
							);
						})}
					</DropdownMenuSubContent>
				</DropdownMenuSub>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
