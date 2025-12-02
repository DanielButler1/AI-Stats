export type ModelRow = {
    model_id: string;
    name: string;
    announcement_date?: string | null;
    release_date?: string | null;
    deprecation_date?: string | null;
    retirement_date?: string | null;
    previous_model_id?: string | null;
};

export type ProviderEvent = {
    date?: string | null;
    provider_id: string;
    endpoint: string;
};

export function buildTimeline(
    model: ModelRow,
    past: ModelRow[],
    future: ModelRow[],
    providers: ProviderEvent[] = []
) {
    const events: any[] = [];

    // All past lineage
    for (const p of past) {
        events.push({
            date: p.release_date || p.announcement_date,
            eventType: "PreviousModel",
            modelId: p.model_id,
            modelName: p.name,
        });
    }

    // Model intrinsic events
    addEvt(events, model.announcement_date, "Announced");
    addEvt(events, model.release_date, "Released");
    addEvt(events, model.deprecation_date, "Deprecated");
    addEvt(events, model.retirement_date, "Retired");

    // All future lineage
    for (const f of future) {
        events.push({
            date: f.release_date || f.announcement_date,
            eventType: "FutureModel",
            modelId: f.model_id,
            modelName: f.name,
        });
    }

    return {
        events: events.filter(e => e.date).sort((a, b) => (a.date! < b.date! ? 1 : -1)), // newest first
    };
}

function addEvt(arr: any[], dt?: string | null, name?: string) {
    if (dt) arr.push({ date: dt, eventType: "ModelEvent", eventName: name });
}
