import { type InjectionKey } from 'vue'
import type { Culture, CulturalVirtue, Virtue, Reward } from '~/types/rpg'

// Clé d'injection pour le pattern provide/inject (Layout → pages Game System)
// eslint-disable-next-line @typescript-eslint/no-use-before-define
export const GameSystemKey: InjectionKey<ReturnType<typeof useGameSystem>> = Symbol('gameSystem')

// Types étendus avec cultural_virtues joinées (réponse GET /api/game-system/cultures)
interface CultureWithVirtues extends Culture {
  cultural_virtues: Array<{ id: string; identifier: string; name: string }>
}

/**
 * useGameSystem — Composable MJ pour les données de système de jeu
 *
 * Surface : Back-office MJ (pages /gm/system/*)
 * Stratégie : données quasi-statiques, charger une seule fois.
 * Usage : fournir via provide/inject depuis le layout ou la page parente.
 *
 * Les mutations (créer, modifier, supprimer) délèguent aux server endpoints.
 * Pas de Realtime — les données système ne changent pas pendant une session live.
 */
export function useGameSystem() {
  const cultures = ref<CultureWithVirtues[]>([])
  const virtues = ref<Virtue[]>([])
  const rewards = ref<Reward[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // ── Fetch ────────────────────────────────────────────────────────────────────

  async function fetchAll() {
    loading.value = true
    error.value = null

    try {
      const [culturesData, virtuesData, rewardsData] = await Promise.all([
        $fetch<CultureWithVirtues[]>('/api/game-system/cultures'),
        $fetch<Virtue[]>('/api/game-system/virtues'),
        $fetch<Reward[]>('/api/game-system/rewards'),
      ])
      cultures.value = culturesData
      virtues.value = virtuesData
      rewards.value = rewardsData
    }
    catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Erreur lors du chargement'
    }
    finally {
      loading.value = false
    }
  }

  async function fetchCultures() {
    const data = await $fetch<CultureWithVirtues[]>('/api/game-system/cultures')
    cultures.value = data
  }

  async function fetchVirtues() {
    const data = await $fetch<Virtue[]>('/api/game-system/virtues')
    virtues.value = data
  }

  async function fetchRewards() {
    const data = await $fetch<Reward[]>('/api/game-system/rewards')
    rewards.value = data
  }

  // ── Helpers ──────────────────────────────────────────────────────────────────

  function getCultureById(id: string): CultureWithVirtues | undefined {
    return cultures.value.find(c => c.id === id)
  }

  function getVirtuesByCulture(cultureId: string): Array<{ id: string; identifier: string; name: string }> {
    const culture = getCultureById(cultureId)
    return culture?.cultural_virtues ?? []
  }

  // ── CRUD Cultures ────────────────────────────────────────────────────────────

  async function createCulture(payload: Omit<Culture, 'id'>) {
    const data = await $fetch<CultureWithVirtues>('/api/game-system/cultures', {
      method: 'POST',
      body: payload,
    })
    cultures.value.push({ ...data, cultural_virtues: [] })
    return data
  }

  async function updateCulture(id: string, payload: Partial<Omit<Culture, 'id'>>) {
    const data = await $fetch<Culture>(`/api/game-system/cultures/${id}`, {
      method: 'PATCH',
      body: payload,
    })
    const idx = cultures.value.findIndex(c => c.id === id)
    if (idx !== -1) {
      cultures.value[idx] = { ...cultures.value[idx], ...data }
    }
    return data
  }

  async function deleteCulture(id: string) {
    await $fetch(`/api/game-system/cultures/${id}`, { method: 'DELETE' })
    cultures.value = cultures.value.filter(c => c.id !== id)
  }

  // ── CRUD Cultural Virtues ────────────────────────────────────────────────────

  async function createCulturalVirtue(cultureId: string, payload: Omit<CulturalVirtue, 'id' | 'culture_id'>) {
    const data = await $fetch<CulturalVirtue & { culture_id: string }>('/api/game-system/virtues', {
      method: 'POST',
      body: { ...payload, culture_id: cultureId },
    })
    // Mettre à jour la liste inline de la culture
    const culture = cultures.value.find(c => c.id === cultureId)
    if (culture) {
      culture.cultural_virtues.push({ id: data.id, identifier: data.identifier, name: data.name })
    }
    return data
  }

  async function updateCulturalVirtue(id: string, payload: Partial<Omit<CulturalVirtue, 'id' | 'culture_id'>>) {
    const data = await $fetch<CulturalVirtue>(`/api/game-system/virtues/${id}`, {
      method: 'PATCH',
      body: { ...payload, is_cultural: true },
    })
    // Mettre à jour dans la culture parente
    for (const culture of cultures.value) {
      const idx = culture.cultural_virtues.findIndex(v => v.id === id)
      if (idx !== -1) {
        culture.cultural_virtues[idx] = { id: data.id, identifier: data.identifier, name: data.name }
        break
      }
    }
    return data
  }

  async function deleteCulturalVirtue(id: string, cultureId: string) {
    await $fetch(`/api/game-system/virtues/${id}?is_cultural=true`, { method: 'DELETE' })
    const culture = cultures.value.find(c => c.id === cultureId)
    if (culture) {
      culture.cultural_virtues = culture.cultural_virtues.filter(v => v.id !== id)
    }
  }

  // ── CRUD Virtues ordinaires ──────────────────────────────────────────────────

  async function createVirtue(payload: Omit<Virtue, 'id'>) {
    const data = await $fetch<Virtue>('/api/game-system/virtues', {
      method: 'POST',
      body: payload,
    })
    virtues.value.push(data)
    return data
  }

  async function updateVirtue(id: string, payload: Partial<Omit<Virtue, 'id'>>) {
    const data = await $fetch<Virtue>(`/api/game-system/virtues/${id}`, {
      method: 'PATCH',
      body: payload,
    })
    const idx = virtues.value.findIndex(v => v.id === id)
    if (idx !== -1) virtues.value[idx] = data
    return data
  }

  async function deleteVirtue(id: string) {
    await $fetch(`/api/game-system/virtues/${id}`, { method: 'DELETE' })
    virtues.value = virtues.value.filter(v => v.id !== id)
  }

  // ── CRUD Récompenses ─────────────────────────────────────────────────────────

  async function createReward(payload: Omit<Reward, 'id'>) {
    const data = await $fetch<Reward>('/api/game-system/rewards', {
      method: 'POST',
      body: payload,
    })
    rewards.value.push(data)
    return data
  }

  async function updateReward(id: string, payload: Partial<Omit<Reward, 'id'>>) {
    const data = await $fetch<Reward>(`/api/game-system/rewards/${id}`, {
      method: 'PATCH',
      body: payload,
    })
    const idx = rewards.value.findIndex(r => r.id === id)
    if (idx !== -1) rewards.value[idx] = data
    return data
  }

  async function deleteReward(id: string) {
    await $fetch(`/api/game-system/rewards/${id}`, { method: 'DELETE' })
    rewards.value = rewards.value.filter(r => r.id !== id)
  }

  return {
    // State
    cultures: readonly(cultures),
    virtues: readonly(virtues),
    rewards: readonly(rewards),
    loading: readonly(loading),
    error: readonly(error),

    // Fetch
    fetchAll,
    fetchCultures,
    fetchVirtues,
    fetchRewards,

    // Helpers
    getCultureById,
    getVirtuesByCulture,

    // CRUD cultures
    createCulture,
    updateCulture,
    deleteCulture,

    // CRUD cultural virtues
    createCulturalVirtue,
    updateCulturalVirtue,
    deleteCulturalVirtue,

    // CRUD virtues ordinaires
    createVirtue,
    updateVirtue,
    deleteVirtue,

    // CRUD récompenses
    createReward,
    updateReward,
    deleteReward,
  }
}
