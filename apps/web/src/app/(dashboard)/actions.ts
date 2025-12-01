"use server"

import { cookies } from "next/headers";

export async function SwapTeam(teamId: string) {
    try {
        if (!teamId || typeof teamId !== 'string') {
            return { ok: false, error: 'teamId required' };
        }
        const cookieStore: any = await cookies();
        await cookieStore.set({
            name: 'activeTeamId',
            value: teamId,
            httpOnly: true,
            path: '/',
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 30,
        });

        return { ok: true };
    } catch {
        return { ok: false, error: 'failed to set cookie' };
    }
}