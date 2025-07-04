import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";

interface BenchmarkCardProps {
	id: string;
	name: string;
	description?: string;
	usageCount: number;
	benchmarkLink: string | null; // Use benchmarkLink instead of hasLink
}

export default function BenchmarkCard({
	id,
	name,
	usageCount,
}: BenchmarkCardProps) {
	return (
		<Card className="shadow-lg border hover:shadow-xl transition-all duration-200 flex flex-col h-full transform hover:scale-[1.01] dark:shadow-zinc-900/25 dark:bg-zinc-950 dark:border-zinc-800">
			<CardHeader className="pb-2">
				<CardTitle className="text-lg flex items-center justify-between">
					<Link
						href={`/benchmarks/${id}`}
						className="hover:text-primary transition-colors"
					>
						{name}
					</Link>
					<Button
						asChild
						size="icon"
						variant="ghost"
						tabIndex={-1}
						className="group"
					>
						<Link
							href={`/benchmarks/${id}`}
							aria-label={`Go to ${name} details`}
							tabIndex={-1}
						>
							<ArrowRight className="w-5 h-5 transition-colors group-hover:text-[color:var(--provider-color)]" />
						</Link>
					</Button>
				</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-col flex-grow">
				<div className="mt-auto">
					<div className="flex items-center justify-between">
						<Badge
							variant="secondary"
							className={
								usageCount > 0
									? "bg-primary/10 text-primary border-primary/20"
									: ""
							}
						>
							{usageCount} {usageCount === 1 ? "model" : "models"}
						</Badge>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
