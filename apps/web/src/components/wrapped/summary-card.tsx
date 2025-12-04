import * as React from "react";
import {
	Card,
	CardHeader,
	CardTitle,
	CardFooter,
	CardDescription,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SummaryCardProps {
	title: string;
	value: string;
	icon: React.ReactNode;
	footnote?: string;
	className?: string;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
	title,
	value,
	icon,
	footnote,
	className,
}) => (
	<Card
		className={cn(
			"relative overflow-hidden rounded-3xl border border-zinc-200/60 bg-white/90 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-zinc-800/60 dark:bg-zinc-950/80",
			className
		)}
	>
		<CardHeader className="pb-4">
			<div className="flex items-center justify-between">
				<CardTitle className="text-sm font-semibold text-zinc-600 dark:text-zinc-300">
					{title}
				</CardTitle>
				<div className="text-zinc-400 dark:text-zinc-500">{icon}</div>
			</div>
			<CardDescription className="mt-3 text-3xl font-semibold text-zinc-900 dark:text-zinc-100">
				{value}
			</CardDescription>
		</CardHeader>
		{footnote ? (
			<CardFooter className="pt-0 text-xs text-zinc-500 dark:text-zinc-400">
				{footnote}
			</CardFooter>
		) : null}
	</Card>
);
