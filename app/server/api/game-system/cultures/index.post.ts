import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)

  const { data: { user } } = await client.auth.getUser()
  if (!user) throw createError({ statusCode: 401, message: 'Non authentifié' })

  const body = await readBody(event)

  const {
    name,
    description = null,
    starting_attributes = [],
    endurance_bonus = 0,
    hope_bonus = 0,
    parade_bonus = 0,
    starting_favored_skills = [],
    starting_combat_skills = {},
  } = body

  if (!name?.trim()) {
    throw createError({ statusCode: 400, message: 'Le nom est requis' })
  }

  const { data, error } = await client
    .from('cultures')
    .insert({
      name: name.trim(),
      description: description ?? null,
      starting_attributes,
      endurance_bonus,
      hope_bonus,
      parade_bonus,
      starting_favored_skills,
      starting_combat_skills,
    })
    .select('id, name, description, endurance_bonus, hope_bonus, parade_bonus, starting_favored_skills, starting_combat_skills')
    .single()

  if (error) throw createError({ statusCode: 500, message: error.message })

  return data
})
