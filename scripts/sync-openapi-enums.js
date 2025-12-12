const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

const ROOT = path.join(__dirname, "..");
const OPENAPI_PATH = path.join(ROOT, "apps", "docs", "openapi", "v1", "openapi.yaml");
const MANIFEST_PATH = path.join(ROOT, "apps", "web", "src", "data", "manifest.json");
const BENCHMARKS_DIR = path.join(ROOT, "apps", "web", "src", "data", "benchmarks");

function readYaml(file) {
    return yaml.load(fs.readFileSync(file, "utf8"));
}

function readJson(file) {
    return JSON.parse(fs.readFileSync(file, "utf8"));
}

function uniqSorted(list) {
    return Array.from(new Set(list)).sort((a, b) => a.localeCompare(b));
}

function loadModelIds() {
    const manifest = readJson(MANIFEST_PATH);
    const models = manifest.models ?? {};
    const modelIds = Object.values(models).flat().filter(Boolean);
    return uniqSorted(modelIds);
}

function loadOrganisationIds() {
    const manifest = readJson(MANIFEST_PATH);
    const organisations = manifest.organisations ?? [];
    return uniqSorted(organisations);
}

function loadBenchmarkIds() {
    if (!fs.existsSync(BENCHMARKS_DIR)) return [];
    const entries = fs.readdirSync(BENCHMARKS_DIR, { withFileTypes: true });
    const ids = [];
    for (const entry of entries) {
        if (!entry.isDirectory()) continue;
        const file = path.join(BENCHMARKS_DIR, entry.name, "benchmark.json");
        if (!fs.existsSync(file)) continue;
        try {
            const data = readJson(file);
            if (data?.benchmark_id) ids.push(String(data.benchmark_id));
        } catch (err) {
            console.warn(`Skipping benchmark ${entry.name}: ${err.message}`);
        }
    }
    return uniqSorted(ids);
}

function applyOrganisationSchema(target) {
    if (!target) return;
    const description = target.description;
    target.oneOf = [
        { $ref: "#/components/schemas/OrganisationId" },
        { type: "null" },
    ];
    delete target.type;
    delete target.enum;
    delete target.nullable;
    if (description) target.description = description;
}

function main() {
    const modelIds = loadModelIds();
    const organisationIds = loadOrganisationIds();
    const benchmarkIds = loadBenchmarkIds();

    const openapi = readYaml(OPENAPI_PATH);
    const schemas = openapi.components?.schemas;
    if (!schemas) {
        throw new Error("Schemas not found in OpenAPI document");
    }

    // Ensure ModelId schema exists
    if (!schemas.ModelId) {
        schemas.ModelId = {
            type: "string",
            description: "Model identifier.",
            enum: []
        };
    }

    // Sync model ids
    schemas.ModelId.enum = modelIds;

    // Sync organisation ids
    schemas.OrganisationId = {
        type: "string",
        description: "Organisation identifier.",
        enum: organisationIds,
    };
    applyOrganisationSchema(schemas.GatewayModel?.properties?.organisation);
    applyOrganisationSchema(schemas.GatewayOrganisation?.properties?.organisation_id);

    // Sync benchmark ids
    schemas.BenchmarkId = {
        type: "string",
        description: "Benchmark identifier.",
        enum: benchmarkIds,
    };

    // Update path parameters to reference enums
    for (const [pathKey, pathItem] of Object.entries(openapi.paths || {})) {
        for (const method of ["get", "post", "put", "delete", "patch", "options", "head"]) {
            const op = pathItem?.[method];
            if (!op?.parameters) continue;
            for (const param of op.parameters) {
                if (param?.name === "model" && param.schema) {
                    param.schema = { $ref: "#/components/schemas/ModelId" };
                }
                if (param?.name === "organisation" && param.schema) {
                    const desc = param.description;
                    param.schema = {
                        oneOf: [
                            { $ref: "#/components/schemas/OrganisationId" },
                            { type: "array", items: { $ref: "#/components/schemas/OrganisationId" } },
                        ],
                    };
                    if (desc) param.description = desc;
                }
            }
        }
    }

    fs.writeFileSync(OPENAPI_PATH, yaml.dump(openapi, { indent: 2 }));

    console.log(`Synced enums -> models: ${modelIds.length}, organisations: ${organisationIds.length}, benchmarks: ${benchmarkIds.length}`);
}

main();
