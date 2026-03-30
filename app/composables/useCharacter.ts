import type { Character, TORCharacterData } from '~/types/rpg'

/**
 * CRUD des personnages pour le MJ.
 */
export function useCharacter(campaignId: string) {
  const supabase = useSupabaseClient()
  const characters = ref<Character[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchAll() {
    loading.value = true
    error.value = null
    const { data, error: err } = await supabase
      .from('characters')
      .select('*')
      .eq('campaign_id', campaignId)
      .order('created_at', { ascending: true })

    if (err) {
      error.value = err.message
    } else {
      characters.value = data as Character[]
    }
    loading.value = false
  }

  async function create(
    name: string,
    playerName: string,
    data: Partial<TORCharacterData> = {},
  ): Promise<Character | null> {
    const defaultData: TORCharacterData = {
      culture: '',
      vocation: '',
      standard_of_living: '',
      attributes: { strength: 4, heart: 4, mind: 4 },
      endurance_max: 20,
      endurance_current: 20,
      hope_max: 10,
      hope_current: 10,
      shadow: 0,
      parry: 14,
      skills_strength: [],
      skills_heart: [],
      skills_mind: [],
      weapons: [],
      experience: 0,
      advancement: 0,
      virtues: [],
      rewards: [],
      ...data,
    }

    const { data: created, error: err } = await supabase
      .from('characters')
      .insert({ campaign_id: campaignId, name, player_name: playerName, data: defaultData })
      .select()
      .single()

    if (err) {
      error.value = err.message
      return null
    }
    characters.value.push(created as Character)
    return created as Character
  }

  async function update(id: string, patch: Partial<Character>) {
    const { error: err } = await supabase
      .from('characters')
      .update(patch)
      .eq('id', id)

    if (err) {
      error.value = err.message
      return false
    }
    const idx = characters.value.findIndex(c => c.id === id)
    if (idx !== -1) {
      characters.value[idx] = { ...characters.value[idx], ...patch }
    }
    return true
  }

  async function updateData(id: string, data: Partial<TORCharacterData>) {
    const character = characters.value.find(c => c.id === id)
    if (!character) return false
    const merged = { ...character.data, ...data }
    return update(id, { data: merged as TORCharacterData })
  }

  async function remove(id: string) {
    const { error: err } = await supabase
      .from('characters')
      .delete()
      .eq('id', id)

    if (err) {
      error.value = err.message
      return false
    }
    characters.value = characters.value.filter(c => c.id !== id)
    return true
  }

  return {
    characters: readonly(characters),
    loading: readonly(loading),
    error: readonly(error),
    fetchAll,
    create,
    update,
    updateData,
    remove,
  }
}
