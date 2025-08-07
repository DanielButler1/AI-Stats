import fs from 'fs/promises';
import path from 'path';
import type { Model, Provider, Benchmark, ExtendedModel, BenchmarkResult, APIProvider, Price } from '@/data/types';

const MODELS_DIR = path.join(process.cwd(), 'src/data/models');
const PROVIDERS_DIR = path.join(process.cwd(), 'src/data/providers');
const BENCHMARKS_DIR = path.join(process.cwd(), 'src/data/benchmarks');
const API_PROVIDERS_DIR = path.join(process.cwd(), 'src/data/api_providers');

const providerCache = new Map<string, Provider>();
const benchmarkCache = new Map<string, Benchmark>();
const apiProviderCache = new Map<string, APIProvider>();

async function getProvider(providerId: string): Promise<Provider | null> {
    if (providerCache.has(providerId)) return providerCache.get(providerId)!;
    const filePath = path.join(PROVIDERS_DIR, providerId, 'provider.json');
    try {
        const file = await fs.readFile(filePath, 'utf-8');
        const provider = JSON.parse(file) as Provider;
        providerCache.set(providerId, provider);
        return provider;
    } catch {
        return null;
    }
}

async function getBenchmark(benchmarkId: string): Promise<Benchmark | null> {
    if (benchmarkCache.has(benchmarkId)) return benchmarkCache.get(benchmarkId)!;
    const filePath = path.join(BENCHMARKS_DIR, benchmarkId, 'benchmark.json');
    try {
        const file = await fs.readFile(filePath, 'utf-8');
        const benchmark = JSON.parse(file) as Benchmark;
        benchmarkCache.set(benchmarkId, benchmark);
        return benchmark;
    } catch {
        return null;
    }
}

async function getAPIProvider(apiProviderId: string): Promise<APIProvider | null> {
    if (!apiProviderId) return null;
    if (apiProviderCache.has(apiProviderId)) return apiProviderCache.get(apiProviderId)!;
    const filePath = path.join(API_PROVIDERS_DIR, apiProviderId, 'api_provider.json');
    try {
        await fs.access(path.dirname(filePath));
        const file = await fs.readFile(filePath, 'utf-8');
        const apiProvider = JSON.parse(file) as APIProvider;
        apiProviderCache.set(apiProviderId, apiProvider);
        return apiProvider;
    } catch {
        return null;
    }
}

export async function fetchAggregateData(): Promise<ExtendedModel[]> {
    const models: ExtendedModel[] = [];

    // helper to parse possibly-string numbers
    const toNumberOrNull = (v: number | string | null | undefined): number | null => {
        if (v === null || v === undefined) return null;
        if (typeof v === 'number') return v;
        const n = Number(String(v).replace(/[,\s]/g, ''));
        return Number.isFinite(n) ? n : null;
    };

    async function walkModels(dir: string) {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                await walkModels(fullPath);
            } else if (entry.name === 'model.json') {
                try {
                    const file = await fs.readFile(fullPath, 'utf-8');
                    const model = JSON.parse(file) as Model;
                    const providerData = await getProvider(model.provider);
                    let enrichedBenchmarkResults: Array<Omit<BenchmarkResult, 'benchmark_id'> & { benchmark_id: string; benchmark: Benchmark; }> | null = null;
                    if (model.benchmark_results) {
                        enrichedBenchmarkResults = await Promise.all(
                            model.benchmark_results.map(async (br) => {
                                const benchmarkData = await getBenchmark(br.benchmark_id);
                                if (benchmarkData) {
                                    return { ...br, benchmark_id: br.benchmark_id, benchmark: benchmarkData };
                                }
                                // Provide a fully-typed fallback Benchmark (include required fields like category)
                                const fallback: Benchmark = {
                                    id: br.benchmark_id,
                                    name: br.benchmark_id,
                                    category: null,
                                    order: '',
                                    description: '',
                                    link: ''
                                };
                                return { ...br, benchmark_id: br.benchmark_id, benchmark: fallback };
                            })
                        );
                    }
                    let enrichedPrices: Price[] | null = null;
                    if (model.prices) {
                        enrichedPrices = await Promise.all(
                            model.prices.map(async price => {
                                const providerId = price.api_provider_id || (typeof price.api_provider === 'string' ? price.api_provider : null);
                                if (providerId) {
                                    const apiProviderData = await getAPIProvider(providerId);
                                    if (apiProviderData) {
                                        return { ...price, api_provider: apiProviderData };
                                    }
                                }
                                return price;
                            })
                        );
                    }
                    if (providerData) {
                        models.push({
                            id: model.id,
                            name: model.name,
                            status: model.status,
                            previous_model_id: model.previous_model_id,
                            description: model.description,
                            announced_date: model.announced_date,
                            release_date: model.release_date,
                            deprecation_date: model.deprecation_date,
                            retirement_date: model.retirement_date,
                            open_router_model_id: model.open_router_model_id,
                            input_context_length: model.input_context_length,
                            output_context_length: model.output_context_length,
                            license: model.license,
                            multimodal: model.multimodal,
                            input_types: model.input_types,
                            output_types: model.output_types,
                            web_access: model.web_access,
                            reasoning: model.reasoning,
                            fine_tunable: model.fine_tunable,
                            knowledge_cutoff: model.knowledge_cutoff,
                            api_reference_link: model.api_reference_link,
                            playground_link: model.playground_link,
                            paper_link: model.paper_link,
                            announcement_link: model.announcement_link,
                            repository_link: model.repository_link,
                            weights_link: model.weights_link,
                            parameter_count: toNumberOrNull(model.parameter_count),
                            training_tokens: toNumberOrNull(model.training_tokens),
                            provider: providerData,
                            benchmark_results: enrichedBenchmarkResults,
                            prices: enrichedPrices,
                        });
                    } else {
                        models.push({
                            ...model,
                            // ensure numeric fields are coerced per ExtendedModel expectations
                            parameter_count: toNumberOrNull(model.parameter_count),
                            training_tokens: toNumberOrNull(model.training_tokens),
                            provider: {
                                provider_id: model.provider,
                                name: model.provider,
                                website: null,
                                country_code: null,
                                description: null,
                                colour: null,
                                socials: [],
                            },
                            benchmark_results: enrichedBenchmarkResults,
                            prices: enrichedPrices,
                        } as ExtendedModel);
                    }
                } catch {
                    // ignore invalid models
                }
            }
        }
    }

    await walkModels(MODELS_DIR);
    return models;
}

