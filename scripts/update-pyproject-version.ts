import fs from "node:fs/promises";
import path from "node:path";

async function main() {
  const root = path.resolve(__dirname, "..");
  const pkgPath = path.join(root, "packages", "sdk-py", "package.json");
  const pyprojectPath = path.join(root, "packages", "sdk-py", "pyproject.toml");

  const [pkgRaw, pyprojectRaw] = await Promise.all([
    fs.readFile(pkgPath, "utf8"),
    fs.readFile(pyprojectPath, "utf8"),
  ]);

  const { version } = JSON.parse(pkgRaw);
  if (!version) {
    throw new Error("packages/sdk-py/package.json is missing a version");
  }

  const updated = pyprojectRaw.replace(/^(version\\s*=\\s*\").+?(\\")/m, `$1${version}$2`);

  if (updated === pyprojectRaw) {
    console.log("pyproject.toml already matched the workspace version");
    return;
  }

  await fs.writeFile(pyprojectPath, updated, "utf8");
  console.log(`pyproject.toml version synced to ${version}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
