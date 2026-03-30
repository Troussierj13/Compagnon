import { useSupabaseAdmin } from '~/server/utils/supabaseAdmin'

/**
 * GET /api/session/:id/characters?participant_id=xxx
 * Retourne les personnages de la campagne liée à la session pour un joueur participant.
 * Utilise le client admin pour contourner le RLS.
 * N'expose pas `data` ni les champs sensibles — uniquement id, name, player_name.
 */
export default defineEventHandler(async (event) => {
  const sessionId = getRouterParam(event, 'id')
  const participantId = getQuery(event).participant_id as string | undefined

  if (!sessionId) {
    throw createError({ statusCode: 400, message: 'session id requis' })
  }
  if (!participantId) {
    throw createError({ statusCode: 400, message: 'participant_id requis' })
  }

  const admin = useSupabaseAdmin()

  // Vérifier que le participant appartient bien à cette session
  const { data: participant, error: participantError } = await admin
    .from('session_participants')
    .select('id')
    .eq('id', participantId)
    .eq('session_id', sessionId)
    .single()

  if (participantError || !participant) {
    throw createError({ statusCode: 403, message: 'Participant non autorisé pour cette session' })
  }

  // Récupérer la session pour obtenir le campaign_id
  const { data: session, error: sessionError } = await admin
    .from('sessions')
    .select('campaign_id')
    .eq('id', sessionId)
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
