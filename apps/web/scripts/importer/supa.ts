import * as path from "path";
import * as dotenv from "dotenv";
import { createAdminClient } from "../../src/utils/supabase/admin";
import { toInList } from "./util";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const DRY_RUN = process.argv.includes("--dry-run") || process.env.DRY_RUN === "1";

export function isDryRun() { return DRY_RUN; }

export function client() {
    const c = createAdminClient();
    return c;
}

export function logWrite(table: string, op: string, payload: unknown, extra?: Record<string, any>) {
    if (!DRY_RUN) return;
    const one = JSON.stringify(payload, null, 2);
    console.log(`🔎 DRY-RUN ${op} -> ${table}`);
    console.log(one);
    if (extra) console.log("  extra:", extra);
}

/** Small helper to throw on Supabase errors with context */
export function assertOk<T>(res: { data: T | null, error: any }, ctx: string) {
    if (res.error) {
        throw new Error(`${ctx}: ${res.error.message || res.error}`);
    }
    return res.data as T;
}

export async function pruneRowsByColumn(
    supa: ReturnType<typeof createAdminClient>,
    table: string,
    column: string,
    keep: Set<string>,
    ctx: string
) {
    if (isDryRun()) {
        logWrite(table, "PRUNE", { column, keep: Array.from(keep) });
        return;
    }

    if (keep.size === 0) {
        const res = await supa.from(table).delete();
        assertOk(res, `${ctx} (delete all)`);
        return;
    }

    const list = toInList(Array.from(keep));
    const res = await supa.from(table).delete().not(column, "in", list);
    assertOk(res, `${ctx} (prune by ${column})`);
}
