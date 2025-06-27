// validate.ts
import { z } from 'zod';
import fs from 'fs';
import path from 'path';

/**
 * Schema definitions based on types.ts
 */
const ProviderSchema = z.object({
    provider_id: z.string(),
    name: z.string(),
    website: z.string().nullable(),
    country_code: z.string().nullable(),
    description: z.string().nullable(),
    colour: z.string().nullable(),
    twitter: z.string().nullable(), // required, not optional
});

const BenchmarkSchema = z.object({
    id: z.string(),
    name: z.string(),
    order: z.string(),
    description: z.string().nullable(),
    link: z.string().nullable(),
});

const BenchmarkResultSchema = z.object({
    benchmark_id: z.string(),
    score: z.union([z.number(), z.string()]), // number or string
    is_self_reported: z.union([z.boolean(), z.number()]), // boolean or number
    source_link: z.string().nullable(),
    other_info: z.string().nullable().optional(),
});

const APIProviderSchema = z.object({
    api_provider_id: z.string(),
    api_provider_name: z.string(),
    description: z.string().nullable(),
    link: z.string().nullable(),
});

const PriceSchema = z.object({
    api_provider_id: z.string().nullable().optional(),
    api_provider: z.union([APIProviderSchema, z.string()]).optional(),
    input_token_price: z.number().nullable(),
    cached_input_token_price: z.number().nullable().optional(),
    output_token_price: z.number().nullable(),
    throughput: z.number().nullable(),
    latency: z.number().nullable(),
    source_link: z.string().nullable(),
    other_info: z.string().nullable(),
});

const ModelSchema = z.object({
    id: z.string(),
    name: z.string(),
    provider: z.string(),
    status: z.string().nullable(),
    previous_model_id: z.string().nullable(),
    description: z.string().nullable(),
    announced_date: z.string().nullable(),
    release_date: z.string().nullable(),
    input_context_length: z.number().nullable(),
    output_context_length: z.number().nullable(),
    license: z.string().nullable(),
    multimodal: z.boolean().nullable(),
    input_types: z.union([z.array(z.string()), z.string()]).nullable(),
    output_types: z.union([z.array(z.string()), z.string()]).nullable(),
    web_access: z.boolean().nullable(),
    reasoning: z.boolean().nullable(),
    fine_tunable: z.boolean().nullable(),
    knowledge_cutoff: z.string().nullable(),
    api_reference_link: z.string().nullable(),
    playground_link: z.string().nullable(),
    paper_link: z.string().nullable(),
    announcement_link: z.string().nullable(),
    repository_link: z.string().nullable(),
    weights_link: z.string().nullable(),
    parameter_count: z.number().nullable(),
    training_tokens: z.number().nullable(),
    benchmark_results: z.array(BenchmarkResultSchema).nullable(),
    prices: z.array(PriceSchema).nullable(),
});

// Helper to recursively get all JSON files in a directory
function getAllJsonFiles(dir: string): string[] {
    let results: string[] = [];
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            results = results.concat(getAllJsonFiles(filePath));
        } else if (file.endsWith('.json')) {
            results.push(filePath);
        }
    });
    return results;
}

// Validate a file against a schema
function validateFile(filePath: string, schema: z.ZodTypeAny) {
    const content = fs.readFileSync(filePath, 'utf-8');
    let data;
    try {
        data = JSON.parse(content);
    } catch {
        return { filePath, error: 'Invalid JSON' };
    }
    const result = schema.safeParse(data);
    if (!result.success) {
        return { filePath, error: result.error.format() };
    }
    return null;
}

// Helper to turn Zod formatted errors into human-readable explanations
type ZodFormattedError = Record<string, any>;

function explainZodError(error: ZodFormattedError, path: string[] = []): string[] {
    let explanations: string[] = [];
    for (const key in error) {
        if (key === '_errors') {
            for (const msg of error._errors) {
                if (path.length > 0) {
                    explanations.push(`${path.join('.')} - ${msg}`);
                } else {
                    explanations.push(msg);
                }
            }
        } else {
            explanations = explanations.concat(
                explainZodError(error[key], path.concat(key))
            );
        }
    }
    return explanations;
}

function main() {
    const baseDir = path.resolve(__dirname);
    const modelsDir = path.join(baseDir, 'models');
    const providersDir = path.join(baseDir, 'providers');

    const modelFiles = getAllJsonFiles(modelsDir);
    const providerFiles = getAllJsonFiles(providersDir);

    const errors: Record<string, string[]> = {};

    // Validate model files against updated ModelSchema
    for (const file of modelFiles) {
        const err = validateFile(file, ModelSchema);
        if (err) {
            if (err.error === 'Invalid JSON') {
                errors[file] = ['Invalid JSON'];
            } else if (typeof err.error === 'string') {
                errors[file] = [err.error];
            } else {
                errors[file] = explainZodError(err.error as ZodFormattedError);
            }
        }
    }

    // Validate provider files against updated ProviderSchema
    for (const file of providerFiles) {
        const err = validateFile(file, ProviderSchema);
        if (err) {
            if (err.error === 'Invalid JSON') {
                errors[file] = ['Invalid JSON'];
            } else if (typeof err.error === 'string') {
                errors[file] = [err.error];
            } else {
                errors[file] = explainZodError(err.error as ZodFormattedError);
            }
        }
    }

    if (Object.keys(errors).length === 0) {
        // eslint-disable-next-line no-console
        console.log('All model and provider files are valid!');
        process.exit(0);
    } else {
        // eslint-disable-next-line no-console
        console.error('Validation errors found:');
        for (const [file, errs] of Object.entries(errors)) {
            // eslint-disable-next-line no-console
            console.error(`\nFile: ${file}`);
            for (const explanation of errs) {
                // eslint-disable-next-line no-console
                console.error(`  - ${explanation}`);
            }
        }
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}
