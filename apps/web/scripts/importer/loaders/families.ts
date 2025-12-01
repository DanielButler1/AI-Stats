import { join } from "path";
import { DIR_FAMILIES } from "../paths";
import { listDirs, readJson } from "../util";
import { client, isDryRun, logWrite, assertOk, pruneRowsByColumn } from "../supa";

export async function loadFamilies() {
    const dirs = await listDirs(DIR_FAMILIES);
    const supa = client();
    const familyIds = new Set<string>();
    for (const d of dirs) {
        const j = await readJson<any>(join(d, "family.json"));

        const row = {
            family_id: j.family_id,
            family_name: j.family_name,
            organisation_id: j.organisation_id,
            family_description: j.description ?? null,
        };

        if (row.family_id) familyIds.add(row.family_id);

        if (isDryRun()) {
            logWrite("public.data_model_families", "UPSERT", row, { onConflict: "family_id" });
            continue;
        }

        const res = await supa
            .from("data_model_families")
            .upsert(row, { onConflict: "family_id" });

        assertOk(res, "upsert data_model_families");
    }

    await pruneRowsByColumn(supa, "data_model_families", "family_id", familyIds, "data_model_families");
}
