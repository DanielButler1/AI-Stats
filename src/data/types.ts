export interface Provider {
    provider_id: string;
    name: string;
    website: string | null;
    country_code: string | null;
    description: string | null;
    colour: string | null;
    twitter: string | null;
}

export interface Benchmark {
    id: string;
    name: string;
    description: string | null;
    link: string | null;
}

export interface BenchmarkResult {
    benchmark_id: string;
    score: number | string; // Added string type since your JSON uses string scores like "81.4%"
    is_self_reported: boolean | number; // Changed to allow number since your JSON uses 1.0
    source_link: string | null;
    other_info?: string | null; // Made optional as it's not always present
}

export interface APIProvider {
    api_provider_id: string;
    api_provider_name: string;
    description: string | null;
    link: string | null;
}

export interface Price {
    api_provider_id?: string | null; // ID reference to the API provider
    api_provider?: APIProvider | string; // Can be either the full API provider object or a string ID
    input_token_price: number | null;
    output_token_price: number | null;
    throughput: number | null;
    latency: number | null;
    source_link: string | null;
    other_info: string | null;
}

export interface Model {
    id: string;
    name: string;
    provider: string;
    status: string | null;
    previous_model_id: string | null;
    description: string | null;
    announced_date: string | null;
    release_date: string | null;
    input_context_length: number | null;
    output_context_length: number | null;
    license: string | null;
    multimodal: boolean | null;
    input_types: string[] | string | null; // Changed to allow string since your JSON uses "image,text"
    output_types: string[] | string | null; // Same as above
    web_access: boolean | null;
    reasoning: boolean | null;
    fine_tunable: boolean | null;
    knowledge_cutoff: string | null;
    api_reference_link: string | null;
    playground_link: string | null;
    paper_link: string | null;
    announcement_link: string | null;
    repository_link: string | null;
    weights_link: string | null;
    parameter_count: number | null;
    training_tokens: number | null;
    benchmark_results: BenchmarkResult[] | null;
    prices: Price[] | null;
}

export interface ExtendedModel {
    id: string;
    name: string;
    status: string | null;
    previous_model_id: string | null;
    description: string | null;
    announced_date: string | null;
    release_date: string | null;
    input_context_length: number | null;
    output_context_length: number | null;
    license: string | null;
    multimodal: boolean | null;
    input_types: string[] | string | null;
    output_types: string[] | string | null;
    web_access: boolean | null;
    reasoning: boolean | null;
    fine_tunable: boolean | null;
    knowledge_cutoff: string | null;
    api_reference_link: string | null;
    playground_link: string | null;
    paper_link: string | null;
    announcement_link: string | null;
    repository_link: string | null;
    weights_link: string | null;
    parameter_count: number | null;
    training_tokens: number | null;
    benchmark_results: Array<
        Omit<BenchmarkResult, "benchmark_id"> & {
            benchmark_id: string;
            benchmark: Benchmark;
        }
    > | null;
    prices: Price[] | null;
    provider: Provider;
    /**
     * AI Stats score derived from Glicko rating.
     */
    glickoRating?: {
        rating: number;
        rd: number;
        vol: number;
    };
}