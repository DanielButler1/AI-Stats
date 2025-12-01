"use server"

import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function updateAccount(payload: {
    display_name?: string | null
    default_team_id?: string | null
    obfuscate_info?: boolean
}) {
    const supabase = await createClient()
    const { data: authData } = await supabase.auth.getUser()
    const authUser = authData.user

    if (!authUser) {
        throw new Error('Not authenticated')
    }

    const toUpsert: any = {}
    if (payload.display_name !== undefined) toUpsert.display_name = payload.display_name
    if (payload.default_team_id !== undefined) toUpsert.default_team_id = payload.default_team_id
    if (payload.obfuscate_info !== undefined) toUpsert.obfuscate_info = payload.obfuscate_info

    toUpsert.user_id = authUser.id

    const { error } = await supabase.from('users').upsert(toUpsert, { onConflict: 'user_id' })
    if (error) throw new Error(error.message)

    revalidatePath('/settings/account')

    return { ok: true }
}

export async function deleteAccount() {
    const supabase = await createClient()
    const { data: authData } = await supabase.auth.getUser()
    const authUser = authData.user

    if (!authUser) {
        throw new Error('Not authenticated')
    }

    // Use admin client to delete the auth user (service role key required)
    const admin = createAdminClient()
    // supabase-js admin API exposes auth.admin.deleteUser
    // If this fails, throw so the client can show an error
    const { error } = await (admin as any).auth.admin.deleteUser(authUser.id)
    if (error) throw new Error(error.message)

    return { ok: true }
}
