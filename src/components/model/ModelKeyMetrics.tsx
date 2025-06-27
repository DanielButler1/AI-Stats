import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
	ScanText,
	ArrowDownCircle,
	ArrowUpCircle,
	Gauge,
	Timer,
	Info,
	Calculator,
} from "lucide-react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

interface ModelKeyMetricsProps {
	model: any;
}

export default function ModelKeyMetrics({ model }: ModelKeyMetricsProps) {
	// Helper to get best price and info
	function getBestPrice(
		prices: any[],
		key:
			| "input_token_price"
			| "output_token_price"
			| "cached_input_token_price"
	) {
		if (!Array.isArray(prices) || prices.length === 0)
			return { price: null, info: null };

		let min: number | null = null;
		let info: string | null = null;

		for (const p of prices) {
			const price = parseFloat(p[key]);
			if (!isNaN(price) && (min === null || price < min)) {
				min = price;
				info = p.other_info || null;
			}
		}
		return { price: min, info };
	}

	const inputPrice = getBestPrice(model.prices, "input_token_price");
	const outputPrice = getBestPrice(model.prices, "output_token_price");
	const cachedInputPrice = getBestPrice(
		model.prices,
		"cached_input_token_price"
	);

	// Helper to format large numbers with K, M, B suffixes
	const metrics = [
		{
			icon: ScanText,
			title: "Max Input",
			value:
				model.input_context_length != null
					? model.input_context_length.toLocaleString()
					: "-",
			unit: "Tokens",
		},
		{
			icon: ScanText,
			title: "Max Output",
			value:
				model.output_context_length != null
					? model.output_context_length.toLocaleString()
					: "-",
			unit: "Tokens",
		},

		{
			icon: Gauge,
			title: "Throughput",
			value:
				model.throughput != null
					? model.throughput.toLocaleString()
					: "-",
			unit: "tok/s",
		},
		{
			icon: Timer,
			title: "Latency",
			value: model.latency != null ? model.latency.toLocaleString() : "-",
			unit: "ms",
		},
		{
			icon: ArrowDownCircle,
			title: "Input Price",
			value:
				inputPrice.price != null
					? `$${(inputPrice.price * 1_000_000).toLocaleString()}`
					: "-",
			unit: "Per 1M Tokens",
			info: inputPrice.info,
		},
		{
			icon: ArrowDownCircle,
			title: "Cached Input Price",
			value:
				cachedInputPrice.price != null
					? `$${(
							cachedInputPrice.price * 1_000_000
					  ).toLocaleString()}`
					: "-",
			unit: "Per 1M Tokens",
			info: cachedInputPrice.info,
		},
		{
			icon: ArrowUpCircle,
			title: "Output Price",
			value:
				outputPrice.price != null
					? `$${(outputPrice.price * 1_000_000).toLocaleString()}`
					: "-",
			unit: "Per 1M Tokens",
			info: outputPrice.info,
		},
		{
			icon: Calculator,
			title: "Blended Price",
			value:
				outputPrice.price != null && inputPrice.price != null
					? `$${(
							((inputPrice.price * 1 + outputPrice.price * 3) *
								1_000_000) /
							4
					  ).toLocaleString()}`
					: "-",
			unit: "Per 1M Tokens",
			info: "Weighted average: 1 input + 3 output tokens",
		},
	];

	return (
		<Card className="mb-8 shadow-lg">
			<CardHeader>
				<CardTitle className="text-2xl font-bold">
					Key Metrics
				</CardTitle>
			</CardHeader>
			<CardContent className="grid grid-cols-2 lg:grid-cols-4 gap-4">
				{metrics.map((metric) => (
					<div
						key={metric.title}
						className="flex flex-col items-center justify-center rounded-lg bg-muted/40 p-4 h-full"
					>
						<div className="flex items-center gap-2 text-muted-foreground mb-1">
							<metric.icon className="h-5 w-5" />
							<span className="text-xs font-medium flex items-center gap-1">
								{metric.title}
								{metric.info && (
									<TooltipProvider>
										<Tooltip>
											<TooltipTrigger asChild>
												<span className="ml-1 align-middle cursor-pointer">
													<Info className="h-3 w-3 inline" />
												</span>
											</TooltipTrigger>
											<TooltipContent className="max-w-xs whitespace-pre-line break-words">
												{metric.info}
											</TooltipContent>
										</Tooltip>
									</TooltipProvider>
								)}
							</span>
						</div>
						<div className="text-3xl font-extrabold text-primary mb-0.5">
							{metric.value}
						</div>
						<div className="text-xs text-muted-foreground tracking-wide">
							{metric.unit}
						</div>
					</div>
				))}
			</CardContent>
		</Card>
	);
}
