import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const HISTORY_FILE = "apps/web/public/data/monitor-history.json";

function getChangedFiles(commit: string): string[] {
  try {
    const output = execSync(`git show --name-only --pretty="" ${commit}`, { encoding: "utf8" });
    return output.trim().split("\n").filter((line) => line.startsWith("apps/web/src/data/") && line.endsWith(".json"));
  } catch (error) {
    console.error("Error getting changed files:", error);
    return [];
  }
}

function getFileContent(commit: string, filePath: string): string | null {
  try {
    return execSync(`git show ${commit}:${filePath}`, { encoding: "utf8" });
  } catch (error) {
    return null;
  }
}

function getCommitDate(commit: string): string {
  try {
    return execSync(`git log -1 --format=%ci ${commit}`, { encoding: "utf8" }).trim();
  } catch (error) {
    return new Date().toISOString();
  }
}

function parseEntity(filePath: string): { entityType: string; entityName: string } {
  const parts = filePath.split("/");
  const dataIndex = parts.indexOf("data");
  if (dataIndex === -1) return { entityType: "unknown", entityName: "unknown" };

  const subdir = parts[dataIndex + 1];
  const filename = parts[parts.length - 1];

  if (subdir === "models") {
    return { entityType: "model", entityName: filename.replace(".json", "") };
  }

  if (subdir === "benchmarks") {
    return { entityType: "benchmark", entityName: filename.replace(".json", "") };
  }

  return { entityType: subdir, entityName: filename.replace(".json", "") };
}

function updateHistory(entry: any) {
  let history: any[] = [];

  if (fs.existsSync(HISTORY_FILE)) {
    try {
      history = JSON.parse(fs.readFileSync(HISTORY_FILE, "utf8"));
      if (!Array.isArray(history)) {
        history = [];
      }
    } catch {
      history = [];
    }
  }

  history.unshift(entry);
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2) + "\n", "utf8");
}

function main() {
  const commit = process.argv[2];
  if (!commit) {
    console.error("Usage: tsx scripts/update-monitor-history.ts <commit>");
    process.exit(1);
  }

  const changedFiles = getChangedFiles(commit);
  if (changedFiles.length === 0) {
    console.log("No relevant changes found.");
    return;
  }

  for (const file of changedFiles) {
    const content = getFileContent(commit, file);
    if (!content) continue;

    const entity = parseEntity(file);
    const timestamp = getCommitDate(commit);

    const entry = {
      entityType: entity.entityType,
      entityName: entity.entityName,
      file,
      commit,
      timestamp,
      content: (() => {
        try {
          return JSON.parse(content);
        } catch {
          return content;
        }
      })(),
    };

    updateHistory(entry);
  }

  console.log(`Updated monitor history for commit ${commit}`);
}

main();
