// apps/web/scripts/importer/util.ts
import { promises as fs } from "fs";
import { join } from "path";

const VERBOSE = process.argv.includes("--verbose");

export async function readJson<T = any>(p: string): Promise<T> {
    return JSON.parse(await fs.readFile(p, "utf-8"));
}

export async function listDirs(dir: string): Promise<string[]> {
    try {
        const ents = await fs.readdir(dir, { withFileTypes: true });
        const dirs = ents.filter(e => e.isDirectory()).map(e => join(dir, e.name));
        if (VERBOSE) console.log(`[listDirs] ${dir} -> ${dirs.length} dirs`);
        return dirs;
    } catch (e: any) {
        if (VERBOSE) console.log(`[listDirs] ${dir} -> (missing)`);
        return [];
    }
}

export function chunk<T>(arr: T[], n: number): T[][] {
    const out: T[][] = [];
    for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
    return out;
}

export function toInList(values: string[]): string {
    return `(${values.map(v => JSON.stringify(v)).join(",")})`;
}

