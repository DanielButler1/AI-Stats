import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BenchmarkCardProps {
	id: string;
	name: string;
	benchmarkLink: string | null; // Use benchmarkLink instead of hasLink
}

export default function BenchmarkCard({ id, name }: BenchmarkCardProps) {
	return (
		<Card className="shadow-lg border hover:shadow-xl transition-all duration-200 flex flex-col h-full transform hover:scale-105 dark:shadow-zinc-900/25 dark:bg-zinc-950 dark:border-zinc-800">
			<CardHeader className="py-4">
				<CardTitle className="text-lg flex items-center justify-between">
					<Link
						href={`benchmarks/${id}`}
						className="hover:text-primary transition-colors"
					>
						<span className="relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full">
							{name}
						</span>
					</Link>
					<Button
						asChild
						size="icon"
						variant="ghost"
						tabIndex={-1}
						className="group"
					>
						<Link
							href={`benchmarks/${id}`}
							aria-label={`Go to ${name} details`}
							tabIndex={-1}
						>
							<ArrowRight className="w-5 h-5 transition-colors group-hover:text-(--provider-color)" />
						</Link>
					</Button>
				</CardTitle>
			</CardHeader>
		</Card>
	);
}
