import { useSupabaseAdmin } from '~/server/utils/supabaseAdmin'

/**
 * GET /api/session/:id/state?participant_id=xxx
 * Retourne l'état de la session pour un joueur participant.
 * Utilise le client admin pour contourner le RLS.
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

  // Charger la session
  const { data: session, error: sessionError } = await admin
    .from('sessions')
    .select('*, campaign:campaigns(*)')
    .eq('id', sessionId)
    .single()

  if (sessionError || !session) {
    throw createError({ statusCode: 404, message: 'Session introuvable' })
  }

  // Charger la scène active si présente
  let active_scene = null
  let scene_entities: unknown[] = []

  if (session.active_scene_id) {
    const { data: sceneData } = await admin
      .from('scenes')
      .select('*')
      .eq('id', session.active_scene_id)
      .single()

    if (sceneData) {
      active_scene = sceneData

      const { data: entitiesData } = await admin
        .from('scene_entities')
        .select('*')
        .eq('scene_id', session.active_scene_id)
        .eq('visible_to_players', true)

      scene_entities = entitiesData ?? []
    }
  }

  return {
    session,
    active_scene,
    scene_entities,
  }
})
