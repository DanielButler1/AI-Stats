interface ModelDetail {
	detail_name: string;
	detail_value: string | number | null;
}

interface OtherInfoProps {
	// Accept the older single value for compatibility, or an array of detail objects
	details?: ModelDetail[] | null;
}

export default function OtherInfo({ details }: OtherInfoProps) {
	// Normalize incoming details into a map for easy lookup
	const detailsMap: Record<string, string> = {};
	if (Array.isArray(details)) {
		for (const d of details) {
			if (!d) continue;
			const name = d.detail_name || "";
			const value = d.detail_value == null ? "" : String(d.detail_value);
			detailsMap[name] = value;
		}
	}

	// Helper to resolve either the legacy single `details` prop or value from detailsMap
	const resolve = (key: string) => {
		if (!Array.isArray(details)) {
			// legacy behavior: details might be a raw count or string; return as-is for parameterCount
			if (
				key === "parameter_count" &&
				(typeof details === "number" || typeof details === "string")
			) {
				return String(details);
			}
			return undefined;
		}
		return detailsMap[key];
	};
	const formatCount = (value?: number | string) => {
		// Explicitly bail out on empty‐string, null or undefined
		if (value === "" || value == null || value === 0) return "-";
		const num = Number(value);
		// If it’s not a finite number, also bail out
		if (!Number.isFinite(num)) return "-";
		// Otherwise format it
		return num.toLocaleString();
	};

	const parameterCount = resolve("parameter_count");
	const license = resolve("license");
	const trainingTokens = resolve("training_tokens");

	return (
		<section>
			<h2 className="text-xl font-semibold mb-4">Other Info</h2>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
				<div className="p-4 flex flex-col items-center justify-center border border-gray-200 dark:border-gray-700 border-b-2 border-b-gray-300 dark:border-b-gray-600 rounded-lg h-full">
					<span className="text-xl font-bold">
						{formatCount(parameterCount)}
					</span>
					<span className="text-sm font-medium text-gray-500 mt-1">
						Parameters
					</span>
				</div>
				<div className="p-4 flex flex-col items-center justify-center border border-gray-200 dark:border-gray-700 border-b-2 border-b-gray-300 dark:border-b-gray-600 rounded-lg h-full">
					<span className="text-xl font-bold">{license || "-"}</span>
					<span className="text-sm font-medium text-gray-500 mt-1">
						License
					</span>
				</div>
				<div className="p-4 flex flex-col items-center justify-center border border-gray-200 dark:border-gray-700 border-b-2 border-b-gray-300 dark:border-b-gray-600 rounded-lg h-full">
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
