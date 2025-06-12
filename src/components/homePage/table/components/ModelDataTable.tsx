import * as React from "react";
import Image from "next/image";
import {
	ColumnDef,
	flexRender,
	Table as TableInstance,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { ExtendedModel } from "@/data/types";
import Link from "next/link";

interface ModelDataTableProps {
	table: TableInstance<ExtendedModel>;
	columns: ColumnDef<ExtendedModel>[];
}

export function ModelDataTable({ table, columns }: ModelDataTableProps) {
	const getRowStyle = (index: number) => {
		const baseStyle =
			"data-[state=selected]:bg-muted hover:bg-muted/50 dark:hover:bg-muted/10 border-b border-border/50 dark:border-border/50 transition-colors duration-200";

		switch (index) {
			case 0:
				return `${baseStyle} bg-gradient-to-r from-amber-50/80 to-transparent dark:from-amber-500/10 border-l-[3px] border-l-amber-400/70 dark:border-l-amber-400/50 text-amber-900/90 dark:text-amber-200/90 font-semibold`;
			case 1:
				return `${baseStyle} bg-gradient-to-r from-zinc-100/80 to-transparent dark:from-zinc-500/10 border-l-[3px] border-l-zinc-400/70 dark:border-l-zinc-500/50 text-zinc-700/90 dark:text-zinc-200/90 font-medium`;
			case 2:
				return `${baseStyle} bg-gradient-to-r from-orange-50/80 to-transparent dark:from-orange-900/10 border-l-[3px] border-l-orange-300/70 dark:border-l-orange-700/50 text-orange-800/90 dark:text-orange-200/90 font-medium`;
			default:
				return baseStyle;
		}
	};

	return (
		<>
			{/* <div className="rounded-md border overflow-x-hidden w-[80vw] lg:w-[95vw] xl:w-[95vw] 2xl:w-[80vw]"> */}
			<div className="rounded-md border overflow-x-hidden w-full">
				<Table className="w-full">
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableHead key={header.id}>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef
														.header,
													header.getContext()
											  )}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row, index) => (
								<TableRow
									key={row.id}
									data-state={
										row.getIsSelected() && "selected"
									}
									className={getRowStyle(index)}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{cell.column.id === "provider" &&
											cell.row.original.provider
												.provider_id ? (
												<div className="flex items-center justify-center">
													<Link
														href={`/providers/${cell.row.original.provider.provider_id}`}
														className="group"
													>
														<div className="relative w-4 h-4 hover:w-6 hover:h-6 transition-all duration-200 ease-in-out flex items-center justify-center rounded-full border bg-white">
															<div className="relative w-3 h-3 hover:w-[18px] hover:h-[18px] transition-all duration-200 ease-in-out">
																<Image
																	src={`/providers/${cell.row.original.provider.provider_id}.svg`}
																	alt={`${cell.row.original.provider.name} logo`}
																	fill
																	className="object-contain group-hover:opacity-80 transition"
																/>
															</div>
														</div>
													</Link>
												</div>
											) : (
												flexRender(
													cell.column.columnDef.cell,
													cell.getContext()
												)
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className="flex items-center justify-end space-x-2 py-4">
				<div className="space-x-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						Previous
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
					>
						Next
					</Button>
				</div>
			</div>
		</>
	);
}
