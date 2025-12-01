import { join } from "path";
import { DIR_ORGS } from "../paths";
import { listDirs, readJson } from "../util";
import { client, isDryRun, logWrite, assertOk, pruneRowsByColumn } from "../supa";

export async function loadOrganisations() {
    const dirs = await listDirs(DIR_ORGS);
    const supa = client();
    const organisationIds = new Set<string>();
    for (const d of dirs) {
        const j = await readJson<any>(join(d, "organisation.json"));

        const orgRow = {
            organisation_id: j.organisation_id,
            name: j.name,
            country_code: j.country_code,
            description: j.description ?? null,
            colour: j.colour ?? null,
        };

        const links = (j.organisation_links ?? []) as Array<{ platform: string; url: string }>;
        const linkRows = links.map(l => ({
            organisation_id: j.organisation_id,
            platform: l.platform,
            url: l.url,
        }));
        const platformsIncoming = new Set(links.map(l => l.platform));
        organisationIds.add(j.organisation_id);

        if (isDryRun()) {
            logWrite("public.data_organisations", "UPSERT", orgRow, { onConflict: "organisation_id" });
            for (const row of linkRows) {
                logWrite("public.data_organisation_links", "UPSERT", row, { onConflict: "organisation_id,platform" });
            }
            // (In dry-run we won’t prune)
            continue;
        }

        // 1) Upsert organisation
        assertOk(
            await supa.from("data_organisations").upsert(orgRow, { onConflict: "organisation_id" }),
            "upsert data_organisations"
        );

        // 2) Upsert/replace links by (organisation_id, platform)
        if (linkRows.length) {
            assertOk(
                await supa
                    .from("data_organisation_links")
                    .upsert(linkRows, { onConflict: "organisation_id,platform", ignoreDuplicates: false }),
                "upsert data_organisation_links"
            );
        }

        // 3) Prune links that no longer exist in source
        const existing = await supa
            .from("data_organisation_links")
            .select("platform")
            .eq("organisation_id", j.organisation_id);

        assertOk(existing, "select existing org links");

        const toDelete = (existing.data ?? [])
            .map(r => r.platform)
            .filter(p => !platformsIncoming.has(p));

        if (toDelete.length) {
            assertOk(
                await supa
                    .from("data_organisation_links")
                    .delete()
                    .eq("organisation_id", j.organisation_id)
                    .in("platform", toDelete),
                "delete stale data_organisation_links"
            );
        }
    }

    await pruneRowsByColumn(supa, "data_organisations", "organisation_id", organisationIds, "data_organisations");
    await pruneRowsByColumn(supa, "data_organisation_links", "organisation_id", organisationIds, "data_organisation_links");
}
