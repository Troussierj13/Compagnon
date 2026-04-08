import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)

  const { data: { user } } = await client.auth.getUser()
  if (!user) throw createError({ statusCode: 401, message: 'Non authentifié' })

  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, message: 'ID manquant' })

  const body = await readBody(event)

  // is_cultural flag permet de cibler la bonne table
  const { is_cultural = false, ...rest } = body

  const allowed = ['identifier', 'name', 'description', 'variants'] as const

  const updates: Record<string, unknown> = {}
  for (const key of allowed) {
    if (key in rest) updates[key] = rest[key]
  }

  if (Object.keys(updates).length === 0) {
    throw createError({ statusCode: 400, message: 'Aucun champ à mettre à jour' })
  }

  const table = is_cultural ? 'cultural_virtues' : 'virtues'
  const selectFields = is_cultural
    ? 'id, identifier, name, description, variants, culture_id'
    : 'id, identifier, name, description, variants'

  const { data, error } = await client
    .from(table)
    .update(updates)
    .eq('id', id)
    .select(selectFields)
    .single()

  if (error) {
    if (error.code === 'PGRST116') throw createError({ statusCode: 404, message: 'Vertu introuvable' })
    throw createError({ statusCode: 500, message: error.message })
  }

  return data
})
