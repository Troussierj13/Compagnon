import { generateJoinCode } from '~/server/utils/generateJoinCode'
import { useSupabaseAdmin } from '~/server/utils/supabaseAdmin'

/**
 * POST /api/session/create
 * Crée une nouvelle session pour une campagne et génère un join_code unique.
 * Requiert une authentification MJ (cookie Supabase).
 */
export default defineEventHandler(async (event) => {
  // Vérifier l'auth MJ via le token Supabase dans les cookies
  const supabase = await useSupabaseServer(event)
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw createError({ statusCode: 401, message: 'Non authentifié' })
  }

  const body = await readBody<{ campaign_id: string }>(event)

  if (!body?.campaign_id) {
    throw createError({ statusCode: 400, message: 'campaign_id requis' })
  }

  const admin = useSupabaseAdmin()

  // Vérifier que la campagne appartient au MJ
  const { data: campaign } = await admin
    .from('campaigns')
    .select('id')
    .eq('id', body.campaign_id)
    .eq('gm_user_id', user.id)
    .single()

  if (!campaign) {
    throw createError({ statusCode: 403, message: 'Campagne introuvable ou accès refusé' })
  }

  // Générer un code unique (retry si collision)
  let joinCode: string
  let attempts = 0
  do {
    joinCode = generateJoinCode()
    const { data: existing } = await admin
      .from('sessions')
      .select('id')
      .eq('join_code', joinCode)
      .maybeSingle()

    if (!existing) break
    attempts++
  } while (attempts < 5)

  if (attempts >= 5) {
    throw createError({ statusCode: 500, message: 'Impossible de générer un code unique' })
  }

  const { data: session, error } = await admin
    .from('sessions')
    .insert({ campaign_id: body.campaign_id, join_code: joinCode, status: 'waiting' })
    .select('*, campaign:campaigns(*)')
    .single()

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  return session
})
