import { useSupabaseAdmin } from '~/server/utils/supabaseAdmin'
import { validateParticipant } from '~/server/utils/validateParticipant'

/**
 * GET /api/session/:id/characters?participant_id=xxx
 * Retourne les personnages de la campagne liée à la session pour un joueur participant.
 * N'expose pas `data` ni les champs sensibles — uniquement id, name, player_name.
 */
export default defineEventHandler(async (event) => {
  const sessionId = getRouterParam(event, 'id')
  const participantId = getQuery(event).participant_id as string | undefined

  await validateParticipant(sessionId, participantId)

  const admin = useSupabaseAdmin()

  // Récupérer la session pour obtenir le campaign_id
  const { data: session, error: sessionError } = await admin
    .from('sessions')
    .select('campaign_id')
    .eq('id', sessionId!)
    .single()

  if (sessionError || !session) {
    throw createError({ statusCode: 404, message: 'Session introuvable' })
  }

  // Récupérer les personnages de la campagne — champs publics uniquement, pas `data`
  const { data: characters, error: charactersError } = await admin
    .from('characters')
    .select('id, name, player_name')
    .eq('campaign_id', session.campaign_id)

  if (charactersError) {
    throw createError({ statusCode: 500, message: 'Erreur lors de la récupération des personnages' })
  }

  return characters ?? []
})
