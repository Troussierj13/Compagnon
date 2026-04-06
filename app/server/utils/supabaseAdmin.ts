import { createClient } from '@supabase/supabase-js'

let _adminClient: ReturnType<typeof createClient> | null = null

/**
 * Retourne un client Supabase avec la clé service_role (service_role bypass le RLS).
 * Singleton Nitro — une seule instance par processus.
 * À utiliser UNIQUEMENT dans les server endpoints pour les accès joueur anonyme.
 */
export function useSupabaseAdmin() {
  if (_adminClient) return _adminClient

  const config = useRuntimeConfig()

  // config.public.supabaseUrl correspond à SUPABASE_URL dans .env (via runtimeConfig.public.supabaseUrl dans nuxt.config.ts)
  const supabaseUrl = config.public.supabaseUrl as string
  const serviceKey  = config.supabaseServiceKey as string

  if (!supabaseUrl || !serviceKey) {
    throw new Error(
      '[supabaseAdmin] SUPABASE_URL ou SUPABASE_SERVICE_KEY manquant dans les variables d\'environnement.',
    )
  }

  _adminClient = createClient(supabaseUrl, serviceKey, {
    auth: {
      // Le client admin ne doit jamais persister de session utilisateur
      persistSession: false,
      autoRefreshToken: false,
    },
  })

  return _adminClient
}
