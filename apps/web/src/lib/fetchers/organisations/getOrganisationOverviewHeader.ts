// lib/fetchers/organisations/getOrganisationOverviewHeader.ts
import { createClient } from "@/utils/supabase/client";
import { unstable_cache } from "next/cache";

export interface OrganisationOverviewHeader {
	organisation_id: string;
	name: string;
	country_code: string | null;
}

export async function fetchOrganisationOverviewHeader(
	organisationId: string
): Promise<OrganisationOverviewHeader> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.from("data_organisations")
		.select(
			`
            organisation_id,
            name,
            country_code
            `
		)
		.eq("organisation_id", organisationId)
		.single();

	console.log("[fetch] HIT DB for organisation header", organisationId);

	console.log("Data:", data);

	if (error) throw error;

	// The DB may return the row directly (e.g. { organisation_id, name, country_code })
	// or wrap it under an `organisation` field which itself may be an array or object.
	// Normalize these cases to a single `row` object.
	let row: any = null;

	if (data == null) {
		throw new Error(`Organisation not found for organisation ${organisationId}`);
	}

	// If data has an `organisation` field, prefer that.
	if ((data as any).organisation !== undefined && (data as any).organisation !== null) {
		const orgField = (data as any).organisation;
		row = Array.isArray(orgField) ? orgField[0] : orgField;
	} else {
		// Otherwise, assume the selected columns were returned at the top level.
		row = data as any;
	}

	if (!row || !row.organisation_id) {
		throw new Error(`Organisation not found or missing id for organisation ${organisationId}`);
	}

	return {
		organisation_id: String(row.organisation_id),
		name: row.name ?? "",
		country_code: row.country_code ?? null,
	};
}

// --- Cached wrapper (default export) ---
// capture organisationId in both key and tags to retain the per-ID tag
export default function getOrganisationOverviewHeader(
	organisationId: string
): Promise<OrganisationOverviewHeader> {
	const cached = unstable_cache(
		async (id: string) => {
			console.log("[cache] COMPUTE getOrganisationOverviewHeader", id);
			return fetchOrganisationOverviewHeader(id);
		},
		["organisation:header", organisationId], // per-ID cache key
		{ revalidate: 60 * 60 * 24, tags: [`organisation:header:${organisationId}`] } // per-ID tag
	);

	return cached(organisationId);
}
