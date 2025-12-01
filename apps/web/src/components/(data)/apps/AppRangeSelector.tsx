"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type RangeKey = "1h" | "1d" | "1w" | "4w" | "1m" | "1y";

interface AppRangeSelectorProps {
	value: RangeKey;
	onValueChange: (value: RangeKey) => void;
}

export default function AppRangeSelector({ value, onValueChange }: AppRangeSelectorProps) {
	return (
		<div className="flex items-center gap-2">
			<span className="text-sm font-medium">Time Range:</span>
			<Select value={value} onValueChange={onValueChange}>
				<SelectTrigger className="w-[120px]">
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="1h">Last Hour</SelectItem>
					<SelectItem value="1d">Last Day</SelectItem>
					<SelectItem value="1w">Last Week</SelectItem>
					<SelectItem value="4w">Last 4 Weeks</SelectItem>
					<SelectItem value="1m">Last Month</SelectItem>
					<SelectItem value="1y">Last Year</SelectItem>
				</SelectContent>
			</Select>
		</div>
	);
}
