import fs from 'fs/promises';
import path from 'path';
import type { Model, Provider, Benchmark, ExtendedModel, BenchmarkResult, APIProvider, Price } from '@/data/types';

const MODELS_DIR = path.join(process.cwd(), 'src/data/models');
const PROVIDERS_DIR = path.join(process.cwd(), 'src/data/providers');
const BENCHMARKS_DIR = path.join(process.cwd(), 'src/data/benchmarks');
const API_PROVIDERS_DIR = path.join(process.cwd(), 'src/data/api_providers');

// Glicko-2 parameters
const INITIAL_RATING = 1500;
const INITIAL_RD = 350;
const INITIAL_VOL = 0.06;
const TAU = 0.5;

interface GlickoPlayer {
    getRating(): number;
    getRd(): number;
    getVol(): number;
    update(): void;
}

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

async function initGlicko() {
    const settings = { tau: TAU, rating: INITIAL_RATING, rd: INITIAL_RD, vol: INITIAL_VOL };
    const mod: any = await import('glicko2');
    const Glicko2Class: any = mod.Glicko2 || mod.default?.Glicko2;
    if (!Glicko2Class) throw new Error('Failed to load Glicko2 constructor');
    return new Glicko2Class(settings);
}

async function calculateGlickoRatings(models: ExtendedModel[]): Promise<void> {
    try {
        const glicko2Instance = await initGlicko();
        const modelPlayers = new Map<string, GlickoPlayer>();
        models.forEach(model => { modelPlayers.set(model.id, glicko2Instance.makePlayer()); });
        const benchmarksByName: Record<string, { model: ExtendedModel; score: number }[]> = {};
        models.forEach(model => {
            if (Array.isArray(model.benchmark_results)) {
                model.benchmark_results.forEach(b => {
                    let numericScore: number;
                    if (typeof b.score === 'string') numericScore = parseFloat(b.score.replace('%', ''));
                    else numericScore = b.score;
                    if (isNaN(numericScore)) numericScore = 0;
                    if (!benchmarksByName[b.benchmark.name]) benchmarksByName[b.benchmark.name] = [];
                    benchmarksByName[b.benchmark.name].push({ model, score: numericScore });
                });
            }
        });
        Object.values(benchmarksByName).forEach(entries => {
            const matches: [GlickoPlayer, GlickoPlayer, number][] = [];
            for (let i = 0; i < entries.length; i++) {
                for (let j = i + 1; j < entries.length; j++) {
                    const e1 = entries[i];
                    const e2 = entries[j];
                    const p1 = modelPlayers.get(e1.model.id);
                    const p2 = modelPlayers.get(e2.model.id);
                    if (p1 && p2) {
                        const score = e1.score > e2.score ? 1 : e1.score < e2.score ? 0 : 0.5;
                        matches.push([p1, p2, score]);
                    }
                }
            }
            if (matches.length) glicko2Instance.updateRatings(matches);
        });
        models.forEach(model => {
            const player = modelPlayers.get(model.id);
            if (player) {
                model.glickoRating = {
                    rating: player.getRating(),
                    rd: player.getRd(),
                    vol: player.getVol(),
                };
            }
        });
    } catch {
        // ignore glicko errors
    }
}

export async function fetchAggregateData(): Promise<ExtendedModel[]> {
    const models: ExtendedModel[] = [];

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
                            model.benchmark_results.map(async br => {
                                const benchmarkData = await getBenchmark(br.benchmark_id);
                                if (benchmarkData) {
                                    return { ...br, benchmark: benchmarkData };
                                }
                                return {
                                    ...br,
                                    benchmark: { id: br.benchmark_id, name: br.benchmark_id, description: null, link: null },
                                };
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
                            parameter_count: model.parameter_count,
                            training_tokens: model.training_tokens,
                            provider: providerData,
                            benchmark_results: enrichedBenchmarkResults,
                            prices: enrichedPrices,
                        });
                    } else {
                        models.push({
                            ...model,
                            provider: {
                                provider_id: model.provider,
                                name: model.provider,
                                website: null,
                                country_code: null,
                                description: null,
                                colour: null,
                                twitter: null,
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
    await calculateGlickoRatings(models);
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

export async function fetchSearchData() {
    async function getProviders() {
        const providerFolders = await fs.readdir(PROVIDERS_DIR);
        const providers: any[] = [];
        for (const folder of providerFolders) {
            const providerPath = path.join(PROVIDERS_DIR, folder, 'provider.json');
            try {
                const data = await fs.readFile(providerPath, 'utf-8');
                const parsed = JSON.parse(data);
                providers.push({ ...parsed, type: 'Provider', provider: { id: parsed.id, name: parsed.name } });
            } catch {
                continue;
            }
        }
        return providers;
    }

    async function getModels() {
        const providerFolders = await fs.readdir(MODELS_DIR);
        const models: any[] = [];
        for (const provider of providerFolders) {
            const providerPath = path.join(MODELS_DIR, provider);
            const modelFolders = await fs.readdir(providerPath);
            let providerName = provider;
            try {
                const providerJsonPath = path.join(PROVIDERS_DIR, provider, 'provider.json');
                const providerData = await fs.readFile(providerJsonPath, 'utf-8');
                providerName = JSON.parse(providerData).name;
            } catch {
                // ignore
            }
            for (const model of modelFolders) {
                const modelJsonPath = path.join(providerPath, model, 'model.json');
                try {
                    const data = await fs.readFile(modelJsonPath, 'utf-8');
                    const parsed = JSON.parse(data);
                    models.push({ ...parsed, provider: { id: provider, name: providerName }, type: 'Model' });
                } catch {
                    continue;
                }
            }
        }
        return models;
    }

    async function getBenchmarks() {
        const benchmarkFolders = await fs.readdir(BENCHMARKS_DIR);
        const benchmarks: any[] = [];
        for (const folder of benchmarkFolders) {
            const benchmarkPath = path.join(BENCHMARKS_DIR, folder, 'benchmark.json');
            try {
                const data = await fs.readFile(benchmarkPath, 'utf-8');
                const parsed = JSON.parse(data);
                benchmarks.push({ ...parsed, type: 'Benchmark' });
            } catch {
                continue;
            }
        }
        return benchmarks;
    }

    async function getApiProviders() {
        const providerFolders = await fs.readdir(API_PROVIDERS_DIR);
        const apiProviders: any[] = [];
        for (const folder of providerFolders) {
            const providerPath = path.join(API_PROVIDERS_DIR, folder, 'provider.json');
            try {
                const data = await fs.readFile(providerPath, 'utf-8');
                const parsed = JSON.parse(data);
                apiProviders.push({ ...parsed, type: 'API Provider' });
            } catch {
                continue;
            }
        }
        return apiProviders;
    }

    const [providers, models, benchmarks, apiProviders] = await Promise.all([
        getProviders(),
        getModels(),
        getBenchmarks(),
        getApiProviders(),
    ]);
    return [...providers, ...models, ...benchmarks, ...apiProviders];
}
