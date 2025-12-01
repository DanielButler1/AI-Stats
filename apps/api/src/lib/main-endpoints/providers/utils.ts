import { z } from "zod";

// Sanitize provider payloads using the schema we already validate against.
export function sanitizePayload<T extends z.ZodTypeAny>(schema: T, payload: unknown): z.infer<T> {
    return schema.parse(payload);
}
