import { useSupabaseAdmin } from './supabaseAdmin'

/**
 * Valide qu'un participant appartient à la session donnée.
 * Lance une erreur HTTP 400 ou 403 si la validation échoue.
 * Factorisé pour éviter la duplication dans state.get.ts et characters.get.ts.
 */
export async function validateParticipant(
  sessionId: string | undefined,
  participantId: string | undefined,
): Promise<void> {
  if (!sessionId) {
    throw createError({ statusCode: 400, message: 'session id requis' })
  }
  if (!participantId) {
    throw createError({ statusCode: 400, message: 'participant_id requis' })
  }

  const admin = useSupabaseAdmin()
  const { data: participant, error } = await admin
    .from('session_participants')
    .select('id')
    .eq('id', participantId)
    .eq('session_id', sessionId)
    .single()

  if (error || !participant) {
    throw createError({ statusCode: 403, message: 'Participant non autorisé pour cette session' })
  }
}
