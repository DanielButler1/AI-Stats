"use client";

import * as React from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export default function PricingPlanSelect({
	value,
	onChange,
	plans,
}: {
	value: string;
	onChange: (p: string) => void;
	plans: string[];
}) {
	// Capitalize first letter for display in trigger
	const display = value ? value.charAt(0).toUpperCase() + value.slice(1) : "";

	return (
		<Select value={value} onValueChange={onChange}>
			<SelectTrigger className="w-[160px]">
				{/* Provide the capitalized value as the visible content */}
				<SelectValue placeholder="Plan">{display}</SelectValue>
			</SelectTrigger>
			<SelectContent>
				{plans.map((p) => (
					<SelectItem key={p} value={p} className="capitalize">
						{p}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
