// lib/fetchers/models/getModelTimeline.ts
import { cacheLife, cacheTag } from "next/cache";
import { createClient } from "@/utils/supabase/client";

export type RawEvent = {
    date: string;
    eventType: string;
    eventName?: string;
    description?: string;
    modelId?: string;
    modelName?: string;
};

export default async function getModelTimeline(modelId: string): Promise<{ events: RawEvent[] } | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("data_models")
        .select(`timeline`)
        .eq("model_id", modelId)
        .single();

    if (error) {
        throw new Error(error.message || "Failed to fetch model timeline");
    }

    const timeline = data?.timeline ?? null;

    // Support both shapes: an array (legacy) or an object { events: [] }
    if (Array.isArray(timeline)) {
        return { events: timeline as RawEvent[] };
    }
    if (timeline && Array.isArray(timeline.events)) {
        return { events: timeline.events as RawEvent[] };
    }

    // Return empty events array if no timeline present
    return { events: [] };
}

/**
 * Cached version of getModelTimeline.
 *
 * Usage: await getModelTimelineCached(modelId)
 *
 * This wraps a fetcher with `unstable_cache` and includes the modelId in the
 * cache key and tags so you can target revalidation per-model.
 */
export async function getModelTimelineCached(modelId: string) {
    "use cache";

    cacheLife("days");
    cacheTag("data:models");
    cacheTag(`data:models:${modelId}`);

    return getModelTimeline(modelId);
}
