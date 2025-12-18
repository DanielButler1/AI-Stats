import { existsSync } from "fs";
import { resolve, dirname } from "path";
import { promises as fs } from "fs";
import { client, isDryRun, logWrite, assertOk } from "./supa";
import { loadPersistedState, DEFAULT_STATE_PATH } from "./state";
import type { FileRecord } from "./state";
import { DIR_MODELS, DIR_BENCHMARKS, DIR_FAMILIES, DIR_ORGS, DIR_PROVIDERS, DIR_PRICING, DIR_ALIASES } from "./paths";

export async function cleanDeleted() {
    const supa = client();
    const state = await loadPersistedState(DEFAULT_STATE_PATH);

    const toDelete: Array<{ path: string; meta: any }> = [];
    for (const [path, record] of Object.entries(state.files) as [string, FileRecord][]) {
        const fullPath = resolve(process.cwd(), path);
        if (!existsSync(fullPath)) {
            toDelete.push({ path, meta: record.meta });
        }
    }

    if (toDelete.length === 0) return;

    console.log(`Found ${toDelete.length} deleted files, cleaning database...`);

    const models: string[] = [];
    const benchmarks: string[] = [];
    const families: string[] = [];
    const organisations: string[] = [];
    const providers: string[] = [];
    const pricing: string[] = [];
    const aliases: string[] = [];

    for (const { path, meta } of toDelete) {
        if (path.startsWith(DIR_MODELS)) {
            if (meta?.model_id) models.push(meta.model_id);
        } else if (path.startsWith(DIR_BENCHMARKS)) {
            if (meta?.benchmark_id) benchmarks.push(meta.benchmark_id);
        } else if (path.startsWith(DIR_FAMILIES)) {
            if (meta?.family_id) families.push(meta.family_id);
        } else if (path.startsWith(DIR_ORGS)) {
            if (meta?.organisation_id) organisations.push(meta.organisation_id);
        } else if (path.startsWith(DIR_PROVIDERS)) {
            if (meta?.api_provider_id) providers.push(meta.api_provider_id);
        } else if (path.startsWith(DIR_PRICING)) {
            if (meta?.model_key) pricing.push(meta.model_key);
        } else if (path.startsWith(DIR_ALIASES)) {
            if (meta?.alias_slug) aliases.push(meta.alias_slug);
        }
        // Skip subscription plans for now
    }

    // Delete models and related (delete dependent rows first to avoid FK issues)
    if (models.length) {
        console.log(`Removing models from DB: ${models.join(", ")}`);
        if (isDryRun()) {
            for (const id of models) {
                logWrite("public.data_model_links", "DELETE", { model_id: id });
                logWrite("public.data_model_details", "DELETE", { model_id: id });
                logWrite("public.data_benchmark_results", "DELETE", { model_id: id });
                logWrite("public.data_models", "DELETE", { model_id: id });
            }
        } else {
            for (const id of models) {
                // remove children first
                assertOk(await supa.from("data_model_links").delete().eq("model_id", id), "delete data_model_links");
                assertOk(await supa.from("data_model_details").delete().eq("model_id", id), "delete data_model_details");
                assertOk(await supa.from("data_benchmark_results").delete().eq("model_id", id), "delete data_benchmark_results");
                // then remove the model row
                assertOk(await supa.from("data_models").delete().eq("model_id", id), "delete data_models");
            }
        }
    }

    // Organisations and links
    if (organisations.length) {
        if (isDryRun()) {
            for (const id of organisations) {
                logWrite("public.data_organisations", "DELETE", { organisation_id: id });
                logWrite("public.data_organisation_links", "DELETE", { organisation_id: id });
            }
        } else {
            for (const id of organisations) {
                assertOk(await supa.from("data_organisations").delete().eq("organisation_id", id), "delete data_organisations");
                assertOk(await supa.from("data_organisation_links").delete().eq("organisation_id", id), "delete data_organisation_links");
            }
        }
    }

    // Benchmarks
    if (benchmarks.length) {
        if (isDryRun()) {
            for (const id of benchmarks) logWrite("public.data_benchmarks", "DELETE", { id });
        } else {
            assertOk(await supa.from("data_benchmarks").delete().in("id", benchmarks), "delete data_benchmarks");
        }
    }

    // Families
    if (families.length) {
        if (isDryRun()) {
            for (const id of families) logWrite("public.data_model_families", "DELETE", { family_id: id });
        } else {
            assertOk(await supa.from("data_model_families").delete().in("family_id", families), "delete data_model_families");
        }
    }

    // Providers
    if (providers.length) {
        if (isDryRun()) {
            for (const id of providers) logWrite("public.data_api_providers", "DELETE", { api_provider_id: id });
        } else {
            assertOk(await supa.from("data_api_providers").delete().in("api_provider_id", providers), "delete data_api_providers");
        }
    }

    // Pricing
    if (pricing.length) {
        if (isDryRun()) {
            for (const key of pricing) {
                logWrite("public.data_api_provider_models", "DELETE", { id: key });
                logWrite("public.data_api_pricing_rules", "DELETE", { model_key: key });
            }
        } else {
            assertOk(await supa.from("data_api_provider_models").delete().in("id", pricing), "delete data_api_provider_models");
            assertOk(await supa.from("data_api_pricing_rules").delete().in("model_key", pricing), "delete data_api_pricing_rules");
        }
    }

    // Aliases
    if (aliases.length) {
        if (isDryRun()) {
            for (const slug of aliases) logWrite("public.data_aliases", "DELETE", { alias_slug: slug });
        } else {
            assertOk(await supa.from("data_aliases").delete().in("alias_slug", aliases), "delete data_aliases");
        }
    }

    // Update state
    const newFiles = { ...state.files };
    for (const { path } of toDelete) {
        delete newFiles[path];
    }
    await fs.mkdir(dirname(DEFAULT_STATE_PATH), { recursive: true });
    await fs.writeFile(DEFAULT_STATE_PATH, JSON.stringify({ version: state.version, files: newFiles }, null, 2));
}