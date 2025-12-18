import { createClient } from "@/utils/supabase/client";
import { cacheLife, cacheTag } from "next/cache";

// Helper function to parse modalities from database
const parseModalities = (value: unknown): string[] => {
	if (Array.isArray(value)) {
		return value
			.map((item) => (typeof item === "string" ? item.trim() : String(item)))
			.filter((item) => item.length > 0);
	}
	if (typeof value === "string") {
		const trimmed = value.trim();
		if (!trimmed) return [];
		if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
			const inner = trimmed.slice(1, -1);
			if (!inner) return [];
			return inner
				.split(",")
				.map((part) => part.trim().replace(/^"|"$/g, ""))
				.filter((part) => part.length > 0);
		}
		return trimmed
			.split(/[\,\s]+/)
			.map((part) => part.trim())
			.filter((part) => part.length > 0);
	}
	return [];
};

type GatewayProvider =
	| {
			api_provider_name?: string | null;
			link?: string | null;
	  }
	| null;

type GatewayModel = {
	model_id: string;
	api_provider_id: string;
	key: string;
	endpoint?: string | null;
	is_active_gateway?: boolean | null;
	input_modalities?: unknown;
	output_modalities?: unknown;
	params?: unknown;
	provider?: GatewayProvider;
};

const normalizeGatewayModel = (raw: any): GatewayModel => {
	const providerRaw = Array.isArray(raw?.provider)
		? raw.provider[0]
		: raw?.provider;

	return {
		model_id: raw?.model_id,
		api_provider_id: raw?.api_provider_id,
		key: raw?.key,
		endpoint: raw?.endpoint,
		is_active_gateway: raw?.is_active_gateway,
		input_modalities: raw?.input_modalities,
		output_modalities: raw?.output_modalities,
		params: raw?.params,
		provider: providerRaw ?? null,
	};
};

export interface MonitorModelData {
	id: string; // Will be model_id + provider_id + key
	model: string;
	modelId: string; // Add model ID for logo lookup
	organisationId?: string; // Add organisation ID for logo lookup
	provider: {
		name: string;
		id: string; // Add provider ID for logo lookup
		inputPrice: number;
		outputPrice: number;
		features: string[];
	};
	endpoint: string; // The specific endpoint/key
	gatewayStatus: "active" | "inactive"; // Whether this endpoint is active on the gateway
	inputModalities: string[];
	outputModalities: string[];
	context: number;
	maxOutput: number;
	quantization?: string;
	tier?: string; // pricing tier
	added?: string;
	retired?: string; // When this model is retired
}

