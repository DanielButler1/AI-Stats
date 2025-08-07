import { ExtendedModel } from "@/data/types";
// import Link from "next/link"; // Commented out unused import
// import { Button } from "@/components/ui/button"; // Commented out unused import
import KeyDates from "@/components/model/overview/KeyDates";
import Performance from "@/components/model/overview/Performance";
import Pricing from "@/components/model/overview/Pricing";
import Modalities from "@/components/model/overview/Modalities";
import OtherInfo from "@/components/model/overview/OtherInfo";
import ModelLinks from "@/components/model/overview/ModelLinks";

export interface ModelOverviewProps {
	model: ExtendedModel;
}

export default function ModelOverview({ model }: ModelOverviewProps) {
	// Helper: format date as dd MMM yyyy
	const formatDate = (dateStr?: string) => {
		if (!dateStr) return "-";
		const date = new Date(dateStr);
		if (isNaN(date.getTime())) return "-";
		return date.toLocaleDateString("en-GB", {
			day: "2-digit",
			month: "short",
			year: "numeric",
		});
	};

	// Pricing logic
	const prices = Array.isArray(model.prices) ? model.prices : [];

	// Helper to get price by key, supporting both legacy and new keys
	const getPrice = (p: any, key: string) => {
		if (!p) return undefined;
		const keyMap: Record<string, string[]> = {
			input: ["input", "input_token_price"],
			output: ["output", "output_token_price"],
			cached_input: ["cached_input", "cached_input_token_price"],
		};
		const keys = keyMap[key] || [key];
		for (const k of keys) {
			const val = p[k];
			if (typeof val === "number") return val * 1_000_000;
			if (typeof val === "string" && val.trim() !== "") {
				const parsed = parseFloat(val);
				if (!isNaN(parsed)) return parsed * 1_000_000;
			}
		}
		return undefined;
	};

	// Get provider name for pricing (handles string or APIProvider object)
	const getProvider = (p: any) => {
		if (typeof p.api_provider === "string") return p.api_provider;
		if (
			p.api_provider &&
			typeof p.api_provider === "object" &&
			p.api_provider.api_provider_name
		)
			return p.api_provider.api_provider_name;
		if (typeof p.provider === "string") return p.provider;
		if (p.provider && typeof p.provider === "object" && p.provider.name)
			return p.provider.name;
		return "";
	};

	const cheapestInput = prices.reduce((min, p) => {
		const price = getPrice(p, "input");
		const provider = getProvider(p);
		return price != null && (min == null || price < min.price)
			? { price, provider, obj: p }
			: min;
	}, null as null | { price: number; provider: string; obj: any });

	const cheapestOutput = prices.reduce((min, p) => {
		const price = getPrice(p, "output");
		const provider = getProvider(p);
		return price != null && (min == null || price < min.price)
			? { price, provider, obj: p }
			: min;
	}, null as null | { price: number; provider: string; obj: any });

	// Modalities logic: always show Text, Image, Audio, Video
	const parseTypes = (types: any) => {
		if (Array.isArray(types)) return types.map((t) => t.toLowerCase());
		if (typeof types === "string")
			return types
				.split(",")
				.map((t) => t.trim().toLowerCase())
				.filter(Boolean);
		return [];
	};
	const inputTypes = parseTypes(model.input_types);
	const outputTypes = parseTypes(model.output_types);

	return (
		<div className="w-full mx-auto">
			{/* Info Quadrants */}
			<section>
				<div className="grid grid-cols-1 gap-6">
					<KeyDates
						announced={model.announced_date ?? undefined}
						released={model.release_date ?? undefined}
						deprecated={model.deprecation_date ?? undefined}
						retired={model.retirement_date ?? undefined}
						formatDate={formatDate}
					/>
					<Performance
						inputContext={model.input_context_length ?? undefined}
						outputContext={model.output_context_length ?? undefined}
						latency={prices[0]?.latency ?? undefined}
						throughput={prices[0]?.throughput ?? undefined}
					/>
					<Pricing
						cheapestInput={cheapestInput}
						cheapestOutput={cheapestOutput}
					/>
					<Modalities
						inputTypes={inputTypes}
						outputTypes={outputTypes}
					/>
				</div>
			</section>

			{/* Other Info & Links in 2-col grid */}
			<section className="mt-8">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<OtherInfo
							parameterCount={model.parameter_count ?? undefined}
							license={model.license ?? undefined}
							trainingTokens={model.training_tokens ?? undefined}
						/>
					</div>
					<div>
						<h2 className="text-xl font-semibold mb-2">Links</h2>
						<ModelLinks model={model} />
					</div>
				</div>
			</section>
		</div>
	);
}
