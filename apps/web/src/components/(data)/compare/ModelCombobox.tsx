// ModelCombobox.tsx
"use client";

import * as React from "react";
import { Plus, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/Logo";
import type { ExtendedModel } from "@/data/types";

interface ModelComboboxProps {
	models: ExtendedModel[];
	selected: string[];
	setSelected: (ids: string[]) => void;
}

type GroupedModels = {
	providerId: string;
	providerName: string;
	models: ExtendedModel[];
};

const MAX_SELECTION = 4;

function isModelAvailable(_model: ExtendedModel): boolean {
	return true;
}

export default function ModelCombobox({
	models,
	selected,
	setSelected,
}: ModelComboboxProps) {
	const [dialogOpen, setDialogOpen] = React.useState(false);
	const [searchTerm, setSearchTerm] = React.useState("");
	const [pendingSelection, setPendingSelection] = React.useState<string[]>(
		selected.slice(0, MAX_SELECTION)
	);
	const [selectionNotice, setSelectionNotice] =
		React.useState<string | null>(null);

	React.useEffect(() => {
		if (dialogOpen) return;
		setPendingSelection((current) => {
			const next = selected.slice(0, MAX_SELECTION);
			if (
				current.length === next.length &&
				current.every((value, index) => value === next[index])
			) {
				return current;
			}
			return next;
		});
	}, [selected, dialogOpen]);

	const groupedModels = React.useMemo<GroupedModels[]>(() => {
		const map = new Map<string, GroupedModels>();
		models.forEach((model) => {
			const providerId = model.provider?.provider_id ?? "unknown";
			const providerName = model.provider?.name ?? providerId;
			if (!map.has(providerId)) {
				map.set(providerId, {
					providerId,
					providerName,
					models: [],
				});
			}
			map.get(providerId)!.models.push(model);
		});

		return Array.from(map.values())
			.map((group) => ({
				...group,
				models: group.models.sort((a, b) =>
					a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
				),
			}))
			.sort((a, b) =>
				a.providerName.localeCompare(b.providerName, undefined, {
					sensitivity: "base",
				})
			);
	}, [models]);

	const filteredGroups = React.useMemo(() => {
		const term = searchTerm.trim().toLowerCase();
		if (!term) return groupedModels;

		return groupedModels
			.map((group) => {
				const matchesProvider = group.providerName
					.toLowerCase()
					.includes(term);
				if (matchesProvider) {
					return group;
				}
				const matchingModels = group.models.filter((model) => {
					const providerName = model.provider?.name ?? "";
					return (
						model.name.toLowerCase().includes(term) ||
						model.id.toLowerCase().includes(term) ||
						providerName.toLowerCase().includes(term)
					);
				});
				if (matchingModels.length === 0) return null;
				return { ...group, models: matchingModels };
			})
			.filter(Boolean) as GroupedModels[];
	}, [groupedModels, searchTerm]);

	const modelsById = React.useMemo(() => {
		const lookup = new Map<string, ExtendedModel>();
		models.forEach((model) => lookup.set(model.id, model));
		return lookup;
	}, [models]);

	const handleOpenChange = (open: boolean) => {
		setDialogOpen(open);
		if (open) {
			setSelectionNotice(null);
		}
	};

	const toggleSelection = (modelId: string, available: boolean) => {
		setSelectionNotice(null);
		setPendingSelection((current) => {
			if (current.includes(modelId)) {
				return current.filter((id) => id !== modelId);
			}
			if (!available) {
				setSelectionNotice("This model isn't ready for comparison yet.");
				return current;
			}
			if (current.length >= MAX_SELECTION) {
				setSelectionNotice("You can compare up to four models at a time.");
				return current;
			}
			return [...current, modelId];
		});
	};

	const removeSelection = (modelId: string) => {
		setPendingSelection((current) =>
			current.filter((existing) => existing !== modelId)
		);
	};

	const handleApply = () => {
		const nextSelection = Array.from(new Set(pendingSelection)).slice(
			0,
			MAX_SELECTION
		);
		setSelected(nextSelection);
		setDialogOpen(false);
	};

	const buttonLabel =
		selected.length > 0 ? "Edit selected models" : "Select models";

	const selectedDetails = pendingSelection.map((id) => {
		const model = modelsById.get(id);
		return {
			id,
			label: model?.name ?? id,
		};
	});

	return (
		<Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>
				<Button
					variant="outline"
					className={cn(
						"w-fit justify-start gap-2",
						selected.length === 0 && "text-muted-foreground"
					)}
				>
					<Plus className="h-4 w-4" />
					{buttonLabel}
					{selected.length > 0 && (
						<Badge
							variant="secondary"
							className="ml-1 bg-primary/10 text-primary"
						>
							{selected.length}/{MAX_SELECTION}
						</Badge>
					)}
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-4xl space-y-4">
				<DialogHeader>
					<DialogTitle>Choose models to compare</DialogTitle>
					<DialogDescription>
						Pick up to four models. We group everything by organisation to
						make browsing easier. Use search to jump straight to a specific
						model or provider.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4">
					<Input
						autoFocus
						value={searchTerm}
						onChange={(event) => setSearchTerm(event.target.value)}
						placeholder="Search by model name, identifier, or organisation"
					/>

					<div className="rounded-md border border-dashed border-border/60 p-3">
						<div className="flex items-center justify-between">
							<p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
								Selected
							</p>
							<span className="text-xs text-muted-foreground">
								{pendingSelection.length}/{MAX_SELECTION} chosen
							</span>
						</div>
						<div className="mt-3 flex flex-wrap gap-2">
							{selectedDetails.length > 0 ? (
								selectedDetails.map((entry) => (
									<Badge
										key={entry.id}
										variant="secondary"
										className="flex items-center gap-2 rounded-full px-3 py-1"
									>
										<span className="text-xs font-medium">
											{entry.label}
										</span>
										<button
											type="button"
											className="rounded-full p-0.5 transition hover:bg-muted"
											onClick={() => removeSelection(entry.id)}
											aria-label={`Remove ${entry.label}`}
										>
											<X className="h-3 w-3" />
										</button>
									</Badge>
								))
							) : (
								<p className="text-xs text-muted-foreground">
									No models selected yet.
								</p>
							)}
						</div>
					</div>

					<div className="max-h-[420px] space-y-4 overflow-y-auto pr-2">
						{filteredGroups.length === 0 ? (
							<p className="py-8 text-center text-sm text-muted-foreground">
								No models match your search yet.
							</p>
						) : (
							filteredGroups.map((group) => (
								<div
									key={group.providerId}
									className="rounded-lg border border-border/60 p-4"
								>
									<div className="mb-3 flex items-center justify-between gap-4">
										<div className="flex items-center gap-2">
											<Logo
												id={group.providerId}
												width={24}
												height={24}
												alt={group.providerName}
												className="h-6 w-6"
											/>
											<span className="font-semibold">
												{group.providerName}
											</span>
										</div>
										<span className="text-xs text-muted-foreground">
											{group.models.length} model
											{group.models.length === 1 ? "" : "s"}
										</span>
									</div>
									<div className="grid gap-2 sm:grid-cols-2">
										{group.models.map((model) => {
											const modelAvailable =
												isModelAvailable(model);
											const isSelected =
												pendingSelection.includes(
													model.id
												);
											return (
												<button
													type="button"
													key={model.id}
													onClick={() =>
														toggleSelection(
															model.id,
															modelAvailable
														)
													}
													className={cn(
														"flex w-full items-center justify-between rounded-lg border p-3 text-left transition",
														isSelected
															? "border-primary bg-primary/5 shadow-sm"
															: "hover:border-primary",
														!modelAvailable &&
															!isSelected &&
															"opacity-60"
													)}
													disabled={
														!modelAvailable &&
														!isSelected
													}
												>
													<div className="space-y-1">
														<p className="text-sm font-medium leading-tight">
															{model.name}
														</p>
														<p className="text-xs text-muted-foreground font-mono">
															{model.id}
														</p>
													</div>
													<div className="flex flex-col items-end gap-1 text-xs text-muted-foreground">
														<span>
															{model.provider?.name ??
																group.providerName}
														</span>
														{!modelAvailable && (
															<span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
																Coming soon
															</span>
														)}
														{isSelected && (
															<span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
																Selected
															</span>
														)}
													</div>
												</button>
											);
										})}
									</div>
								</div>
							))
						)}
					</div>
				</div>

				{selectionNotice && (
					<p className="text-sm text-destructive">{selectionNotice}</p>
				)}

				<DialogFooter className="gap-3 sm:gap-2">
					<Button
						variant="outline"
						type="button"
						onClick={() => {
							setPendingSelection(selected.slice(0, MAX_SELECTION));
							setSelectionNotice(null);
						}}
					>
						Reset to current selection
					</Button>
					<Button
						type="button"
						onClick={handleApply}
						disabled={pendingSelection.length === 0}
					>
						Apply selection
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

