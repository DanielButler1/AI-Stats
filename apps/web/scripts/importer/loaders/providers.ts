import { join } from "path";
import { DIR_PROVIDERS } from "../paths";
import { listDirs, readJson } from "../util";
import { client, isDryRun, logWrite, assertOk, pruneRowsByColumn } from "../supa";

export async function loadProviders() {
    const dirs = await listDirs(DIR_PROVIDERS);
    const supa = client();
    const providerIds = new Set<string>();
    for (const d of dirs) {
        const j = await readJson<any>(join(d, "api_provider.json"));

        const row = {
            api_provider_id: j.api_provider_id,
            api_provider_name: j.api_provider_name,
            description: j.description ?? null,
            link: j.link ?? null,
            country_code: j.country_code ?? null,
        };
        providerIds.add(row.api_provider_id);

        if (isDryRun()) {
            logWrite("public.data_api_providers", "UPSERT", row, { onConflict: "api_provider_id" });
            continue;
        }

        const res = await supa
            .from("data_api_providers")
            .upsert(row, { onConflict: "api_provider_id" });

        assertOk(res, "upsert data_api_providers");
    }

    await pruneRowsByColumn(supa, "data_api_providers", "api_provider_id", providerIds, "data_api_providers");
}
