import { unstable_cache } from "next/cache";
import getModelOverviewHeader from "./getModelOverviewHeader";
import getFamilyModels, { FamilyModelItem, getFamilyModelsCached } from "./getFamilyModels";

async function fetchFamilyMembers(modelId: string): Promise<FamilyModelItem[]> {
	const header = await getModelOverviewHeader(modelId);
	const familyId = header?.family_id;
	if (!familyId) {
		return [];
	}

	// Prefer cached family fetch to avoid extra DB hits.
	const family = await getFamilyModelsCached(familyId);
	if (!family || !Array.isArray(family.models)) {
		return [];
	}

	return family.models;
}

/**
 * Cached family members by model id.
 */
export const getModelFamilyMembersCached = unstable_cache(
	async (modelId: string) => {
		return fetchFamilyMembers(modelId);
	},
	["data:model-family-members"],
	{ revalidate: 60 * 60 * 24, tags: ["data:models"] }
);

export default fetchFamilyMembers;
