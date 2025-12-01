import { join } from "path";
import { DIR_BENCHMARKS } from "../paths";
import { listDirs, readJson } from "../util";
import { client, isDryRun, logWrite, assertOk, pruneRowsByColumn } from "../supa";

export async function loadBenchmarks() {
    const dirs = await listDirs(DIR_BENCHMARKS);
    const supa = client();
    const benchmarkIds = new Set<string>();
    for (const d of dirs) {
        const j = await readJson<any>(join(d, "benchmark.json"));

        const row = {
            id: j.benchmark_id,
            name: j.benchmark_name,
            category: j.category ?? null,
            ascending_order: j.ascending_order ?? true,
            link: j.link ?? null,
            total_models: j.total_models ?? 0,
        };

        if (row.id) benchmarkIds.add(row.id);

        if (isDryRun()) {
            logWrite("public.data_benchmarks", "UPSERT", row, { onConflict: "id" });
            continue;
        }

        const res = await supa.from("data_benchmarks").upsert(row, { onConflict: "id" });
        assertOk(res, "upsert data_benchmarks");
    }

    await pruneRowsByColumn(supa, "data_benchmarks", "id", benchmarkIds, "data_benchmarks");
}
