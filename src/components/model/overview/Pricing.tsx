import {
	Tooltip,
	TooltipTrigger,
	TooltipContent,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
interface PricingProps {
	cheapestInput?: { price: number; provider: string } | null;
	cheapestOutput?: { price: number; provider: string } | null;
	cheapestCachedInput?: { price: number; provider: string } | null;
	blended?: number | null;
}

export default function Pricing({
	cheapestInput,
	cheapestOutput,
	cheapestCachedInput,
	blended,
}: PricingProps) {
	return (
		<div className="flex flex-col h-full">
			<h2 className="text-xl font-semibold mb-4">Pricing</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 flex-1 h-full">
				{/* Cheapest Input Price Card */}
				<div
					className={`p-4 flex flex-col items-center justify-center border border-gray-200 dark:border-gray-700 border-b-2 ${
						cheapestInput
							? "border-b-blue-500 dark:border-b-blue-400"
							: "border-b-gray-300 dark:border-b-gray-600"
					} rounded-lg h-full`}
				>
					<span className="text-xl font-bold">
						{cheapestInput
							? `$${cheapestInput.price.toFixed(2)}`
							: "-"}
					</span>
					<span className="text-sm font-medium text-gray-500 mt-1">
						Input Price / 1M tokens
					</span>
				</div>
				{/* Cheapest Output Price Card */}
				<div
					className={`p-4 flex flex-col items-center justify-center border border-gray-200 dark:border-gray-700 border-b-2 ${
						cheapestOutput
							? "border-b-green-500 dark:border-b-green-400"
							: "border-b-gray-300 dark:border-b-gray-600"
					} rounded-lg h-full`}
				>
					<span className="text-xl font-bold">
						{cheapestOutput
							? `$${cheapestOutput.price.toFixed(2)}`
							: "-"}
					</span>
					<span className="text-sm font-medium text-gray-500 mt-1">
						Output Price / 1M tokens
					</span>
				</div>
				{/* Cheapest Cached Input Price Card */}
				<div
					className={`p-4 flex flex-col items-center justify-center border border-gray-200 dark:border-gray-700 border-b-2 ${
						cheapestCachedInput
							? "border-b-purple-500 dark:border-b-purple-400"
							: "border-b-gray-300 dark:border-b-gray-600"
					} rounded-lg h-full`}
				>
					<span className="text-xl font-bold">
						{cheapestCachedInput
							? `$${cheapestCachedInput.price.toFixed(2)}`
							: "-"}
					</span>
					<span className="text-sm font-medium text-gray-500 mt-1">
						Cached Input Price / 1M tokens
					</span>
				</div>
				{/* Blended Price Card */}
				<div
					className={`p-4 flex flex-col items-center justify-center border border-gray-200 dark:border-gray-700 border-b-2 ${
						blended != null
							? "border-b-orange-500 dark:border-b-orange-400"
							: "border-b-gray-300 dark:border-b-gray-600"
					} rounded-lg h-full`}
				>
					<span className="text-xl font-bold">
						{blended != null ? `$${blended.toFixed(2)}` : "-"}
					</span>
					<span className="text-sm font-medium text-gray-500 mt-1 flex items-center gap-1">
						Blended Price / 1M tokens
						<Tooltip>
							<TooltipTrigger asChild>
								<span
									tabIndex={0}
									className="ml-1 cursor-pointer align-middle"
								>
									<Info
										size={16}
										aria-label="Info about blended price"
									/>
								</span>
							</TooltipTrigger>
							<TooltipContent side="top" className="max-w-xs">
								Blended price (3:1) is the average cost per 1M
								tokens assuming 75% are input tokens and 25% are
								output, reflecting typical usage patterns.
							</TooltipContent>
						</Tooltip>
					</span>
				</div>
			</div>
		</div>
	);
}
