import type { GameSession, Character, Scene, SceneEntity, JoinSessionResponse } from '~/types/rpg'

type SessionStateResponse = {
  session: GameSession
  active_scene: Scene | null
  scene_entities: SceneEntity[]
}

/**
 * Gestion de session côté joueur.
 * Le joueur rejoint via un join_code. Son état est persisté dans localStorage.
 */
export function usePlayerSession() {
  const supabase = useSupabaseClient()

  const session = ref<GameSession | null>(null)
  const participantId = ref<string | null>(null)
  const playerName = ref<string | null>(null)
  const selectedCharacter = ref<Character | null>(null)
  const availableCharacters = ref<Character[]>([])
  const activeScene = ref<Scene | null>(null)
  const sceneEntities = ref<SceneEntity[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // ─── Rejoindre une session ────────────────────────────────────────────────

  async function join(joinCode: string, name: string, characterId?: string): Promise<boolean> {
    loading.value = true
    error.value = null

    const result = await $fetch<JoinSessionResponse>('/api/session/join', {
      method: 'POST',
      body: { join_code: joinCode.toUpperCase(), player_name: name, character_id: characterId },
    }).catch((err) => {
      error.value = err.data?.message ?? 'Code de session invalide'
      return null
    })

    if (!result) { loading.value = false; return false }

    session.value = result.session
    participantId.value = result.participant_id
    playerName.value = name

    // Persister en localStorage pour survie au refresh
    localStorage.setItem(PLAYER_SESSION_STORAGE_KEY, JSON.stringify({
      session_id: result.session.id,
      participant_id: result.participant_id,
      player_name: name,
      character_id: characterId ?? null,
    }))

    // Charger la scène active + les personnages en un passage
    await fetchFullState(result.session.id, result.participant_id, characterId)
    loading.value = false
    return true
  }

  // ─── Restaurer depuis localStorage ───────────────────────────────────────

  async function restore(): Promise<boolean> {
    if (typeof window === 'undefined') return false
    const stored = localStorage.getItem(PLAYER_SESSION_STORAGE_KEY)
    if (!stored) return false

    try {
      const { session_id, participant_id, player_name, character_id } = JSON.parse(stored)
      participantId.value = participant_id
      playerName.value = player_name

      // Charger état de session + personnages disponibles en parallèle
      const [state] = await Promise.all([
        $fetch<SessionStateResponse>(
          `/api/session/${session_id}/state?participant_id=${participant_id}`,
        ).catch(() => null),
        fetchAvailableCharacters(session_id),
      ])

      if (!state || state.session.status === 'ended') {
        clearSession()
        return false
      }

      session.value = state.session
      activeScene.value = state.active_scene
      sceneEntities.value = state.scene_entities

      if (character_id) {
        selectedCharacter.value = availableCharacters.value.find(c => c.id === character_id) ?? null
      }

      return true
    } catch (err) {
      console.error('Erreur lors de la restauration de session:', err)
      error.value = 'Erreur lors du chargement de votre session'
      clearSession()
      return false
    }
  }

  function clearSession() {
    session.value = null
    participantId.value = null
    playerName.value = null
    selectedCharacter.value = null
    availableCharacters.value = []
    activeScene.value = null
    sceneEntities.value = []
    error.value = null
    loading.value = false
    localStorage.removeItem(PLAYER_SESSION_STORAGE_KEY)
  }

  // ─── Chargement interne ───────────────────────────────────────────────────

  // Charge état de session + personnages disponibles en parallèle
  async function fetchFullState(sessionId: string, pid: string, characterId?: string | null) {
    const [state] = await Promise.all([
      $fetch<SessionStateResponse>(
        `/api/session/${sessionId}/state?participant_id=${pid}`,
      ).catch(() => null),
      fetchAvailableCharacters(sessionId),
    ])

    if (state) {
      session.value = state.session
      activeScene.value = state.active_scene
      sceneEntities.value = state.scene_entities
    }

    if (characterId) {
      selectedCharacter.value = availableCharacters.value.find(c => c.id === characterId) ?? null
    }
  }

  // Charge uniquement les personnages disponibles dans la campagne
  async function fetchAvailableCharacters(sessionId: string) {
    if (!participantId.value) return
    const characters = await $fetch<Character[]>(
      `/api/session/${sessionId}/characters?participant_id=${participantId.value}`,
    ).catch(() => [])
    availableCharacters.value = characters
  }

  // Recharge la scène active depuis /state — utilisé par le Realtime quand la scène change
  async function refreshActiveScene() {
    if (!session.value || !participantId.value) return

    const state = await $fetch<SessionStateResponse>(
      `/api/session/${session.value.id}/state?participant_id=${participantId.value}`,
    ).catch(() => null)

    if (state) {
      activeScene.value = state.active_scene
      sceneEntities.value = state.scene_entities
    }
  }

  // ─── Realtime : suivre les changements de session ─────────────────────────

  function subscribeToSessionUpdates() {
    if (!session.value) return () => {}

    const sessionId = session.value.id
    let currentSceneUnsub: (() => void) | null = null

    const channel = supabase
      .channel(`player-session-${sessionId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'sessions', filter: `id=eq.${sessionId}` },
        async (payload) => {
          const updated = payload.new as GameSession
          session.value = { ...session.value!, ...updated }

          if (updated.active_scene_id && updated.active_scene_id !== activeScene.value?.id) {
            // Le MJ a changé la scène active → recharger et changer la subscription
            await refreshActiveScene()
            currentSceneUnsub?.()
            currentSceneUnsub = subscribeToSceneEntities(updated.active_scene_id)
          } else if (!updated.active_scene_id) {
            // Le MJ a retiré la scène active
            currentSceneUnsub?.()
            currentSceneUnsub = null
            activeScene.value = null
            sceneEntities.value = []
          }
        },
      )
      .subscribe()

    // S'abonner aux entités de la scène active courante
    if (session.value.active_scene_id) {
      currentSceneUnsub = subscribeToSceneEntities(session.value.active_scene_id)
    }

    return () => {
      supabase.removeChannel(channel)
      currentSceneUnsub?.()
    }
  }

  function subscribeToSceneEntities(sceneId: string) {
    const channel = supabase
      .channel(`player-entities-${sceneId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'scene_entities', filter: `scene_id=eq.${sceneId}` },
        (payload) => {
          const entity = payload.new as SceneEntity
          if (entity.visible_to_players && !sceneEntities.value.find(e => e.id === entity.id)) {
            sceneEntities.value.push(entity)
          }
        },
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'scene_entities', filter: `scene_id=eq.${sceneId}` },
        (payload) => {
          const updated = payload.new as SceneEntity
          const idx = sceneEntities.value.findIndex(e => e.id === updated.id)
          if (updated.visible_to_players) {
            if (idx !== -1) sceneEntities.value[idx] = updated
            else sceneEntities.value.push(updated)
          } else if (idx !== -1) {
            sceneEntities.value.splice(idx, 1)
          }
        },
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'scene_entities', filter: `scene_id=eq.${sceneId}` },
        (payload) => {
          sceneEntities.value = sceneEntities.value.filter(
            e => e.id !== (payload.old as SceneEntity).id,
          )
        },
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }

  return {
    session: readonly(session),
    participantId: readonly(participantId),
    playerName: readonly(playerName),
    selectedCharacter: readonly(selectedCharacter),
    availableCharacters: readonly(availableCharacters),
    activeScene: readonly(activeScene),
    sceneEntities: readonly(sceneEntities),
    loading: readonly(loading),
    error: readonly(error),
    join,
    restore,
    clearSession,
    subscribeToSessionUpdates,
  }
}
