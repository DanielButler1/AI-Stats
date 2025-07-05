// validate.ts
import { z } from 'zod';
import { fetchAggregateData } from '../lib/fetchData';

/**
 * Schema definitions based on types.ts
 */
export const ProviderSchema = z.object({
    provider_id: z.string(),
    name: z.string(),
    website: z.string().nullable(),
    country_code: z.string().nullable(),
    description: z.string().nullable(),
    colour: z.string().nullable(),
    twitter: z.string().nullable(),
});

export const BenchmarkSchema = z.object({
    id: z.string(),
    name: z.string(),
    order: z.string().nullable(),
    description: z.string().nullable(),
    link: z.string().nullable(),
});

export const BenchmarkResultSchema = z.object({
    benchmark_id: z.string(),
    score: z.union([z.number(), z.string()]),
    is_self_reported: z.boolean(),
    source_link: z.string().nullable(),
    other_info: z.string().nullable().optional(),
});

export const APIProviderSchema = z.object({
    api_provider_id: z.string(),
    api_provider_name: z.string(),
    description: z.string().nullable(),
    link: z.string().nullable(),
});

export const PriceSchema = z.object({
    api_provider_id: z.string().nullable().optional(),
    api_provider: z.union([APIProviderSchema, z.string()]).optional(),
    input_token_price: z.union([z.number(), z.string()]).nullable(),
    cached_input_token_price: z.union([z.number(), z.string()]).nullable().optional(),
    output_token_price: z.union([z.number(), z.string()]).nullable(),
    throughput: z.union([z.number(), z.string()]).nullable(),
    latency: z.union([z.number(), z.string()]).nullable(),
    source_link: z.string().nullable(),
    other_info: z.string().nullable(),
});

export const ModelSchema = z.object({
    id: z.string(),
    name: z.string(),
    provider: z.string(),
    status: z.string().nullable(),
    previous_model_id: z.string().nullable(),
    description: z.string().nullable(),
    announced_date: z.string().nullable(),
    release_date: z.string().nullable(),
    deprecation_date: z.string().nullable().optional(),
    input_context_length: z.union([z.number(), z.string()]).nullable(),
    output_context_length: z.union([z.number(), z.string()]).nullable(),
    license: z.string().nullable(),
    multimodal: z.union([z.boolean(), z.string(), z.null()]),
    input_types: z.union([z.array(z.string()), z.string()]).nullable(),
    output_types: z.union([z.array(z.string()), z.string()]).nullable(),
    web_access: z.union([z.boolean(), z.string(), z.null()]),
    reasoning: z.union([z.boolean(), z.string(), z.null()]),
    fine_tunable: z.union([z.boolean(), z.string(), z.null()]),
    knowledge_cutoff: z.string().nullable(),
    api_reference_link: z.string().nullable(),
    playground_link: z.string().nullable(),
    paper_link: z.string().nullable(),
    announcement_link: z.string().nullable(),
    repository_link: z.string().nullable(),
    weights_link: z.string().nullable(),
    parameter_count: z.union([z.number(), z.string()]).nullable(),
    training_tokens: z.union([z.number(), z.string()]).nullable(),
    benchmark_results: z.array(BenchmarkResultSchema).nullable(),
    prices: z.array(PriceSchema).nullable(),
});

// Validation helpers
export function validateModel(data: unknown) {
    return ModelSchema.safeParse(data);
}

export function validateProvider(data: unknown) {
    return ProviderSchema.safeParse(data);
}

export function validateBenchmark(data: unknown) {
    return BenchmarkSchema.safeParse(data);
}

export function validateAPIProvider(data: unknown) {
    return APIProviderSchema.safeParse(data);
}

export function validatePrice(data: unknown) {
    return PriceSchema.safeParse(data);
}

