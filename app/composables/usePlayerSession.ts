import type { GameSession, Character, Scene, SceneEntity, JoinSessionResponse } from '~/types/rpg'

const STORAGE_KEY = 'compagnon_player_session'

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
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      session_id: result.session.id,
      participant_id: result.participant_id,
      player_name: name,
      character_id: characterId ?? null,
    }))

    await loadSessionState(result.session.id, characterId)
    loading.value = false
    return true
  }

  // ─── Restaurer depuis localStorage ───────────────────────────────────────

  async function restore(): Promise<boolean> {
    if (typeof window === 'undefined') return false
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return false

    try {
      const { session_id, participant_id, player_name, character_id } = JSON.parse(stored)
      participantId.value = participant_id
      playerName.value = player_name

      const { data, error: err } = await supabase
        .from('sessions')
        .select('*, campaign:campaigns(*), active_scene:scenes(*)')
        .eq('id', session_id)
        .single()

      if (err || !data || (data as GameSession).status === 'ended') {
        clearSession()
        return false
      }

      session.value = data as GameSession
      await loadSessionState(session_id, character_id)
      return true
    } catch {
      clearSession()
      return false
    }
  }

  function clearSession() {
    session.value = null
    participantId.value = null
    playerName.value = null
    selectedCharacter.value = null
    localStorage.removeItem(STORAGE_KEY)
  }

  // ─── Charger l'état de la session ────────────────────────────────────────

  async function loadSessionState(sessionId: string, characterId?: string | null) {
    // Personnages disponibles dans la campagne
    if (session.value?.campaign_id) {
      const { data } = await supabase
        .from('characters')
        .select('*')
        .eq('campaign_id', session.value.campaign_id)

      availableCharacters.value = (data as Character[]) ?? []
    }

    // Personnage sélectionné
    if (characterId) {
      selectedCharacter.value = availableCharacters.value.find(c => c.id === characterId) ?? null
    }

    // Scène active
    if (session.value?.active_scene_id) {
      await loadActiveScene(session.value.active_scene_id)
    }
  }

  async function loadActiveScene(sceneId: string) {
    const { data: sceneData } = await supabase
      .from('scenes')
      .select('*')
      .eq('id', sceneId)
      .single()

    if (sceneData) {
      activeScene.value = sceneData as Scene

      const { data: entitiesData } = await supabase
        .from('scene_entities')
        .select('*')
        .eq('scene_id', sceneId)
        .eq('visible_to_players', true)

      sceneEntities.value = (entitiesData as SceneEntity[]) ?? []
    }
  }

  // ─── Realtime : suivre les changements de session ─────────────────────────

  function subscribeToSessionUpdates() {
    if (!session.value) return () => {}

    const sessionId = session.value.id

    const channel = supabase
      .channel(`player-session-${sessionId}`)
      // Changement de scène active
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'sessions', filter: `id=eq.${sessionId}` },
        async (payload) => {
          const updated = payload.new as GameSession
          session.value = { ...session.value!, ...updated }

          if (updated.active_scene_id && updated.active_scene_id !== activeScene.value?.id) {
            await loadActiveScene(updated.active_scene_id)
            subscribeToSceneEntities(updated.active_scene_id)
          } else if (!updated.active_scene_id) {
            activeScene.value = null
            sceneEntities.value = []
          }
        },
      )
      .subscribe()

    // S'abonner aux entités de la scène active courante
    let unsubEntities = () => {}
    if (session.value.active_scene_id) {
      unsubEntities = subscribeToSceneEntities(session.value.active_scene_id)
    }

    return () => {
      supabase.removeChannel(channel)
      unsubEntities()
    }
  }

  function subscribeToSceneEntities(sceneId: string) {
    const channel = supabase
      .channel(`player-entities-${sceneId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'scene_entities',
          filter: `scene_id=eq.${sceneId}`,
        },
        (payload) => {
          const entity = payload.new as SceneEntity
          if (entity.visible_to_players && !sceneEntities.value.find(e => e.id === entity.id)) {
            sceneEntities.value.push(entity)
          }
        },
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'scene_entities',
          filter: `scene_id=eq.${sceneId}`,
        },
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
        {
          event: 'DELETE',
          schema: 'public',
          table: 'scene_entities',
          filter: `scene_id=eq.${sceneId}`,
        },
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
