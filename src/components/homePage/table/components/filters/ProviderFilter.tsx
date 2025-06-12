import * as React from "react";
import { Check, Filter } from "lucide-react";
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
import Image from "next/image";

interface ProviderFilterProps {
	providers: string[];
	selectedProviders: string[];
	setSelectedProviders: (value: string[]) => void;
}

export function ProviderFilter({
	providers,
	selectedProviders,
	setSelectedProviders,
}: ProviderFilterProps) {
	const [open, setOpen] = React.useState(false);

	const renderSelectedBadges = () => {
		if (selectedProviders.length === 0) return null;
		if (selectedProviders.length <= 2) {
			return selectedProviders.map((provider) => (
				<Badge key={provider} variant="secondary">
					{provider}
				</Badge>
			));
		}
		return (
			<Badge variant="secondary">
				{selectedProviders.length} selected
			</Badge>
		);
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
						<Filter className="h-4 w-4" />
						<span>Providers</span>
						{renderSelectedBadges()}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-full p-0" align="start">
					<Command>
						<CommandInput placeholder="Search providers..." />
						<CommandList>
							<CommandEmpty>No provider found.</CommandEmpty>
							<CommandGroup>
								{providers.map((provider) => (
									<CommandItem
										key={provider}
										value={provider}
										onSelect={() => {
											setSelectedProviders(
												selectedProviders.includes(
													provider
												)
													? selectedProviders.filter(
															(p) =>
																p !== provider
													  )
													: [
															...selectedProviders,
															provider,
													  ]
											);
										}}
									>
										<div
											className={cn(
												"mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
												selectedProviders.includes(
													provider
												)
													? "bg-primary text-primary-foreground"
													: "opacity-50"
											)}
										>
											{selectedProviders.includes(
												provider
											) && <Check className="h-4 w-4" />}
										</div>
										<span className="flex-1">
											{provider}
										</span>
										<Image
											src={`/providers/${provider}.svg`}
											alt={`${provider} logo`}
											className="h-5 w-5 ml-2 object-contain"
											width={20}
											height={20}
										/>
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
