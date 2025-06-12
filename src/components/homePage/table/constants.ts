export const FEATURED_QUICK_FILTERS = [
    { id: "multimodal", label: "Multimodal" },
    { id: "open", label: "Open Models" },
    { id: "long-context", label: "Long Context" },
    { id: "small", label: "Small Models (<8B)" },
] as const;

export const PROVIDER_QUICK_FILTERS = [
    { id: "openai", label: "OpenAI" },
    { id: "anthropic", label: "Anthropic" },
    { id: "google", label: "Google" },
    { id: "meta", label: "Meta" },
    { id: "qwen", label: "Qwen" },
    { id: "mistral", label: "Mistral" },
    { id: "deepseek", label: "Deepseek" },
    { id: "x-ai", label: "xAI" },
] as const;

export const CONTEXT_LENGTH_RANGES = [
    { id: "0-16k", label: "0-16K", min: 0, max: 16384 },
    { id: "16k-32k", label: "16K-32K", min: 16384, max: 32768 },
    { id: "32k-128k", label: "32K-128K", min: 32768, max: 131072 },
    { id: "128k-500k", label: "128K-500K", min: 131072, max: 512000 },
    { id: "500k+", label: "500K+", min: 512000, max: Infinity },
] as const;