// Helper to format Zod errors with context (e.g., benchmark name)
function formatModelErrors(model: any, error: z.ZodError): string[] {
    const formatted: string[] = [];
    const errorObj = error.format() as any;
    // Handle benchmark_results errors with context
    if (
        errorObj &&
        typeof errorObj === 'object' &&
        'benchmark_results' in errorObj &&
        Array.isArray(errorObj.benchmark_results)
    ) {
        errorObj.benchmark_results.forEach((brErr: any, idx: number) => {
            if (!brErr) return;
            const br = model.benchmark_results?.[idx];
            const benchName = br?.benchmark?.name || br?.benchmark_id || `#${idx}`;
            if (brErr.is_self_reported && brErr.is_self_reported._errors && brErr.is_self_reported._errors.length > 0) {
                formatted.push(`Benchmark '${benchName}' (index ${idx}): 'is_self_reported' is missing or not a boolean`);
            }
            // Add other field errors in benchmark_results
            for (const key in brErr) {
                if (key !== 'is_self_reported' && brErr[key] && brErr[key]._errors && brErr[key]._errors.length > 0) {
                    brErr[key]._errors.forEach((msg: string) => {
                        formatted.push(`Benchmark '${benchName}' (index ${idx}): '${key}' ${msg}`);
                    });
                }
            }
        });
    }
    // Handle prices errors with context
    if (
        errorObj &&
        typeof errorObj === 'object' &&
        'prices' in errorObj &&
        Array.isArray(errorObj.prices)
    ) {
        errorObj.prices.forEach((prErr: any, idx: number) => {
            if (!prErr) return;
            if (prErr.api_provider && prErr.api_provider._errors && prErr.api_provider._errors.length > 0) {
                formatted.push(`Price entry #${idx}: 'api_provider' is missing or not a string/object`);
            }
            for (const key in prErr) {
                if (key !== 'api_provider' && prErr[key] && prErr[key]._errors && prErr[key]._errors.length > 0) {
                    prErr[key]._errors.forEach((msg: string) => {
                        formatted.push(`Price entry #${idx}: '${key}' ${msg}`);
                    });
                }
            }
        });
    }
    // Handle top-level and other errors
    function walk(obj: any, path: string[] = []) {
        for (const key in obj) {
            if (key === '_errors' && obj._errors.length > 0) {
                obj._errors.forEach((msg: string) => {
                    // Prettify previous_model_id
                    if (path.join('.') === 'previous_model_id') {
                        formatted.push(`Previous model id '${model.previous_model_id}' does not exist in models`);
                    } else {
                        formatted.push(`${path.join('.')} - ${msg}`);
                    }
                });
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                walk(obj[key], path.concat(key));
            }
        }
    }
    walk(errorObj);
    return Array.from(new Set(formatted)); // dedupe
}

