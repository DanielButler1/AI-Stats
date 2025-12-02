"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RecentRequestsTable, {
	type RecentRequestRow,
} from "./RecentRequestsTable";
import SuccessfulRequestDialog, {
	type SuccessfulRow,
} from "./SuccessfulRequestDialog";

type Row = RecentRequestRow & {
	provider?: string | null;
	generation_ms?: number | null;
	latency_ms?: number | null;
	success?: boolean | null;
	status_code?: number | null;
};

export default function RecentRequestsPanel({ rows }: { rows: Row[] }) {
	const [open, setOpen] = React.useState(false);
	const [selected, setSelected] = React.useState<Row | null>(null);

	function openRow(r: Row) {
		setSelected(r);
		setOpen(true);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Successful Requests</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<RecentRequestsTable rows={rows} onSelect={openRow} />
				<SuccessfulRequestDialog
					row={selected as SuccessfulRow | null}
					open={open}
					onOpenChange={setOpen}
				/>
			</CardContent>
		</Card>
	);
}
