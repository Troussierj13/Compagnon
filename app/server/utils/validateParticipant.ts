import { useSupabaseAdmin } from './supabaseAdmin'

interface ValidateParticipantResult {
  valid: true
  participantId: string
  sessionId: string
}

interface ValidateParticipantError {
  valid: false
  statusCode: 401 | 403 | 404
  message: string
}

type ValidationResult = ValidateParticipantResult | ValidateParticipantError

/**
 * Valide qu'un participant_id appartient bien à la session donnée.
 * À appeler dans tous les server endpoints joueur avant de retourner des données.
 *
 * @param participantId - UUID du participant (depuis localStorage joueur)
 * @param sessionId     - UUID de la session (depuis l'URL ou le body)
 * @returns ValidateParticipantResult si valide, ValidateParticipantError sinon
 *
 * ⚠️ LIMITE DE SÉCURITÉ CONNUE (documentée, non corrigée) :
 * Cette validation protège les server endpoints, mais les événements Realtime
 * scene_entities reçus directement par le client anon (usePlayerSession) contiennent
 * TOUTES les entités de la scène, y compris visible_to_players = false.
 * Le filtrage est appliqué côté client — un client malicieux peut lire les entités cachées.
 * Voir architecture.md § Exception Realtime joueur.
 */
export async function validateParticipant(
  participantId: string | null | undefined,
  sessionId: string | null | undefined,
): Promise<ValidationResult> {
  if (!participantId || !sessionId) {
    return {
      valid: false,
      statusCode: 401,
      message: 'participant_id et session_id requis.',
    }
  }

  const supabase = useSupabaseAdmin()

  const { data, error } = await supabase
    .from('session_participants')
    .select('id, session_id')
    .eq('id', participantId)
    .eq('session_id', sessionId)
    .single()

  if (error || !data) {
    return {
      valid: false,
      statusCode: 403,
      message: 'Participant non trouvé pour cette session.',
    }
  }

  return {
    valid: true,
    participantId: data.id,
    sessionId: data.session_id,
  }
}
