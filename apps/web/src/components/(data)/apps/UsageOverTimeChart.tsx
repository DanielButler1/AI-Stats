"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAppUsageOverTime } from "@/lib/fetchers/apps/getAppUsageOverTime";
import AppUsageChart from "./AppUsageChart";

type RangeKey = "1h" | "1d" | "1w" | "4w" | "1m" | "1y";

export default function UsageOverTimeChart({
	appId,
	range = "1m"
}: {
	appId: string;
	range?: RangeKey;
}) {
	const [rows, setRows] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		getAppUsageOverTime(appId, range).then((data) => {
			setRows(data);
			setLoading(false);
		});
	}, [appId, range]);

	if (loading) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Usage Over Time</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="animate-pulse h-64 bg-gray-200 rounded"></div>
				</CardContent>
			</Card>
		);
	}

	if (!rows.length) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Usage Over Time</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-muted-foreground">No usage data available for this time period.</p>
				</CardContent>
			</Card>
		);
	}

	const windowLabel = `${range} period`;

	return <AppUsageChart rows={rows} windowLabel={windowLabel} />;
}
