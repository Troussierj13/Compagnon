import type { GameSession, SessionParticipant } from '~/types/rpg'

/**
 * Gestion de session côté MJ.
 * Crée une session, change la scène active, suit les participants en temps réel.
 */
export function useGMSession() {
  const supabase = useSupabaseClient()
  const session = ref<GameSession | null>(null)
  const participants = ref<SessionParticipant[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // ─── Créer une session ────────────────────────────────────────────────────

  async function createSession(campaignId: string): Promise<GameSession | null> {
    loading.value = true
    error.value = null

    // Délégation à l'API serveur qui génère le code unique
    const data = await $fetch<GameSession>('/api/session/create', {
      method: 'POST',
      body: { campaign_id: campaignId },
    }).catch((err) => {
      error.value = err.data?.message ?? 'Erreur lors de la création de la session'
      return null
    })

    if (data) session.value = data
    loading.value = false
    return data
  }

  // ─── Charger une session existante ────────────────────────────────────────

  async function loadSession(sessionId: string) {
    loading.value = true
    const { data, error: err } = await supabase
      .from('sessions')
      .select('*, campaign:campaigns(*), active_scene:scenes!active_scene_id(*)')
      .eq('id', sessionId)
      .single()

    if (err) error.value = err.message
    else session.value = data as GameSession

    await fetchParticipants(sessionId)
    loading.value = false
  }

  // ─── Changer la scène active ──────────────────────────────────────────────

  async function setActiveScene(sceneId: string | null) {
    if (!session.value) return false
    const { error: err } = await supabase
      .from('sessions')
      .update({ active_scene_id: sceneId, status: sceneId ? 'active' : 'waiting' })
      .eq('id', session.value.id)

    if (err) { error.value = err.message; return false }
    session.value = { ...session.value, active_scene_id: sceneId, status: sceneId ? 'active' : 'waiting' }
    return true
  }

  // ─── Terminer la session ──────────────────────────────────────────────────

  async function endSession() {
    if (!session.value) return false
    const { error: err } = await supabase
      .from('sessions')
      .update({ status: 'ended', active_scene_id: null })
      .eq('id', session.value.id)

    if (err) { error.value = err.message; return false }
    session.value = { ...session.value, status: 'ended', active_scene_id: null }
    return true
  }

  // ─── Participants ─────────────────────────────────────────────────────────

  async function fetchParticipants(sessionId: string) {
    const { data, error: err } = await supabase
      .from('session_participants')
      .select('*, character:characters(*)')
      .eq('session_id', sessionId)
      .order('joined_at', { ascending: true })

    if (err) error.value = err.message
    else participants.value = data as SessionParticipant[]
  }

  // ─── Realtime : participants et changements de session ────────────────────

  function subscribeToSession(sessionId: string) {
    const channel = supabase
      .channel(`gm-session-${sessionId}`)
      // Nouveaux participants
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'session_participants', filter: `session_id=eq.${sessionId}` },
        async (payload) => {
          const { data: fullParticipant } = await supabase
            .from('session_participants')
            .select('*, character:characters(*)')
            .eq('id', payload.new.id)
            .single()
          if (fullParticipant && !participants.value.find(p => p.id === fullParticipant.id)) {
            participants.value.push(fullParticipant as SessionParticipant)
          }
        },
      )
      // Participants qui quittent (delete)
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'session_participants', filter: `session_id=eq.${sessionId}` },
        (payload) => {
          participants.value = participants.value.filter(
            p => p.id !== (payload.old as SessionParticipant).id,
          )
        },
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }

  return {
    session: readonly(session),
    participants: readonly(participants),
    loading: readonly(loading),
    error: readonly(error),
    createSession,
    loadSession,
    setActiveScene,
    endSession,
    subscribeToSession,
  }
}
