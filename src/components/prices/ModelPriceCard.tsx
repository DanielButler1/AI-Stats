import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ExtendedModel } from "@/data/types";

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
					<Link
						href={`/prices/models/${model.id}`}
						className="hover:text-primary transition-colors flex flex-col gap-1"
					>
						{model.name}
						<span className="text-sm font-normal text-muted-foreground">
							{model.id}
						</span>
					</Link>
				</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-col flex-grow">
				<div className="flex items-center gap-2 mb-2">
					{model.release_date && (
						<Badge variant="outline">
							Released{" "}
							{new Date(model.release_date).toLocaleDateString()}
						</Badge>
					)}
					{!model.release_date && model.announced_date && (
						<Badge variant="outline">
							Announced{" "}
							{new Date(
								model.announced_date
							).toLocaleDateString()}
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
