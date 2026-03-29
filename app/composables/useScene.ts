import type { Scene, SceneEntity, EntityType, EntityData, EntityPosition } from '~/types/rpg'

/**
 * Gestion des scènes et entités pour le MJ.
 * Inclut les subscriptions Supabase Realtime pour les mises à jour live.
 */
export function useScene(sessionId: string) {
  const supabase = useSupabaseClient()
  const scenes = ref<Scene[]>([])
  const entities = ref<SceneEntity[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // ─── Scènes ──────────────────────────────────────────────────────────────

  async function fetchScenes() {
    loading.value = true
    const { data, error: err } = await supabase
      .from('scenes')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })

    if (err) error.value = err.message
    else scenes.value = data as Scene[]
    loading.value = false
  }

  async function createScene(name: string, description?: string): Promise<Scene | null> {
    const { data, error: err } = await supabase
      .from('scenes')
      .insert({ session_id: sessionId, name, description: description ?? null })
      .select()
      .single()

    if (err) { error.value = err.message; return null }
    const scene = data as Scene
    scenes.value.push(scene)
    return scene
  }

  async function uploadBattlemap(sceneId: string, file: File): Promise<string | null> {
    const path = `${sessionId}/${sceneId}/${file.name}`
    const { error: uploadError } = await supabase.storage
      .from('battlemaps')
      .upload(path, file, { upsert: true })

    if (uploadError) { error.value = uploadError.message; return null }

    const { data } = supabase.storage.from('battlemaps').getPublicUrl(path)
    const url = data.publicUrl

    await supabase.from('scenes').update({ battlemap_url: url }).eq('id', sceneId)
    const idx = scenes.value.findIndex(s => s.id === sceneId)
    if (idx !== -1) scenes.value[idx] = { ...scenes.value[idx], battlemap_url: url }

    return url
  }

  async function deleteScene(sceneId: string) {
    const { error: err } = await supabase.from('scenes').delete().eq('id', sceneId)
    if (err) { error.value = err.message; return false }
    scenes.value = scenes.value.filter(s => s.id !== sceneId)
    return true
  }

  // ─── Entités ─────────────────────────────────────────────────────────────

  async function fetchEntities(sceneId: string) {
    const { data, error: err } = await supabase
      .from('scene_entities')
      .select('*')
      .eq('scene_id', sceneId)
      .order('created_at', { ascending: true })

    if (err) error.value = err.message
    else entities.value = data as SceneEntity[]
  }

  async function addEntity(
    sceneId: string,
    type: EntityType,
    name: string,
    data: EntityData,
    position: EntityPosition = { x: 0, y: 0 },
    visibleToPlayers = true,
  ): Promise<SceneEntity | null> {
    const { data: created, error: err } = await supabase
      .from('scene_entities')
      .insert({ scene_id: sceneId, type, name, data, position, visible_to_players: visibleToPlayers })
      .select()
      .single()

    if (err) { error.value = err.message; return null }
    const entity = created as SceneEntity
    entities.value.push(entity)
    return entity
  }

  async function updateEntity(id: string, patch: Partial<SceneEntity>) {
    const { error: err } = await supabase
      .from('scene_entities')
      .update(patch)
      .eq('id', id)

    if (err) { error.value = err.message; return false }
    const idx = entities.value.findIndex(e => e.id === id)
    if (idx !== -1) entities.value[idx] = { ...entities.value[idx], ...patch }
    return true
  }

  async function moveEntity(id: string, position: EntityPosition) {
    return updateEntity(id, { position })
  }

  async function removeEntity(id: string) {
    const { error: err } = await supabase.from('scene_entities').delete().eq('id', id)
    if (err) { error.value = err.message; return false }
    entities.value = entities.value.filter(e => e.id !== id)
    return true
  }

  // ─── Realtime (lecture pour les joueurs) ─────────────────────────────────
  // Subscribes aux changements d'entités d'une scène spécifique.
  function subscribeToEntities(sceneId: string) {
    const channel = supabase
      .channel(`scene-entities-${sceneId}`)
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
          if (!entities.value.find(e => e.id === entity.id)) {
            entities.value.push(entity)
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
          const idx = entities.value.findIndex(e => e.id === updated.id)
          if (idx !== -1) entities.value[idx] = updated
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
          entities.value = entities.value.filter(e => e.id !== (payload.old as SceneEntity).id)
        },
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }

  return {
    scenes: readonly(scenes),
    entities: readonly(entities),
    loading: readonly(loading),
    error: readonly(error),
    fetchScenes,
    createScene,
    uploadBattlemap,
    deleteScene,
    fetchEntities,
    addEntity,
    updateEntity,
    moveEntity,
    removeEntity,
    subscribeToEntities,
  }
}
