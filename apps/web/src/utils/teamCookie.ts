"use server";

import { cookies } from "next/headers";
import { createClient } from "./supabase/server";

export async function getTeamIdFromCookie(): Promise<string | undefined> {
    try {
        const c = await (await cookies()).get("activeTeamId");

        if (!c) {
            const supabase = await createClient();
            const userId = (await supabase.auth.getUser()).data.user?.id;

            const { data: user, error: userError } = await supabase
                .from("users")
                .select("default_team_id")
                .eq("user_id", userId)
                .single();

            return user?.default_team_id;
        }

        return c ? c.value : undefined;
    } catch (e) {
        return undefined;
    }
}
