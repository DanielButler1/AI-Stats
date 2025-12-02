// lib/fetchers/models/getModelOverviewHeader.ts
import { createClient } from "@/utils/supabase/client";
import { unstable_cache } from "next/cache";

export interface ModelOverviewHeader {
	model_id: string;
	name: string;
	organisation_id: string;
	organisation: { name: string; country_code: string }; // not nullable
	family_id?: string; // optional, may be undefined
}

export async function fetchModelOverviewHeader(
	modelId: string
): Promise<ModelOverviewHeader> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.from("data_models")
		.select(
			`
            model_id,
            name,
            organisation_id,
            organisation:data_organisations!data_models_organisation_id_fkey ( name, country_code ),
			family_id
            `
		)
		.eq("model_id", modelId)
		.single();

	console.log("[fetch] HIT DB for model header", modelId);

	if (error) throw error;

	const rawOrg = Array.isArray((data as any).organisation)
		? (data as any).organisation[0]
		: (data as any).organisation;

	if (!rawOrg) {
		throw new Error(`Organisation not found for model ${modelId}`);
	}

	return {
		model_id: data.model_id,
		name: data.name,
		organisation_id: data.organisation_id,
		organisation: rawOrg as { name: string; country_code: string },
		family_id: data.family_id || undefined,
	};
}

// --- Cached wrapper (default export) ---
// capture modelId in both key and tags to retain the per-ID tag
export default function getModelOverviewHeader(
	modelId: string
): Promise<ModelOverviewHeader> {
	const cached = unstable_cache(
		async (id: string) => {
			console.log("[cache] COMPUTE getModelOverviewHeader", id);
			return fetchModelOverviewHeader(id);
		},
		["model:header", modelId], // per-ID cache key
		{ revalidate: 60 * 60 * 24, tags: [`model:header:${modelId}`] } // per-ID tag
	);

	return cached(modelId);
}
