// ModelCombobox.tsx
"use client";

import * as React from "react";
import { Check, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import type { ExtendedModel } from "@/data/types";

// Fuzzy search scoring function
function getSearchScore(text: string, search: string): number {
	const normalizedText = text.toLowerCase();
	const normalizedSearch = search.toLowerCase();

	// Exact matches get highest score
	if (normalizedText === normalizedSearch) return 100;
	if (normalizedText.startsWith(normalizedSearch)) return 80;

	// Check if all search characters appear in order
	let lastIndex = -1;
	let allCharsFound = true;
	let consecChars = 0;
	let maxConsecChars = 0;

	for (const char of normalizedSearch) {
		const index = normalizedText.indexOf(char, lastIndex + 1);
		if (index === -1) {
			allCharsFound = false;
			break;
		}
		if (index === lastIndex + 1) {
			consecChars++;
			maxConsecChars = Math.max(maxConsecChars, consecChars);
		} else {
			consecChars = 1;
		}
		lastIndex = index;
	}

	if (!allCharsFound) return 0;

	// Score based on consecutive matching characters and position
	return 40 + maxConsecChars * 10;
}

interface ModelComboboxProps {
	models: ExtendedModel[];
	selected: string[];
	setSelected: (ids: string[]) => void;
	triggerButton?: React.ReactNode;
}

export default function ModelCombobox({
	models,
	selected,
	setSelected,
}: ModelComboboxProps) {
	const [open, setOpen] = React.useState(false);
	const isMaxSelected = selected.length >= 4;

	// Check if a model is available (has release or announced date)
	const isModelAvailable = React.useCallback((model: ExtendedModel) => {
		return model.release_date || model.announced_date;
	}, []);

	const [filteredModels, setFilteredModels] = React.useState(models);
	const [searchValue, setSearchValue] = React.useState("");

	// Handle open state change, prevent opening if max selected
	const handleOpenChange = (newOpen: boolean) => {
		if (isMaxSelected && newOpen) return;
		setOpen(newOpen);
	};

	// Filter and sort models based on search value
	const filterModels = React.useCallback(
		(value: string) => {
			setSearchValue(value);
			if (!value) {
				setFilteredModels(models);
				// Reset scroll position when input is cleared
				requestAnimationFrame(() => {
					const listContainer =
						document.querySelector(
							"[cmdk-list-sizer]"
						)?.parentElement;
					if (listContainer) {
						listContainer.scrollTop = 0;
					}
				});
				return;
			}

			const scored = models
				.map((model) => ({
					model,
					score: Math.max(
						getSearchScore(model.name, value),
						getSearchScore(model.id, value),
						getSearchScore(model.provider.name, value)
					),
				}))
				.filter((item) => item.score > 0)
				.sort((a, b) => b.score - a.score);

			setFilteredModels(scored.map((item) => item.model));
		},
		[models]
	);

	return (
		<Popover open={open} onOpenChange={handleOpenChange}>
			{isMaxSelected ? (
				<HoverCard>
					<HoverCardTrigger asChild>
						<div>
							<PopoverTrigger asChild>
								<Button
									variant="outline"
									role="combobox"
									aria-expanded={open}
									disabled={isMaxSelected}
									className="w-fit justify-start gap-2"
								>
									<Plus className="h-4 w-4" />
									Add Model
								</Button>
							</PopoverTrigger>
						</div>
					</HoverCardTrigger>
					<HoverCardContent className="p-3">
						<p className="text-sm">
							You have reached your maximum comparison, remove a
							model to add more.
						</p>
					</HoverCardContent>
				</HoverCard>
			) : (
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						role="combobox"
						aria-expanded={open}
						className="w-fit justify-start gap-2"
					>
						<Plus className="h-4 w-4" />
						Add Model
					</Button>
				</PopoverTrigger>
			)}
			<PopoverContent className="w-[320px] p-0">
				<Command shouldFilter={false}>
					<CommandInput
						placeholder="Search model..."
						value={searchValue}
						onValueChange={filterModels}
					/>
					<CommandList>
						<CommandEmpty>No model found.</CommandEmpty>
						<CommandGroup>
							{filteredModels.map((model) => {
								const isSelected = selected.includes(model.id);
								const modelAvailable = isModelAvailable(model);
								return (
									<CommandItem
										key={model.id}
										value={model.id}
										onSelect={() => {
											if (!modelAvailable) return;
											if (isSelected) {
												setSelected(
													selected.filter(
														(id) => id !== model.id
													)
												);
											} else {
												setSelected([
													...selected,
													model.id,
												]);
											}
										}}
										className={cn(
											"flex items-center gap-3 min-h-[56px] py-3",
											!modelAvailable &&
												"opacity-50 cursor-not-allowed"
										)}
										disabled={!modelAvailable}
									>
										<Avatar className="h-7 w-7">
											<AvatarImage
												src={`/providers/${model.provider.provider_id}.svg`}
												alt={model.provider.name}
											/>
											<AvatarFallback>
												{model.provider.name[0]}
											</AvatarFallback>
										</Avatar>{" "}
										<div className="flex flex-col min-w-0">
											<span className="truncate font-medium leading-tight">
												{model.name}
											</span>
											<span className="truncate text-xs text-muted-foreground leading-tight mt-0.5">
												{model.provider.name}
											</span>{" "}
											<span className="truncate text-xs text-muted-foreground/60 font-mono leading-tight mt-0.5">
												{model.id}
											</span>
										</div>
										<div className="ml-auto flex items-center gap-2">
											{!modelAvailable && (
												<span className="text-[10px] bg-muted/50 text-muted-foreground px-1.5 py-0.5 rounded-full font-medium">
													Coming soon
												</span>
											)}
											<Check
												className={cn(
													"h-4 w-4",
													isSelected
														? "opacity-100"
														: "opacity-0"
												)}
											/>
										</div>
									</CommandItem>
								);
							})}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
