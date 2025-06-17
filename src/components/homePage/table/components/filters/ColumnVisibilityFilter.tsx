import * as React from "react";
import { Filter } from "lucide-react";
import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ExtendedModel } from "@/data/types";

interface ColumnVisibilityFilterProps {
	table: Table<ExtendedModel>;
}

const displayNames: { [key: string]: string } = {
	license: "License",
	parameter_count: "Parameters",
	input_context_length: "Context Length",
	price_per_input_token: "Input Price",
	price_per_output_token: "Output Price",
	gpqa_score: "GPQA Score",
	multimodal: "Multimodal",
	release_date: "Release Date",
	knowledge_cutoff: "Knowledge Cutoff",
	ai_stats_score: "AI Stats Score",
};

export function ColumnVisibilityFilter({ table }: ColumnVisibilityFilterProps) {
	const [open, setOpen] = React.useState(false);

	return (
		<div className="space-y-2">
			<DropdownMenu open={open} onOpenChange={setOpen}>
				<DropdownMenuTrigger asChild>
					<Button
						variant="outline"
						className="inline-flex px-4 gap-2"
					>
						<Filter className="h-4 w-4" />
						<span>View</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="w-[200px]">
					{table
						.getAllColumns()
						.filter((column) => column.getCanHide())
						.map((column) => {
							return (
								<DropdownMenuCheckboxItem
									key={column.id}
									className="capitalize"
									checked={column.getIsVisible()}
									onCheckedChange={(value) => {
										column.toggleVisibility(!!value);
									}}
								>
									{displayNames[column.id] || column.id}
								</DropdownMenuCheckboxItem>
							);
						})}
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
