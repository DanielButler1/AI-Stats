import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ExtendedModel } from "@/data/types";
import { Megaphone, Rocket, Ban, Archive } from "lucide-react";

interface ModelPriceCardProps {
	model: ExtendedModel;
	providerPrices: {
		input_token_price: number | null;
		output_token_price: number | null;
	};
}

export default function ModelPriceCard({
	model,
	providerPrices,
}: ModelPriceCardProps) {
	const inputPrice = providerPrices.input_token_price;
	const outputPrice = providerPrices.output_token_price;

	return (
		<Card className="shadow-lg border hover:shadow-xl transition-all duration-200 flex flex-col h-full transform hover:scale-[1.01] dark:shadow-zinc-900/25 dark:bg-zinc-950 dark:border-zinc-800">
			<CardHeader className="pb-2">
				<CardTitle className="text-lg flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Link
							href={`/prices/models/${model.id}`}
							className="hover:text-primary transition-colors flex flex-col gap-1"
						>
							{model.name}
							<span className="text-sm font-normal text-muted-foreground">
								{model.id}
							</span>
						</Link>
					</div>
				</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-col flex-grow">
				<div className="flex items-center gap-2 mb-2">
					{/* Only show Available, Deprecated, or Retired status badges */}
					{model.status === "Available" && (
						<Badge className="bg-green-100 text-green-800 border border-green-300 hover:bg-green-200 dark:bg-green-900 dark:text-green-100 dark:border-green-700 dark:hover:bg-green-800 transition-colors flex items-center gap-1">
							<Rocket size={14} className="mr-1" />
							Available
						</Badge>
					)}
					{model.status === "Deprecated" && (
						<Badge className="bg-yellow-100 text-yellow-800 border border-yellow-300 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-100 dark:border-yellow-700 dark:hover:bg-yellow-800 transition-colors flex items-center gap-1">
							<Ban size={14} className="mr-1" />
							Deprecated
						</Badge>
					)}
					{model.status === "Retired" && (
						<Badge className="bg-zinc-300 text-zinc-800 border border-zinc-400 hover:bg-zinc-400 dark:bg-zinc-700 dark:text-zinc-100 dark:border-zinc-500 dark:hover:bg-zinc-600 transition-colors flex items-center gap-1">
							<Archive size={14} className="mr-1" />
							Retired
						</Badge>
					)}
				</div>
				<div className="mt-auto">
					<div className="grid grid-cols-2 gap-4">
						{/* Input Price */}
						<div>
							<p className="text-sm text-muted-foreground">
								Input Price
							</p>
							<p className="font-mono font-medium">
								{inputPrice !== null
									? `$${(inputPrice * 1_000_000).toFixed(
											2
									  )}/1M`
									: "N/A"}
							</p>
						</div>
						{/* Output Price */}
						<div>
							<p className="text-sm text-muted-foreground">
								Output Price
							</p>
							<p className="font-mono font-medium">
								{outputPrice !== null
									? `$${(outputPrice * 1_000_000).toFixed(
											2
									  )}/1M`
									: "N/A"}
							</p>
						</div>
						{/* Input Context */}
						<div>
							<p className="text-sm text-muted-foreground">
								Input Context
							</p>
							<p className="font-mono font-medium">
								{model.input_context_length?.toLocaleString() ||
									"?"}{" "}
								tokens
							</p>
						</div>
						{/* Output Context */}
						<div>
							<p className="text-sm text-muted-foreground">
								Output Context
							</p>
							<p className="font-mono font-medium">
								{model.output_context_length?.toLocaleString() ||
									"?"}{" "}
								tokens
							</p>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
