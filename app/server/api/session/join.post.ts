import { useSupabaseAdmin } from '~/server/utils/supabaseAdmin'

/**
 * POST /api/session/join
 * Permet à un joueur anonyme de rejoindre une session via son join_code.
 * Pas d'auth requise.
 */
export default defineEventHandler(async (event) => {
  const body = await readBody<{
    join_code: string
    player_name: string
    character_id?: string
  }>(event)

  if (!body?.join_code || !body?.player_name?.trim()) {
    throw createError({ statusCode: 400, message: 'join_code et player_name requis' })
  }

  const admin = useSupabaseAdmin()

  // Trouver la session par code
  const { data: session, error: sessionError } = await admin
    .from('sessions')
    .select('id, join_code, status, active_scene_id, campaign_id, campaign:campaigns(name, system)')
    .eq('join_code', body.join_code.toUpperCase())
    .neq('status', 'ended')
    .single()

  if (sessionError || !session) {
    throw createError({ statusCode: 404, message: 'Session introuvable ou terminée' })
  }

  // Si un character_id est fourni, vérifier qu'il appartient bien à cette campagne
  if (body.character_id) {
    const { data: character } = await admin
      .from('characters')
      .select('id')
      .eq('id', body.character_id)
      .eq('campaign_id', session.campaign_id)
      .single()

    if (!character) {
      throw createError({ statusCode: 400, message: 'Personnage invalide pour cette session' })
    }
  }

  // Créer le participant
  const { data: participant, error: participantError } = await admin
    .from('session_participants')
    .insert({
      session_id: session.id,
      player_name: body.player_name.trim(),
      character_id: body.character_id ?? null,
    })
    .select()
    .single()

  if (participantError) {
    throw createError({ statusCode: 500, message: participantError.message })
  }

  return {
    session,
    participant_id: participant.id,
  }
})