// Helper to classify major errors based on your requirements
function isMajorError(errorMsg: string): boolean {
    // Only flag as major if it matches the user's core requirements
    const majorPatterns = [
        /provider( |')?id('| )?('| )?is missing|provider id is missing|provider_id is missing|provider_id.*does not exist/i,
        /provider( |')?name('| )?is missing|provider name is missing/i,
        /benchmark( |')?id('| )?is missing|benchmark id is missing|benchmark_id.*does not exist/i,
        /benchmark( |')?name('| )?is missing|benchmark name is missing/i,
        /benchmark_results.*benchmark_id.*does not exist|benchmark_results.*benchmark_id.*is missing/i,
        /score.*is missing|score.*not a (number|string)/i,
        /api_provider( |')?id('| )?is missing|api_provider_id is missing|api_provider_id.*does not exist/i,
        /api_provider( |')?name('| )?is missing|api_provider name is missing/i,
        /price.*api_provider_id.*does not exist|price.*api_provider.*does not exist/i,
        /input_token_price.*is missing|output_token_price.*is missing/i,
        /model( |')?id('| )?is missing|model id is missing/i,
        /model( |')?name('| )?is missing|model name is missing/i,
        /provider.*does not exist in providers/i,
    ];
    return majorPatterns.some((pat) => pat.test(errorMsg));
}

async function main() {
    const errors: Record<string, string[]> = {};
    const majorErrors: Record<string, string[]> = {};
    const models = await fetchAggregateData();

    // Collect all valid IDs for cross-reference
    const providerIds = new Set<string>();
    const benchmarkIds = new Set<string>();
    const apiProviderIds = new Set<string>();
    const modelIds = new Set<string>();

    // Collect all IDs from the loaded data
    for (const model of models) {
        modelIds.add(model.id);
        if (model.provider && model.provider.provider_id) {
            providerIds.add(model.provider.provider_id);
        }
        if (Array.isArray(model.benchmark_results)) {
            for (const br of model.benchmark_results) {
                if (br.benchmark && br.benchmark.id) {
                    benchmarkIds.add(br.benchmark.id);
                } else if (br.benchmark_id) {
                    benchmarkIds.add(br.benchmark_id);
                }
            }
        }
        if (Array.isArray(model.prices)) {
            for (const price of model.prices) {
                if (price.api_provider_id) apiProviderIds.add(price.api_provider_id);
                if (typeof price.api_provider === 'string') apiProviderIds.add(price.api_provider);
                if (price.api_provider && typeof price.api_provider === 'object' && price.api_provider.api_provider_id) apiProviderIds.add(price.api_provider.api_provider_id);
            }
        }
    }

    // Validate models and cross-reference
    for (const model of models) {
        const modelErrors: string[] = [];
        // Schema validation
        const schemaResult = ModelSchema.safeParse({ ...model, provider: model.provider.provider_id });
        if (!schemaResult.success) {
            modelErrors.push(...formatModelErrors(model, schemaResult.error));
        }
        // provider
        if (model.provider && !providerIds.has(model.provider.provider_id)) {
            modelErrors.push(`provider '${model.provider.provider_id}' does not exist in providers`);
        }
        // previous_model_id
        if (model.previous_model_id && !modelIds.has(model.previous_model_id)) {
            modelErrors.push(`previous_model_id '${model.previous_model_id}' does not exist in models`);
        }
        // benchmark_results[].benchmark_id
        if (Array.isArray(model.benchmark_results)) {
            for (const br of model.benchmark_results) {
                const bid = br.benchmark ? br.benchmark.id : br.benchmark_id;
                if (bid && !benchmarkIds.has(bid)) {
                    modelErrors.push(`benchmark_results.benchmark_id '${bid}' does not exist in benchmarks`);
                }
            }
        }
        // prices[].api_provider_id or prices[].api_provider
        if (Array.isArray(model.prices)) {
            for (const price of model.prices) {
                if (price.api_provider_id && !apiProviderIds.has(price.api_provider_id)) {
                    modelErrors.push(`prices.api_provider_id '${price.api_provider_id}' does not exist in api_providers`);
                }
                if (typeof price.api_provider === 'string' && !apiProviderIds.has(price.api_provider)) {
                    modelErrors.push(`prices.api_provider '${price.api_provider}' does not exist in api_providers`);
                }
                if (
                    price.api_provider &&
                    typeof price.api_provider === 'object' &&
                    price.api_provider.api_provider_id &&
                    !apiProviderIds.has(price.api_provider.api_provider_id)
                ) {
                    modelErrors.push(`prices.api_provider object '${price.api_provider.api_provider_id}' does not exist in api_providers`);
                }
            }
        }
        if (modelErrors.length > 0) {
            errors[model.id] = modelErrors;
            // Collect major errors for this model
            const majors = modelErrors.filter(isMajorError);
            if (majors.length > 0) {
                majorErrors[model.id] = majors;
            }
        }
    }
    if (Object.keys(majorErrors).length > 0) {
        console.log('false');
        process.exit(2);
    } else {
        console.log('true');
        process.exit(0);
    }
}

if (require.main === module) {
    main();
}
