export interface SocialLink {
    platform: 'twitter' | 'github' | 'instagram' | 'youtube' | 'linkedin' | 'reddit' | 'tiktok' | 'threads' | 'discord';
    url: string;
}

export interface Provider {
    provider_id: string;
    name: string;
    website: string | null;
    country_code: string | null;
    description: string | null;
    colour: string | null;
    socials: SocialLink[];        // instead of individual nullable fields
}

export interface Benchmark {
    id: string;
    name: string;
    category: string | null; // Category can be null if not specified
    order: string;
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
    cached_input_token_price: number | null;
    output_token_price: number | null;
    throughput: string | null;
    latency: string | null;
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
    deprecation_date: string | null;
    retirement_date: string | null;
    open_router_model_id: string | null; // Added for OpenRouter compatibility
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
    parameter_count: number | string | null;
    training_tokens: number | string | null;
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
    deprecation_date: string | null;
    retirement_date: string | null;
    open_router_model_id: string | null;
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
    valueScore?: number; // Optional value score for the model
}

export interface SubscriptionPlan {
    plan_id: string;
    plan_name: string;
    plan_provider_id: string;
    plan_description: string | null;
    plan_frequency: string | null; // e.g., "monthly", "yearly"
    plan_usd_price: number | null;
    plan_link: string | null;
    plan_other_info: string | null;
}

export interface SubscriptionPlanModels {
    plan_id: string;
    model_id: string;
    model_info: string;
    rate_limit: string | null; // e.g., "1000 requests/month"
    other_info: string | null; // Additional info if available
}

export interface SubscriptionPlanFeatures {
    plan_id: string;
    feature_name: string;
    feature_description: string | null;
    other_info: string | null; // Additional info if available
}

export interface SubscriptionPlans {
    plan_id: string;
    name: string;
    provider_id: string;
    description: string | null;
    frequency: string | null; // e.g., "monthly", "yearly"
    usd_price: number | null;
    link: string | null;
    other_info: string | null;
    models: SubscriptionPlanModels[] | null;
    features: SubscriptionPlanFeatures[] | null;
    provider_name?: string; // Optional provider name for display purposes
}