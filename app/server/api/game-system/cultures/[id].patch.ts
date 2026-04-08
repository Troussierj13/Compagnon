import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)

  const { data: { user } } = await client.auth.getUser()
  if (!user) throw createError({ statusCode: 401, message: 'Non authentifié' })

  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, message: 'ID manquant' })

  const body = await readBody(event)

  // Sélectionner uniquement les champs autorisés
  const allowed = [
    'name', 'description', 'starting_attributes',
    'endurance_bonus', 'hope_bonus', 'parade_bonus',
    'starting_favored_skills', 'starting_combat_skills',
  ] as const

  const updates: Record<string, unknown> = {}
  for (const key of allowed) {
    if (key in body) updates[key] = body[key]
  }

  if (Object.keys(updates).length === 0) {
    throw createError({ statusCode: 400, message: 'Aucun champ à mettre à jour' })
  }

  if ('name' in updates && !updates.name) {
    throw createError({ statusCode: 400, message: 'Le nom ne peut pas être vide' })
  }

  const { data, error } = await client
    .from('cultures')
    .update(updates)
    .eq('id', id)
    .select('id, name, description, endurance_bonus, hope_bonus, parade_bonus, starting_favored_skills, starting_combat_skills')
    .single()

  if (error) {
    if (error.code === 'PGRST116') throw createError({ statusCode: 404, message: 'Culture introuvable' })
    throw createError({ statusCode: 500, message: error.message })
  }

  return data
})
