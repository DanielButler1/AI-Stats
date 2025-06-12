import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Check, Minus, X, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ExtendedModel } from "@/data/types";
import {
	Tooltip,
	TooltipTrigger,
	TooltipContent,
} from "@/components/ui/tooltip";

export const columns: ColumnDef<ExtendedModel>[] = [
	{
		id: "provider",
		accessorFn: (row) => row.provider.name,
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === "asc")
					}
					className="w-full"
				>
					Provider
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => (
			<Link
				href={`/providers/${row.original.provider.name.toLowerCase()}`}
				className="text-center block hover:underline"
			>
				{row.original.provider.name}
			</Link>
		),
		enableHiding: false,
	},
	{
		accessorKey: "name",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === "asc")
					}
					className="w-48"
				>
					Model
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => (
			<Link
				href={`/models/${row.original.id}`}
				className="text-center block hover:font-bold"
			>
				{row.getValue("name")}
			</Link>
		),
		enableHiding: false,
	},
	{
		accessorKey: "knowledge_cutoff",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === "asc")
					}
					className="w-full"
				>
					Knowledge Cutoff
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const date = row.getValue("knowledge_cutoff") as string;
			return (
				<div className="text-center">
					{date
						? new Date(date).toLocaleDateString("en-GB", {
								day: "2-digit",
								month: "short",
								year: "numeric",
						  })
						: "-"}
				</div>
			);
		},
	},
	{
		accessorKey: "release_date",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === "asc")
					}
					className="w-full"
				>
					Release Date
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const date = row.getValue("release_date") as string;
			return (
				<div className="text-center">
					{date
						? new Date(date).toLocaleDateString("en-GB", {
								day: "2-digit",
								month: "short",
								year: "numeric",
						  })
						: "-"}
				</div>
			);
		},
	},
	{
		accessorKey: "license",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === "asc")
					}
					className="w-full"
				>
					License
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const license = row.getValue("license") as string | null;
			if (!license) {
				return <div className="text-center">-</div>;
			}
			if (license.toLowerCase() === "proprietary") {
				return <div className="text-center">Proprietary</div>;
			}
			return (
				<div className="text-center flex items-center justify-center">
					<span>Open</span>
					<Tooltip delayDuration={0}>
						<TooltipTrigger asChild>
							<Info className="ml-1 h-4 w-4 text-gray-500 cursor-pointer" />
						</TooltipTrigger>
						<TooltipContent>{license}</TooltipContent>
					</Tooltip>
				</div>
			);
		},
	},
	{
		accessorKey: "parameter_count",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === "asc")
					}
					className="w-full"
				>
					Parameters
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const params = row.getValue("parameter_count") as number;
			return (
				<div className="text-center">
					{params ? `${(params / 1e9).toFixed(1)}B` : "-"}
				</div>
			);
		},
		enableHiding: true, // allow hiding
	},
	{
		accessorKey: "input_context_length",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === "asc")
					}
					className="w-full"
				>
					Context
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const context = row.getValue("input_context_length") as number;
			return (
				<div className="text-center">
					{context ? context.toLocaleString() : "-"}
				</div>
			);
		},
	},
	{
		accessorKey: "price_per_input_token",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === "asc")
					}
					className="w-full"
				>
					Input $/M
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		accessorFn: (row) => {
			const prices =
				row.prices
					?.map((p) => p.input_token_price)
					.filter((p) => p !== null && p !== undefined) || [];
			return prices.length > 0 ? Math.min(...prices) : null;
		},
		cell: ({ row }) => {
			const price = row.getValue("price_per_input_token") as
				| number
				| null;
			return (
				<div className="text-center">
					{price ? `$${(price * 1000000).toFixed(2)}` : "-"}
				</div>
			);
		},
	},
	{
		accessorKey: "price_per_output_token",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === "asc")
					}
					className="w-full"
				>
					Output $/M
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		accessorFn: (row) => {
			const prices =
				row.prices
					?.map((p) => p.output_token_price)
					.filter((p) => p !== null && p !== undefined) || [];
			return prices.length > 0 ? Math.min(...prices) : null;
		},
		cell: ({ row }) => {
			const price = row.getValue("price_per_output_token") as
				| number
				| null;
			return (
				<div className="text-center">
					{price ? `$${(price * 1000000).toFixed(2)}` : "-"}
				</div>
			);
		},
	},
	{
		id: "gpqa_score",
		accessorFn: (row) => {
			const gpqaResult = row.benchmark_results?.find(
				(b) => b.benchmark_id === "gpqa"
			);
			if (!gpqaResult?.score) return null;
			// Handle both number and string (percentage) formats
			const score = gpqaResult.score.toString();
			return parseFloat(score.replace("%", ""));
		},
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === "asc")
					}
					className="w-full"
				>
					GPQA Score
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const score = row.getValue("gpqa_score") as number | null;
			return (
				<div className="text-center">
					{score ? `${score.toFixed(1)}%` : "-"}
				</div>
			);
		},
	},
	{
		accessorKey: "multimodal",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === "asc")
					}
					className="w-full"
				>
					Multimodal
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => (
			<div className="flex justify-center items-center">
				{row.getValue("multimodal") === true ? (
					<Check className="text-green-600 h-4 w-4" />
				) : row.getValue("multimodal") === false ? (
					<X className="text-red-500 h-4 w-4" />
				) : (
					<Minus className="text-gray-500 h-4 w-4" />
				)}
			</div>
		),
	},
];
