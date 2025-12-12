const ENDPOINT_PATHS: Record<string, string> = {
    "chat.completions": "/chat/completions",
    "text.completions": "/chat/completions",
    "image.generations": "/images/generations",
    "images.generations": "/images/generations",
    "images.generation": "/images/generations",
    "image.generation": "/images/generations",
    "video.generations": "/video/generations",
    "video.generation": "/video/generations",
    "audio.speech": "/audio/speech",
    "audio.transcription": "/audio/transcriptions",
    "audio.transcriptions": "/audio/transcriptions",
    embeddings: "/embeddings",
    moderations: "/moderations",
    moderation: "/moderations",
    batch: "/batch",
};

export function resolveGatewayPath(endpoint?: string | null): string {
    if (!endpoint) return ENDPOINT_PATHS["chat.completions"];
    const normalized = endpoint.toLowerCase();
    const mapped = ENDPOINT_PATHS[normalized];
    if (mapped) return mapped;
    const fallback = `/${normalized.replace(/\.+/g, "/")}`;
    return fallback.startsWith("/") ? fallback : `/${fallback}`;
}
