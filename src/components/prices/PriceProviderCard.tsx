import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, DollarSign } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";

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
						<div className="h-6 w-6 relative">
							<Image
								src={`/providers/${id}.svg`}
								alt={name}
								fill
								className="object-contain bg-white rounded-full p-0.5"
							/>
						</div>
						{name}
						{isPopular && (
							<Badge
								variant="default"
								className="ml-2 text-xs bg-primary/10 text-primary border-primary/20 transition-colors hover:bg-gray-100"
							>
								<DollarSign className="h-3 w-3 mr-1" />
								Popular
							</Badge>
						)}
					</Link>
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
