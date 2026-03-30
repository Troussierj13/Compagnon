import type { SceneEntity } from '~/types/rpg'
import { useSupabaseAdmin } from '~/server/utils/supabaseAdmin'

/**
 * GET /api/display/:id/state
 * Retourne l'état public de la session pour l'affichage TV.
 * Pas de participant_id requis — l'UUID de session fait office de secret d'URL.
 * Retourne uniquement les entités visible_to_players = true.
 */
export default defineEventHandler(async (event) => {
  const sessionId = getRouterParam(event, 'id')

  if (!sessionId) {
    throw createError({ statusCode: 400, message: 'session_id manquant' })
  }

  const admin = useSupabaseAdmin()

  const { data: session, error: sessionError } = await admin
    .from('sessions')
    .select('id, status, active_scene_id, campaign:campaigns(id, name)')
    .eq('id', sessionId)
    .single()

  if (sessionError || !session) {
    throw createError({ statusCode: 404, message: 'Session introuvable' })
  }

  let active_scene = null
  let scene_entities: SceneEntity[] = []

  if (session.active_scene_id) {
    const { data: sceneData } = await admin
      .from('scenes')
      .select('id, name, description, battlemap_url')
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

  return { session, active_scene, scene_entities }
})
