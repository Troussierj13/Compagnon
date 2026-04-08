import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)

  const { data: { user } } = await client.auth.getUser()
  if (!user) throw createError({ statusCode: 401, message: 'Non authentifié' })

  const { data, error } = await client
    .from('cultures')
    .select('id, name, description, endurance_bonus, hope_bonus, parade_bonus, starting_favored_skills, starting_combat_skills, cultural_virtues(id, identifier, name)')
    .order('name')

  if (error) throw createError({ statusCode: 500, message: error.message })

  return data
})
