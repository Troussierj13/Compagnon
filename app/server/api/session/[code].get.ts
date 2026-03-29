import { useSupabaseAdmin } from '~/server/utils/supabaseAdmin'

/**
 * GET /api/session/:code
 * Retourne les infos publiques d'une session (nom de campagne, statut).
 * Utilisé sur la page /player/join pour prévisualiser avant de rejoindre.
 */
export default defineEventHandler(async (event) => {
  const code = getRouterParam(event, 'code')?.toUpperCase()

  if (!code) {
    throw createError({ statusCode: 400, message: 'Code requis' })
  }

  const admin = useSupabaseAdmin()
  const { data, error } = await admin
    .from('sessions')
    .select('id, status, join_code, campaign:campaigns(name, system)')
    .eq('join_code', code)
    .neq('status', 'ended')
    .single()

  if (error || !data) {
    throw createError({ statusCode: 404, message: 'Session introuvable ou terminée' })
  }

  return data
})