export interface EnhancedBenchmark extends Benchmark {
    usage: number;
    hasSourceLink: boolean;
}

export async function fetchBenchmarks(): Promise<EnhancedBenchmark[]> {
    async function getAllBenchmarks(): Promise<Benchmark[]> {
        const entries = await fs.readdir(BENCHMARKS_DIR, { withFileTypes: true });
        const benchmarks: Benchmark[] = [];
        for (const entry of entries) {
            if (entry.isDirectory()) {
                const benchmarkPath = path.join(BENCHMARKS_DIR, entry.name, 'benchmark.json');
                try {
                    const file = await fs.readFile(benchmarkPath, 'utf-8');
                    benchmarks.push(JSON.parse(file));
                } catch {
                    continue;
                }
            }
        }
        return benchmarks;
    }

    async function getBenchmarkUsage() {
        const usage: Record<string, number> = {};
        const links: Record<string, boolean> = {};
        async function walk(dir: string) {
            const entries = await fs.readdir(dir, { withFileTypes: true });
            for (const entry of entries) {
                const fullPath = path.join(dir, entry.name);
                if (entry.isDirectory()) await walk(fullPath);
                else if (entry.name === 'model.json') {
                    try {
                        const file = await fs.readFile(fullPath, 'utf-8');
                        const model = JSON.parse(file);
                        if (Array.isArray(model.benchmark_results)) {
                            for (const result of model.benchmark_results) {
                                const id = result.benchmark_id || (result.benchmark && result.benchmark.id) || result.name;
                                if (id) {
                                    usage[id] = (usage[id] || 0) + 1;
                                    if (result.source_link) links[id] = true;
                                }
                            }
                        }
                    } catch {
                        // ignore
                    }
                }
            }
        }
        await walk(MODELS_DIR);
        return { usage, links };
    }

    const benchmarks = await getAllBenchmarks();
    const { usage, links } = await getBenchmarkUsage();
    return benchmarks.map(b => ({ ...b, usage: usage[b.id] || 0, hasSourceLink: !!links[b.id] }));
}

/**
 * Fetches and collates all subscription plan JSON files into a single array,
 * enriching each plan with model names and provider names.
 */
export async function fetchAllSubscriptionPlans(): Promise<any[]> {
    const plansDir = path.join(process.cwd(), 'src/data/subscription_plans');
    const planFolders = await fs.readdir(plansDir);
    const plans: any[] = [];

    // Build model and provider lookup tables
    const modelsDir = path.join(process.cwd(), 'src/data/models');
    const providersDir = path.join(process.cwd(), 'src/data/providers');
    const modelNameMap: Record<string, string> = {};
    const providerNameMap: Record<string, string> = {};

    // Get all models
    const providerFolders = await fs.readdir(modelsDir);
    for (const provider of providerFolders) {
        const providerPath = path.join(modelsDir, provider);
        const modelFolders = await fs.readdir(providerPath);
        for (const model of modelFolders) {
            const modelJsonPath = path.join(providerPath, model, 'model.json');
            try {
                const data = await fs.readFile(modelJsonPath, 'utf-8');
                const parsed = JSON.parse(data);
                modelNameMap[parsed.id] = parsed.name;
            } catch {
                continue;
            }
        }
    }
    // Get all providers
    const providerFolders2 = await fs.readdir(providersDir);
    for (const folder of providerFolders2) {
        const providerPath = path.join(providersDir, folder, 'provider.json');
        try {
            const data = await fs.readFile(providerPath, 'utf-8');
            const parsed = JSON.parse(data);
            providerNameMap[parsed.provider_id] = parsed.name;
        } catch {
            continue;
        }
    }
    // Read and enrich plans
    for (const folder of planFolders) {
        const planPath = path.join(plansDir, folder, 'plan.json');
        try {
            const file = await fs.readFile(planPath, 'utf-8');
            const plan = JSON.parse(file);
            // Enrich models
            if (Array.isArray(plan.models)) {
                plan.models = plan.models.map((m: any) => ({
                    ...m,
                    name: modelNameMap[m.model_id] || m.model_id,
                }));
            }
            // Enrich provider
            if (plan.provider_id) {
                plan.provider_name = providerNameMap[plan.provider_id] || plan.provider_id;
            }
            plans.push(plan);
        } catch {
            continue;
        }
    }
    return plans;
}
