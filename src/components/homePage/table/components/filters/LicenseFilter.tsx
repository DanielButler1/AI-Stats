import * as React from "react";
import { Check, Scale } from "lucide-react";
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

interface LicenseFilterProps {
	licenses: string[];
	selectedLicenses: string[];
	setSelectedLicenses: (value: string[]) => void;
}

export function LicenseFilter({
	licenses,
	selectedLicenses,
	setSelectedLicenses,
}: LicenseFilterProps) {
	const [open, setOpen] = React.useState(false);

	const renderSelectedBadges = () => {
		if (selectedLicenses.length === 0) return null;
		if (selectedLicenses.length <= 2) {
			return selectedLicenses.map((license) => (
				<Badge key={license} variant="secondary">
					{license}
				</Badge>
			));
		}
		return (
			<Badge variant="secondary">
				{selectedLicenses.length} selected
			</Badge>
		);
	};

	return (
		<div className="space-y-2">
			<Popover open={open} onOpenChange={setOpen} modal={true}>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						role="combobox"
						aria-expanded={open}
						className="inline-flex px-4 gap-2"
					>
						<Scale className="h-4 w-4" />
						<span>Licenses</span>
						{renderSelectedBadges()}
					</Button>
				</PopoverTrigger>
				<PopoverContent
					className=" w-[90vw] xl:w-full p-0"
					align="start"
				>
					<Command>
						<CommandInput placeholder="Search licenses..." />
						<CommandList>
							<CommandEmpty>No license found.</CommandEmpty>
							<CommandGroup>
								{licenses.map((license) => (
									<CommandItem
										key={license}
										value={license}
										onSelect={() => {
											setSelectedLicenses(
												selectedLicenses.includes(
													license
												)
													? selectedLicenses.filter(
															(l) => l !== license
													  )
													: [
															...selectedLicenses,
															license,
													  ]
											);
										}}
									>
										<div
											className={cn(
												"mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
												selectedLicenses.includes(
													license
												)
													? "bg-primary text-primary-foreground"
													: "opacity-50"
											)}
										>
											{selectedLicenses.includes(
												license
											) && <Check className="h-4 w-4" />}
										</div>
										{license}
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
