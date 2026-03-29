import { createClient } from '@supabase/supabase-js'

/**
 * Client Supabase avec la service_role key.
 * Bypass le RLS → à utiliser uniquement côté serveur.
 */
export function useSupabaseAdmin() {
  const config = useRuntimeConfig()
  return createClient(
    config.public.supabaseUrl,
    config.supabaseServiceKey,
    { auth: { persistSession: false } },
  )
}
