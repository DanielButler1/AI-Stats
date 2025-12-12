import { join } from "path";
import { DIR_PROVIDERS } from "../paths";
import { listDirs, readJsonWithHash } from "../util";
import { client, isDryRun, logWrite, assertOk, pruneRowsByColumn } from "../supa";
import { ChangeTracker } from "../state";

export async function loadProviders(tracker: ChangeTracker) {
    tracker.touchPrefix(DIR_PROVIDERS);
    const dirs = await listDirs(DIR_PROVIDERS);
    const supa = client();
    const providerIds = new Set<string>();
    let touched = false;
    for (const d of dirs) {
        const fp = join(d, "api_provider.json");
        const { data: j, hash } = await readJsonWithHash<any>(fp);
        const change = tracker.track(fp, hash, { api_provider_id: j.api_provider_id });

        const row = {
            api_provider_id: j.api_provider_id,
            api_provider_name: j.api_provider_name,
            description: j.description ?? null,
            link: j.link ?? null,
            country_code: j.country_code ?? null,
        };
        providerIds.add(row.api_provider_id);
        if (change.status === "unchanged") continue;
        touched = true;

        if (isDryRun()) {
            logWrite("public.data_api_providers", "UPSERT", row, { onConflict: "api_provider_id" });
            continue;
        }

        const res = await supa
            .from("data_api_providers")
            .upsert(row, { onConflict: "api_provider_id" });

        assertOk(res, "upsert data_api_providers");
    }

    const deletions = tracker.getDeleted(DIR_PROVIDERS);
    touched = touched || deletions.length > 0;
    if (!touched) return;

    await pruneRowsByColumn(supa, "data_api_providers", "api_provider_id", providerIds, "data_api_providers");
}
