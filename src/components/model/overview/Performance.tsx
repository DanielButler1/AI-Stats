import { ExtendedModel } from "@/data/types";

interface PerformanceProps {
	inputContext?: number;
	outputContext?: number;
	latency?: string | number;
	throughput?: string | number;
}

export default function Performance({
	inputContext,
	outputContext,
	latency,
	throughput,
}: PerformanceProps) {
	return (
		<div className="flex flex-col">
			<h2 className="text-xl font-semibold mb-4">Performance</h2>
			<div className="grid grid-cols-1 md:grid-cols-4 gap-2">
				{/* Input Context Window Card */}
				<div className="p-4 flex flex-col items-center justify-center border border-gray-200 dark:border-gray-700 border-b-2 border-b-gray-300 dark:border-b-gray-600 rounded-lg h-full">
					<span className="text-xl font-bold">
						{inputContext != null
							? `${inputContext.toLocaleString()} tokens`
							: "-"}
					</span>
					<span className="text-sm font-medium text-gray-500 mt-1">
						Input Context
					</span>
				</div>
				{/* Output Context Window Card */}
				<div className="p-2 flex flex-col items-center justify-center border border-gray-200 dark:border-gray-700 border-b-2 border-b-gray-300 dark:border-b-gray-600 rounded-lg">
					<span className="text-xl font-bold">
						{outputContext != null
							? `${outputContext.toLocaleString()} tokens`
							: "-"}
					</span>
					<span className="text-sm font-medium text-gray-500 mt-1">
						Output Context
					</span>
				</div>
				{/* Latency Card */}
				<div className="p-2 flex flex-col items-center justify-center border border-gray-200 dark:border-gray-700 border-b-2 border-b-gray-300 dark:border-b-gray-600 rounded-lg">
					<span className="text-xl font-bold">
						{latency != null && latency !== ""
							? `${latency} ms`
							: "-"}
					</span>
					<span className="text-sm font-medium text-gray-500 mt-1">
						Avg. Latency
					</span>
				</div>
				{/* Throughput Card */}
				<div className="p-2 flex flex-col items-center justify-center border border-gray-200 dark:border-gray-700 border-b-2 border-b-gray-300 dark:border-b-gray-600 rounded-lg">
					<span className="text-xl font-bold">
						{throughput != null && throughput !== ""
							? `${throughput} tok/s`
							: "-"}
					</span>
					<span className="text-sm font-medium text-gray-500 mt-1">
						Avg. Throughput
					</span>
				</div>
			</div>
		</div>
	);
}
