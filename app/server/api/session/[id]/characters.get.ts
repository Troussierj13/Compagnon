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

  // Récupérer session + personnages en une seule requête via jointure
  const { data, error } = await admin
    .from('sessions')
    .select('campaign:campaigns(characters(id, name, player_name))')
    .eq('id', sessionId!)
    .single()

  if (error || !data) {
    throw createError({ statusCode: 404, message: 'Session introuvable' })
  }

  return (data.campaign as { characters: { id: string; name: string; player_name: string | null }[] } | null)?.characters ?? []
})
