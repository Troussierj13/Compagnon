import { createClient } from '@supabase/supabase-js'

/**
 * Client Supabase avec la service_role key.
 * Bypass le RLS → à utiliser uniquement côté serveur.
 * Singleton : une seule instance par processus Nitro.
 */
let adminClient: ReturnType<typeof createClient> | null = null

export function useSupabaseAdmin() {
  if (!adminClient) {
    const config = useRuntimeConfig()
    adminClient = createClient(
      config.public.supabaseUrl,
      config.supabaseServiceKey,
      { auth: { persistSession: false } },
    )
  }
  return adminClient
}
