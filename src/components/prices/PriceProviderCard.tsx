import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/button";

interface PriceProviderCardProps {
	id: string;
	name: string;
	description?: string;
	usageCount: number;
}

export default function PriceProviderCard({
	id,
	name,
	description,
	usageCount,
}: PriceProviderCardProps) {
	// Consider providers with 5+ models as popular
	const isPopular = usageCount >= 5;

	return (
		<Card className="shadow-lg border hover:shadow-xl transition-all duration-200 flex flex-col h-full transform hover:scale-[1.01] dark:shadow-zinc-900/25 dark:bg-zinc-950 dark:border-zinc-800">
			<CardHeader className="pb-2">
				<CardTitle className="text-lg flex items-center justify-between">
					<Link
						href={`/prices/${id}`}
						className="hover:text-primary transition-colors flex items-center gap-2"
					>
						{" "}
						<div className="h-6 w-6 relative flex items-center justify-center rounded-full border bg-white">
							<div className="w-4 h-4 relative">
								<Image
									src={`/providers/${id}.svg`}
									alt={name}
									className="object-contain"
									fill
								/>
							</div>
						</div>
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
							href={`/prices/${id}`}
							aria-label={`Go to ${name} details`}
							tabIndex={-1}
						>
							<ArrowRight className="w-5 h-5 transition-colors group-hover:text-[color:var(--provider-color)]" />
						</Link>
					</Button>
				</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-col flex-grow">
				{description && (
					<p className="text-sm text-muted-foreground mb-4">
						{description}
					</p>
				)}{" "}
				<div className="mt-auto space-y-2">
					<div className="pt-2 flex justify-between items-center">
						<Badge
							variant="secondary"
							className={
								isPopular
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
