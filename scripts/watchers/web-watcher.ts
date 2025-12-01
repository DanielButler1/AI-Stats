import { createAdminClient } from "../../apps/web/src/utils/supabase/admin";
import { runWebWatcher } from "../../apps/web/src/lib/watchers/web";

async function main() {
    const supabase = createAdminClient();
    const summary = await runWebWatcher(supabase);
    console.log("Web watcher summary:", JSON.stringify(summary, null, 2));
    if (summary.dbError) {
        console.error("Failed to persist updates:", summary.dbError);
        process.exitCode = 1;
    }
}

main().catch((error) => {
    console.error("Web watcher execution failed:", error);
    process.exitCode = 1;
});
