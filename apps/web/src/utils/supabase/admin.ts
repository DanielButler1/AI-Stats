// utils/supabase/admin.ts
import { createClient } from '@supabase/supabase-js'

export function createAdminClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY! // <-- service key (keep server-only)
    return createClient(url, key, {
        auth: { persistSession: false, autoRefreshToken: false }
    })
}
