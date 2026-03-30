import type { GameSession, Scene, SceneEntity } from '~/types/rpg'

type DisplayStateResponse = {
  session: GameSession
  active_scene: Scene | null
  scene_entities: SceneEntity[]
}

/**
 * Gestion de l'état de session pour l'affichage TV.
 * Pas d'identité joueur — lecture seule, entités visibles uniquement.
 */
export function useDisplaySession() {
  const supabase = useSupabaseClient()

  const session = ref<GameSession | null>(null)
  const activeScene = ref<Scene | null>(null)
  const sceneEntities = ref<SceneEntity[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function loadState(sessionId: string): Promise<boolean> {
    loading.value = true
    error.value = null

    const state = await $fetch<DisplayStateResponse>(`/api/display/${sessionId}/state`)
      .catch(() => null)

    loading.value = false

    if (!state) {
      error.value = 'Session introuvable'
      return false
    }

    session.value = state.session
    activeScene.value = state.active_scene
    sceneEntities.value = state.scene_entities
    return true
  }

  async function refreshActiveScene(sessionId: string) {
    const state = await $fetch<DisplayStateResponse>(`/api/display/${sessionId}/state`)
      .catch(() => null)

    if (state) {
      activeScene.value = state.active_scene
      sceneEntities.value = state.scene_entities
    }
  }

  function subscribe(sessionId: string) {
    let currentSceneUnsub: (() => void) | null = null

    const channel = supabase
      .channel(`display-session-${sessionId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'sessions', filter: `id=eq.${sessionId}` },
        async (payload) => {
          const updated = payload.new as GameSession
          session.value = { ...session.value!, ...updated }

          if (updated.active_scene_id && updated.active_scene_id !== activeScene.value?.id) {
            await refreshActiveScene(sessionId)
            currentSceneUnsub?.()
            currentSceneUnsub = subscribeToSceneEntities(updated.active_scene_id)
          } else if (!updated.active_scene_id) {
            currentSceneUnsub?.()
            currentSceneUnsub = null
            activeScene.value = null
            sceneEntities.value = []
          }
        },
      )
      .subscribe()

    if (session.value?.active_scene_id) {
      currentSceneUnsub = subscribeToSceneEntities(session.value.active_scene_id)
    }

    return () => {
      supabase.removeChannel(channel)
      currentSceneUnsub?.()
    }
  }

  function subscribeToSceneEntities(sceneId: string) {
    const channel = supabase
      .channel(`display-entities-${sceneId}`)
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
    activeScene: readonly(activeScene),
    sceneEntities: readonly(sceneEntities),
    loading: readonly(loading),
    error: readonly(error),
    loadState,
    subscribe,
  }
}
