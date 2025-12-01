import { createAdminClient } from "../../apps/web/src/utils/supabase/admin";
import { runYoutubeWatcher } from "../../apps/web/src/lib/watchers/youtube";

async function main() {
    const supabase = createAdminClient();
    const summary = await runYoutubeWatcher(supabase);
    console.log("YouTube watcher summary:", JSON.stringify(summary, null, 2));
    if (summary.dbError) {
        console.error("Failed to persist YouTube updates:", summary.dbError);
        process.exitCode = 1;
    }
}

main().catch((error) => {
    console.error("YouTube watcher execution failed:", error);
    process.exitCode = 1;
});
