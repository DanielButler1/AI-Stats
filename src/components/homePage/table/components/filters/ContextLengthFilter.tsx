import * as React from "react";
import { Check, Ruler } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
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
import { CONTEXT_LENGTH_RANGES } from "../../constants";

interface ContextLengthFilterProps {
	contextLengthRange: string[];
	setContextLengthRange: (value: string[]) => void;
}

export function ContextLengthFilter({
	contextLengthRange,
	setContextLengthRange,
}: ContextLengthFilterProps) {
	const [open, setOpen] = React.useState(false);

	const renderSelectedBadges = () => {
		if (
			!contextLengthRange ||
			contextLengthRange.length === 0 ||
			contextLengthRange.includes("all")
		)
			return null;
		return contextLengthRange.map((id) => {
			const selectedRange = CONTEXT_LENGTH_RANGES.find(
				(range) => range.id === id
			);
			if (!selectedRange?.label) return null;
			return (
				<Badge key={id} variant="secondary">
					{selectedRange.label}
				</Badge>
			);
		});
	};

	const handleSelect = (id: string) => {
		if (id === "all") {
			setContextLengthRange(["all"]);
			return;
		}
		let next: string[];
		if (contextLengthRange.includes(id)) {
			next = contextLengthRange.filter((v) => v !== id);
		} else {
			next = contextLengthRange.filter((v) => v !== "all").concat(id);
		}
		if (next.length === 0) next = ["all"];
		setContextLengthRange(next);
	};

	return (
		<div className="space-y-2">
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						role="combobox"
						aria-expanded={open}
						className="inline-flex px-4 gap-2"
					>
						<Ruler className="h-4 w-4" />
						<span>Context Length</span>
						{renderSelectedBadges()}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-full p-0" align="start">
					<Command>
						<CommandInput placeholder="Search lengths..." />
						<CommandList>
							<CommandEmpty>No length range found.</CommandEmpty>
							<CommandGroup>
								{CONTEXT_LENGTH_RANGES.map((range) => (
									<CommandItem
										key={range.id}
										value={range.id}
										onSelect={() => handleSelect(range.id)}
									>
										<div
											className={cn(
												"mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
												contextLengthRange.includes(
													range.id
												)
													? "bg-primary text-primary-foreground"
													: "opacity-50"
											)}
										>
											{contextLengthRange.includes(
												range.id
											) && <Check className="h-4 w-4" />}
										</div>
										{range.label}
									</CommandItem>
								))}
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
		</div>
	);
}
