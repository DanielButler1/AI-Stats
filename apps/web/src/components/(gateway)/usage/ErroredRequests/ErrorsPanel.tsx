"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ErrorsTable, { type ErrorRow } from "./ErrorsTable";
import ErrorRequestDialog, { type ErrorDialogRow } from "./ErrorRequestDialog";

export default function ErrorsPanel(props: {
	totalErrors: number;
	totalRequests?: number;
	topCodes: Array<{ code: string; count: number }>;
	recent: ErrorRow[];
}) {
	const [open, setOpen] = React.useState(false);
	const [selected, setSelected] = React.useState<null | ErrorRow>(null);

	function openRow(r: ErrorRow) {
		setSelected(r);
		setOpen(true);
	}

	// Precompute badge text so the JSX stays clean
	const totalReq = Number(props.totalRequests ?? 0);
	const errs = Number(props.totalErrors ?? 0);
	let badgeText = `${errs} total`;
	if (totalReq > 0) {
		const pct = (errs / totalReq) * 100;
		badgeText = `${pct.toFixed(2)}% errored`;
	}

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardTitle>Errors</CardTitle>
					<Badge variant="destructive">{badgeText}</Badge>
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				<ErrorsTable rows={props.recent} onSelect={openRow} />
				<ErrorRequestDialog
					row={selected as ErrorDialogRow | null}
					open={open}
					onOpenChange={setOpen}
				/>
			</CardContent>
		</Card>
	);
}
