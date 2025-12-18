import "dotenv/config";
import { isDryRun } from "./supa";
import { ChangeTracker } from "./state";
import { cleanDeleted } from "./cleanup";
import { loadModels } from "./loaders/models";
import { loadPricing } from "./loaders/pricing";
import { loadAliases } from "./loaders/aliases";
import { loadProviders } from "./loaders/providers";
import { loadBenchmarks } from "./loaders/benchmarks";
import { loadFamilies } from "./loaders/families";
import { loadOrganisations } from "./loaders/organisations";
import { loadSubscriptionPlans } from "./loaders/subscription_plans";
import { DATA_ROOT } from "./paths";

const VERBOSE = process.argv.includes("--verbose");

const tasks: Record<string, (tracker: ChangeTracker) => Promise<void>> = {
    families: loadFamilies,
    models: loadModels,
    pricing: loadPricing,
    benchmarks: loadBenchmarks,
    organisations: loadOrganisations,
    providers: loadProviders,
    aliases: loadAliases,
    subscription_plans: loadSubscriptionPlans,
    all: async tracker => {
        await loadOrganisations(tracker);
        await loadBenchmarks(tracker);
        await loadFamilies(tracker);
        await loadModels(tracker);
        await loadAliases(tracker); // optional: if you have the aliases loader
        await loadProviders(tracker);
        await loadPricing(tracker);
        await loadSubscriptionPlans(tracker);
    },
};

async function main() {
    await cleanDeleted();
    const tracker = await ChangeTracker.init();

    const section = (process.argv.find(a => a.startsWith("--section="))?.split("=")[1]) || "all";
    const fn = tasks[section];
    if (!fn) {
        console.error(`Unknown section '${section}'. Use one of: ${Object.keys(tasks).join(", ")}`);
        process.exit(1);
    }

    if (isDryRun()) console.log("==================== DRY RUN (no writes) ====================");
    if (VERBOSE) console.log(`DATA_ROOT: ${DATA_ROOT}`);

    console.log(`>> Importing: ${section}`);
    await fn(tracker);
    await tracker.persist({ dryRun: isDryRun() });
    console.log(">> Done.");
}

main().catch(err => { console.error(err); process.exit(1); });
