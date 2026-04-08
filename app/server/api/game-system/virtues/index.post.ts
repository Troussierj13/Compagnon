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
    variants = [],
    // Si culture_id fourni → vertu culturelle
    culture_id = null,
  } = body

  if (!identifier?.trim()) {
    throw createError({ statusCode: 400, message: "L'identifiant est requis" })
  }
  if (!name?.trim()) {
    throw createError({ statusCode: 400, message: 'Le nom est requis' })
  }

  if (culture_id) {
    // Vertu culturelle
    const { data, error } = await client
      .from('cultural_virtues')
      .insert({
        culture_id,
        identifier: identifier.trim(),
        name: name.trim(),
        description,
        variants,
      })
      .select('id, identifier, name, description, variants, culture_id')
      .single()

    if (error) throw createError({ statusCode: 500, message: error.message })
    return data
  }

  // Vertu ordinaire
  const { data, error } = await client
    .from('virtues')
    .insert({
      identifier: identifier.trim(),
      name: name.trim(),
      description,
      variants,
    })
    .select('id, identifier, name, description, variants')
    .single()

  if (error) throw createError({ statusCode: 500, message: error.message })

  return data
})