export async function getMonitorModels(): Promise<{
	models: MonitorModelData[];
	allTiers: string[];
}> {
	"use cache";

	cacheLife("days");
	cacheTag("monitor-models");

	const supabase = await createClient();

	const { data: modelsData, error: modelsError } = await supabase
		.from("data_models")
		.select(`
        model_id,
        name,
        release_date,
        retirement_date,
        status,
        input_types,
        output_types,
        organisation: data_organisations!data_models_organisation_id_fkey(
          organisation_id,
          name
        ),
        details: data_model_details!data_model_details_model_id_fkey(
          detail_name,
          detail_value
        )
      `);

	if (modelsError) {
		throw modelsError;
	}

	const ctxByModelId = new Map<
		string,
		{ context: number; maxOutput: number; quantization?: string }
	>();
	for (const model of modelsData ?? []) {
		const details = Array.isArray(model.details) ? model.details : [];
		let context = 0;
		let maxOutput = 0;
		let quantization: string | undefined;
		for (const d of details) {
			if (d.detail_name === "input_context_length")
				context = Number(d.detail_value) || 0;
			if (d.detail_name === "output_context_length")
				maxOutput = Number(d.detail_value) || 0;
			if (d.detail_name === "quantization")
				quantization = String(d.detail_value);
		}
		ctxByModelId.set(model.model_id, { context, maxOutput, quantization });
	}

	let gatewayModelsData: GatewayModel[] = [];
	let gatewayFetchError: unknown = null;

	const tryGateway = await supabase
		.from("data_api_models")
		.select(`
        model_id,
        api_provider_id,
        key,
        endpoint,
        is_active_gateway,
        input_modalities,
        output_modalities,
        params,
        provider: data_api_providers!data_api_models_api_provider_id_fkey(
          api_provider_name,
          link
        )
      `);

	if (tryGateway.error) {
		gatewayFetchError = tryGateway.error;
		const fallback = await supabase
			.from("data_api_provider_models")
			.select(`
          model_id,
          api_provider_id,
          key,
          endpoint,
          is_active_gateway,
          input_modalities,
          output_modalities,
          params,
          provider: data_api_providers!data_api_provider_models_api_provider_id_fkey(
            api_provider_name,
            link
          )
        `);

		if (!fallback.error) {
			gatewayModelsData = (fallback.data ?? []).map(normalizeGatewayModel);
		}
	} else {
		gatewayModelsData = (tryGateway.data ?? []).map(normalizeGatewayModel);
	}

	const modelKeys =
		gatewayModelsData?.map((pm) => pm.key).filter(Boolean) || [];

	const { data: pricingData } = await supabase
		.from("data_api_pricing_rules")
		.select(`
        model_key,
        meter,
        unit_size,
        price_per_unit,
        pricing_plan,
        effective_from,
        effective_to
      `)
		.in("model_key", modelKeys)
		.or("effective_to.is.null,effective_to.gt." + new Date().toISOString())
		.order("effective_from", { ascending: false });

	const { data: allTiersData } = await supabase
		.from("data_api_pricing_rules")
		.select("pricing_plan")
		.not("pricing_plan", "is", null);

	const allTiers = [...new Set(allTiersData?.map((r) => r.pricing_plan) || [])]
		.filter((tier): tier is string => Boolean(tier))
		.sort();

	const pricingByKey = new Map<
		string,
		{ inputPrice: number; outputPrice: number; tier: string }
	>();
	for (const p of pricingData ?? []) {
		if (!pricingByKey.has(p.model_key)) {
			pricingByKey.set(p.model_key, {
				inputPrice: 0,
				outputPrice: 0,
				tier: "standard",
			});
		}
		const prices = pricingByKey.get(p.model_key)!;
		if (
			(p.meter === "input_text_tokens" || p.meter === "input_tokens") &&
			prices.inputPrice === 0
		) {
			prices.inputPrice = p.price_per_unit * p.unit_size * 1000000;
			prices.tier = p.pricing_plan || "standard";
		}
		if (
			(p.meter === "output_text_tokens" || p.meter === "output_tokens") &&
			prices.outputPrice === 0
		) {
			prices.outputPrice = p.price_per_unit * p.unit_size * 1000000;
			if (prices.tier === "standard") {
				prices.tier = p.pricing_plan || "standard";
			}
		}
	}

	const gatewayModelsByModelId = new Map<string, GatewayModel[]>();
	for (const gm of gatewayModelsData ?? []) {
		if (!gatewayModelsByModelId.has(gm.model_id)) {
			gatewayModelsByModelId.set(gm.model_id, []);
		}
		gatewayModelsByModelId.get(gm.model_id)!.push(gm);
	}

	const modelMap = new Map<string, MonitorModelData>();

	for (const model of modelsData ?? []) {
		const { context, maxOutput, quantization } =
			ctxByModelId.get(model.model_id) ?? {
				context: 0,
				maxOutput: 0,
				quantization: undefined,
			};

		const baseInputModalities = parseModalities(model.input_types);
		const baseOutputModalities = parseModalities(model.output_types);

		const gateways = gatewayModelsByModelId.get(model.model_id) ?? [];
		const gatewayRows = gateways.length > 0 ? gateways : [null];

		for (const gatewayModel of gatewayRows) {
			const prices =
				(gatewayModel?.key
					? pricingByKey.get(gatewayModel.key)
					: undefined) ?? {
					inputPrice: 0,
					outputPrice: 0,
					tier: "standard",
				};

			const providerFeatures = Array.isArray(gatewayModel?.params)
				? gatewayModel.params
				: [];

			const providerName = gatewayModel
				? gatewayModel.provider?.api_provider_name ||
				  gatewayModel.api_provider_id
				: "Unlinked";

			const monitorModel: MonitorModelData = {
				id: gatewayModel
					? `${model.model_id}-${gatewayModel.api_provider_id}-${gatewayModel.key}`
					: `${model.model_id}-unlinked`,
				model: model.name || "",
				modelId: model.model_id,
				organisationId: Array.isArray(model.organisation)
					? (model.organisation[0] as any)?.organisation_id
					: (model.organisation as any)?.organisation_id || undefined,
				provider: {
					name: providerName ?? "Unlinked",
					id: gatewayModel?.api_provider_id || "unlinked",
					inputPrice: prices.inputPrice,
					outputPrice: prices.outputPrice,
					features: Array.isArray(providerFeatures)
						? providerFeatures
						: [],
				},
				endpoint: gatewayModel?.endpoint || gatewayModel?.key || "�",
				gatewayStatus: gatewayModel?.is_active_gateway ? "active" : "inactive",
				inputModalities: gatewayModel
					? parseModalities(gatewayModel.input_modalities)
					: baseInputModalities,
				outputModalities: gatewayModel
					? parseModalities(gatewayModel.output_modalities)
					: baseOutputModalities,
				context,
				maxOutput,
				quantization,
				tier: prices.tier || "standard",
				added: model.release_date || undefined,
				retired: model.retirement_date
					? new Date(model.retirement_date).toISOString().split("T")[0]
					: undefined,
			};

			modelMap.set(monitorModel.id, monitorModel);
		}

		if ((gateways?.length ?? 0) === 0 && gatewayFetchError) {
			// Gateway fetch failed; still include base model with unlinked row above.
		}
	}

	const models = Array.from(modelMap.values()).sort((a, b) => {
		if (!a.added && !b.added) return 0;
		if (!a.added) return 1;
		if (!b.added) return -1;

		return new Date(b.added).getTime() - new Date(a.added).getTime();
	});

	const tiers = new Set(allTiers.length ? allTiers : []);
	tiers.add("standard");

	return { models, allTiers: Array.from(tiers).sort() };
}
