"use client";

import { useState, useEffect } from "react";
import {
	MonitorTimeline,
	type ChangeHistory,
} from "@/components/monitor/MonitorTimeline";

export function MonitorHistoryClient() {
	const [changeHistory, setChangeHistory] = useState<ChangeHistory[]>([]);

	useEffect(() => {
		fetch("/api/monitor-history")
			.then((res) => (res.ok ? res.json() : []))
			.then(setChangeHistory)
			.catch(() => setChangeHistory([]));
	}, []);

	return <MonitorTimeline data={changeHistory} />;
}
