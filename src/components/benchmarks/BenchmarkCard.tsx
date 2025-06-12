import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, BarChart2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface BenchmarkCardProps {
	id: string;
	name: string;
	description?: string;
	usageCount: number;
	hasLink: boolean;
}

export default function BenchmarkCard({
	id,
	name,
	description,
	usageCount,
	hasLink,
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
					{hasLink && (
						<Badge
							variant="outline"
							className="ml-2 text-xs font-normal"
						>
							<ExternalLink className="h-3 w-3 mr-1" />
						</Badge>
					)}
				</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-col flex-grow">
				{description && (
					<p className="text-sm text-muted-foreground mb-4">
						{description}
					</p>
				)}
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
