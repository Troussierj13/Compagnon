import type { SceneEntity } from '~/types/rpg'
import { useSupabaseAdmin } from '~/server/utils/supabaseAdmin'
import { validateParticipant } from '~/server/utils/validateParticipant'

/**
 * GET /api/session/:id/state?participant_id=xxx
 * Retourne l'état de la session pour un joueur participant.
 * Utilise le client admin pour contourner le RLS.
 */
export default defineEventHandler(async (event) => {
  const sessionId = getRouterParam(event, 'id')
  const participantId = getQuery(event).participant_id as string | undefined

  await validateParticipant(sessionId, participantId)

  const admin = useSupabaseAdmin()

  // Charger la session — champs joueur uniquement, sans gm_user_id ni timestamps internes
  const { data: session, error: sessionError } = await admin
    .from('sessions')
    .select('id, status, active_scene_id, join_code, campaign_id, campaign:campaigns(id, name, system)')
    .eq('id', sessionId!)
    .single()

  if (sessionError || !session) {
    throw createError({ statusCode: 404, message: 'Session introuvable' })
  }

  // Charger la scène active si présente
  let active_scene = null
  let scene_entities: SceneEntity[] = []

  if (session.active_scene_id) {
    const { data: sceneData } = await admin
      .from('scenes')
      .select('id, session_id, name, description, battlemap_url')
      .eq('id', session.active_scene_id)
      .single()

    if (sceneData) {
      active_scene = sceneData

      const { data: entitiesData } = await admin
        .from('scene_entities')
        .select('id, scene_id, type, name, data, position, visible_to_players')
        .eq('scene_id', session.active_scene_id)
        .eq('visible_to_players', true)

      scene_entities = (entitiesData ?? []) as SceneEntity[]
    }
  }

  return {
    session,
    active_scene,
    scene_entities,
  }
})
