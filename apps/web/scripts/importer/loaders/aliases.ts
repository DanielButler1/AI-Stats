import { join } from "path";
import { DIR_ALIASES } from "../paths";
import { listDirs, readJson } from "../util";
import { client, isDryRun, logWrite, assertOk, pruneRowsByColumn } from "../supa";

export async function loadAliases() {
    const dirs = await listDirs(DIR_ALIASES);
    const supa = client();
    const aliasSlugs = new Set<string>();

    for (const d of dirs) {
        const j = await readJson<any>(join(d, "alias.json"));

        const row = {
            alias_slug: j.alias_slug,
            resolved_model_id: j.resolved_model_id,
            channel: j.channel ?? "stable",
            is_enabled: !!j.is_enabled,
            notes: j.notes ?? null,
        };

        if (row.alias_slug) aliasSlugs.add(row.alias_slug);

        if (isDryRun()) {
            logWrite("public.data_aliases", "UPSERT", row, { onConflict: "alias_slug" });
            continue;
        }

        const res = await supa
            .from("data_aliases")
            .upsert(row, { onConflict: "alias_slug" });

        assertOk(res, "upsert data_aliases");
    }

    await pruneRowsByColumn(supa, "data_aliases", "alias_slug", aliasSlugs, "data_aliases");
}
