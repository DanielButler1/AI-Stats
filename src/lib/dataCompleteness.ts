import type { ExtendedModel, Benchmark, BenchmarkResult, Provider, APIProvider, Price } from "@/data/types";
import fs from 'fs';
import path from 'path';

interface CompletenessResult {
    total: number;
    completed: number;
}

// Internal safe directory reader
function safeReadJson<T>(jsonPath: string): T | null {
    try {
        const data = fs.readFileSync(jsonPath, 'utf8');
        return JSON.parse(data) as T;
    } catch {
        return null;
    }
}

function safeListDir(dir: string): string[] {
    try {
        return fs.readdirSync(dir);
    } catch {
        return [];
    }
}

// Calculate completeness for providers
export function getProviderCompleteness(): CompletenessResult {
    const providerFields: (keyof Provider)[] = [
        'provider_id',
        'name',
        'website',
        'country_code',
        'description',
        'colour',
        'socials'
    ];
    // Load all providers from the providers directory
    const dir = path.join(process.cwd(), 'src', 'data', 'providers');
    const providerNames = safeListDir(dir);
    const providers: Provider[] = providerNames.map(name => {
        const jsonPath = path.join(dir, name, 'provider.json');
        return safeReadJson<Provider>(jsonPath) as Provider;
    }).filter(Boolean) as Provider[];
    const total = providers.length * providerFields.length;
    let completed = 0;
    providers.forEach(provider => {
        providerFields.forEach(field => {
            if ((provider as any)[field] != null) completed++;
        });
    });
    return { total, completed };
}

// Calculate completeness for model fields
export function getModelFieldCompleteness(models: ExtendedModel[]): CompletenessResult {
    const modelFields: (keyof ExtendedModel)[] = [
        'id', 'name', 'provider', 'status', 'previous_model_id', 'description', 'announced_date',
        'release_date', 'deprecation_date', 'retirement_date', 'open_router_model_id', 'input_context_length', 'output_context_length', 'license', 'multimodal',
        'input_types', 'output_types', 'web_access', 'reasoning',
        'fine_tunable', 'knowledge_cutoff', 'api_reference_link', 'playground_link',
        'paper_link', 'announcement_link', 'repository_link', 'weights_link',
        'parameter_count', 'training_tokens'
    ];

    const total = models.length * modelFields.length;
    let completed = 0;

    models.forEach(model => {
        modelFields.forEach(field => {
            if ((model as any)[field] != null) completed++;
        });
    });
    return { total, completed };
}

// Calculate completeness for benchmark results fields
export function getBenchmarkCompleteness(models: ExtendedModel[], benchmarks: Benchmark[]): CompletenessResult {
    const benchFields: (keyof BenchmarkResult)[] = [
        'benchmark_id', 'score', 'is_self_reported', 'source_link', 'other_info'
    ];
    const total = models.length * benchmarks.length * benchFields.length;
    let completed = 0;
    // Date threshold: models released over 28 days ago are considered fully benchmarked
    // As this gives time for benchmarks to be run and reported - whilst also not being too long
    // Or too short to ensure the completeness is as accurate as possible
    const twentyEightDaysAgo = new Date();
    twentyEightDaysAgo.setDate(twentyEightDaysAgo.getDate() - 28);
    models.forEach(model => {
        // If model released more than 28 days ago, count all benchmark fields as completed
        if (model.release_date && new Date(model.release_date) < twentyEightDaysAgo) {
            completed += benchmarks.length * benchFields.length;
            return;
        }
        benchmarks.forEach(benchmark => {
            const result = model.benchmark_results?.find(r => r.benchmark_id === benchmark.id);
            benchFields.forEach(field => {
                if (result && (result as any)[field] != null) {
                    completed++;
                }
            });
        });
    });
    return { total, completed };
}

// Calculate completeness for pricing fields across models
export function getPricingCompleteness(models: ExtendedModel[]): CompletenessResult {
    const priceFields: (keyof Price)[] = [
        'api_provider', 'input_token_price', 'output_token_price',
        'throughput', 'latency', 'source_link', 'other_info'
    ];
    const total = models.length * priceFields.length;
    let completed = 0;
    models.forEach(model => {
        priceFields.forEach(field => {
            if (model.prices?.some(p => (p as any)[field] != null || (field === 'api_provider' && (p as any)['api_provider_id'] != null))) {
                completed++;
            }
        });
    });
    return { total, completed };
}

// Calculate completeness for benchmark definitions
export function getBenchmarkDefinitionCompleteness(): CompletenessResult {
    const benchFields: (keyof Benchmark)[] = ['id', 'name', 'description', 'link'];
    const dir = path.join(process.cwd(), 'src', 'data', 'benchmarks');
    const benchNames = safeListDir(dir);
    const benchmarks: Benchmark[] = benchNames.map(name => {
        const jsonPath = path.join(dir, name, 'benchmark.json');
        return safeReadJson<Benchmark>(jsonPath) as Benchmark;
    }).filter(Boolean) as Benchmark[];
    const total = benchmarks.length * benchFields.length;
    let completed = 0;
    benchmarks.forEach(b => benchFields.forEach(f => { if ((b as any)[f] != null) completed++; }));
    return { total, completed };
}

// Calculate completeness for API providers
export function getAPIProviderCompleteness(): CompletenessResult {
    const apiFields: (keyof APIProvider)[] = ['api_provider_id', 'api_provider_name', 'description', 'link'];
    const dir = path.join(process.cwd(), 'src', 'data', 'api_providers');
    const names = safeListDir(dir);
    const providers: APIProvider[] = names.map(name => {
        const jsonPath = path.join(dir, name, 'api_provider.json');
        return safeReadJson<APIProvider>(jsonPath) as APIProvider;
    }).filter(Boolean) as APIProvider[];
    const total = providers.length * apiFields.length;
    let completed = 0;
    providers.forEach(p => apiFields.forEach(f => { if ((p as any)[f] != null) completed++; }));
    return { total, completed };
}

// Infer benchmark definitions from models' benchmark_results when explicit list isn't provided
export function inferBenchmarksFromModels(models: ExtendedModel[]): Benchmark[] {
    const map = new Map<string, Benchmark>();
    models.forEach(m => {
        m.benchmark_results?.forEach(r => {
            if (!map.has(r.benchmark_id)) {
                map.set(r.benchmark_id, {
                    id: r.benchmark_id,
                    name: r.benchmark_id,
                    category: null,
                    order: r.benchmark_id,
                    description: null,
                    link: null,
                } as Benchmark);
            }
        });
    });
    return Array.from(map.values());
}

// Aggregate all completeness metrics into overall counts and percentage
export function getDataCompleteness(models: ExtendedModel[], benchmarks: Benchmark[] = []): { total: number; completed: number; percent: number } {
    // If no benchmarks provided, attempt to infer from models so we can compute server-side without FS reads
    const inferredBenchmarks = benchmarks && benchmarks.length > 0 ? benchmarks : inferBenchmarksFromModels(models);

    const prov = getProviderCompleteness();
    const apiProv = getAPIProviderCompleteness();
    const mod = getModelFieldCompleteness(models);
    const benchDefs = getBenchmarkDefinitionCompleteness();
    const benchRes = getBenchmarkCompleteness(models, inferredBenchmarks);
    const price = getPricingCompleteness(models);

    const total = prov.total + apiProv.total + mod.total + benchDefs.total + benchRes.total + price.total;
    const completed = prov.completed + apiProv.completed + mod.completed + benchDefs.completed + benchRes.completed + price.completed;
    const percent = total > 0 ? (completed / total) * 100 : 0;
    return { total, completed, percent };
}
