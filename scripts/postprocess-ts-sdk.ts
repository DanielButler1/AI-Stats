import fs from "node:fs";
import path from "node:path";

function walk(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(full));
    } else if (entry.isFile() && entry.name.endsWith(".ts")) {
      files.push(full);
    }
  }
  return files;
}

function dedupeImports(filePath: string): boolean {
  const original = fs.readFileSync(filePath, "utf8");
  const lines = original.split(/\r?\n/);
  const seen = new Set<string>();
  const out: string[] = [];
  let changed = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("import")) {
      if (seen.has(trimmed)) {
        changed = true;
        continue;
      }
      seen.add(trimmed);
    }
    out.push(line);
  }

  if (changed) {
    fs.writeFileSync(filePath, out.join("\n"), "utf8");
  }
  return changed;
}

function main() {
  const genDir = path.join(__dirname, "..", "packages", "sdk-ts", "src", "gen");
  if (!fs.existsSync(genDir)) {
    console.warn("[postprocess-ts-sdk] Generated directory not found, skipping.");
    return;
  }
  const files = walk(genDir);
  let touched = 0;
  for (const file of files) {
    if (dedupeImports(file)) touched += 1;
  }
  if (touched > 0) {
    console.log(`[postprocess-ts-sdk] Deduped imports in ${touched} files`);
  }
}

main();
