import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)

  const { data: { user } } = await client.auth.getUser()
  if (!user) throw createError({ statusCode: 401, message: 'Non authentifié' })

  const body = await readBody(event)

  const {
    identifier,
    name,
    description = '',
    valid_targets = [],
    modifiers = [],
  } = body

  if (!identifier?.trim()) {
    throw createError({ statusCode: 400, message: "L'identifiant est requis" })
  }
  if (!name?.trim()) {
    throw createError({ statusCode: 400, message: 'Le nom est requis' })
  }

  const { data, error } = await client
    .from('rewards')
    .insert({
      identifier: identifier.trim(),
      name: name.trim(),
      description,
      valid_targets,
      modifiers,
    })
    .select('id, identifier, name, description, valid_targets, modifiers')
    .single()

  if (error) throw createError({ statusCode: 500, message: error.message })

  return data
})
