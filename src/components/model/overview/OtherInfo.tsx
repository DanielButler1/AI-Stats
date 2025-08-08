interface OtherInfoProps {
	parameterCount?: number | string;
	license?: string;
	trainingTokens?: number | string;
}

export default function OtherInfo({
	parameterCount,
	license,
	trainingTokens,
}: OtherInfoProps) {
	const formatCount = (value?: number | string) => {
		// Explicitly bail out on empty‐string, null or undefined
		if (value === "" || value == null || value === 0) return "-";
		const num = Number(value);
		// If it’s not a finite number, also bail out
		if (!Number.isFinite(num)) return "-";
		// Otherwise format it
		return num.toLocaleString();
	};

	return (
		<section>
			<h2 className="text-xl font-semibold mb-4">Other Info</h2>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
				<div className="p-4 flex flex-col items-center justify-center border border-gray-200 dark:border-gray-700 rounded-lg">
					<span className="text-xl font-bold">
						{formatCount(parameterCount)}
					</span>
					<span className="text-sm font-medium text-gray-500 mt-1">
						Parameters
					</span>
				</div>
				<div className="p-4 flex flex-col items-center justify-center border border-gray-200 dark:border-gray-700 rounded-lg">
					<span className="text-xl font-bold">{license || "-"}</span>
					<span className="text-sm font-medium text-gray-500 mt-1">
						License
					</span>
				</div>
				<div className="p-4 flex flex-col items-center justify-center border border-gray-200 dark:border-gray-700 rounded-lg">
					<span className="text-xl font-bold">
						{formatCount(trainingTokens)}
					</span>
					<span className="text-sm font-medium text-gray-500 mt-1">
						Training Tokens
					</span>
				</div>
			</div>
		</section>
	);
}
