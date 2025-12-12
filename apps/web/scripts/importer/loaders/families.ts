import { join } from "path";
import { DIR_FAMILIES } from "../paths";
import { listDirs, readJsonWithHash } from "../util";
import { client, isDryRun, logWrite, assertOk, pruneRowsByColumn } from "../supa";
import { ChangeTracker } from "../state";

export async function loadFamilies(tracker: ChangeTracker) {
    tracker.touchPrefix(DIR_FAMILIES);
    const dirs = await listDirs(DIR_FAMILIES);
    const supa = client();
    const familyIds = new Set<string>();
    let touched = false;
    for (const d of dirs) {
        const fp = join(d, "family.json");
        const { data: j, hash } = await readJsonWithHash<any>(fp);
        const change = tracker.track(fp, hash, { family_id: j.family_id });

        const row = {
            family_id: j.family_id,
            family_name: j.family_name,
            organisation_id: j.organisation_id,
            family_description: j.description ?? null,
        };

        if (row.family_id) familyIds.add(row.family_id);
        if (change.status === "unchanged") continue;
        touched = true;

        if (isDryRun()) {
            logWrite("public.data_model_families", "UPSERT", row, { onConflict: "family_id" });
            continue;
        }

        const res = await supa
            .from("data_model_families")
            .upsert(row, { onConflict: "family_id" });

        assertOk(res, "upsert data_model_families");
    }

    const deletions = tracker.getDeleted(DIR_FAMILIES);
    touched = touched || deletions.length > 0;
    if (!touched) return;

    await pruneRowsByColumn(supa, "data_model_families", "family_id", familyIds, "data_model_families");
}
