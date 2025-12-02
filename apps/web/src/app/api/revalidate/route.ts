// app/api/revalidate/route.ts
import { revalidateTag, revalidatePath } from "next/cache";

export async function POST(req: Request) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${process.env.REVALIDATE_SECRET}`) {
        return new Response("Unauthorised", { status: 401 });
    }

    let payload: { tags?: string[]; paths?: string[] } = {};
    try { payload = await req.json(); } catch { }

    // Purge by tags (preferred for data)
    for (const t of payload.tags ?? []) revalidateTag(t);

    // Optional: also support path revalidation (for route segments)
    for (const p of payload.paths ?? []) revalidatePath(p);

    return Response.json({
        ok: true,
        tags: payload.tags ?? [],
        paths: payload.paths ?? [],
        at: Date.now(),
    });
}
