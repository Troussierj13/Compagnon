import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)

  const { data: { user } } = await client.auth.getUser()
  if (!user) throw createError({ statusCode: 401, message: 'Non authentifié' })

  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, message: 'ID manquant' })

  const body = await readBody(event)

  const allowed = ['identifier', 'name', 'description', 'valid_targets', 'modifiers'] as const

  const updates: Record<string, unknown> = {}
  for (const key of allowed) {
    if (key in body) updates[key] = body[key]
  }

  if (Object.keys(updates).length === 0) {
    throw createError({ statusCode: 400, message: 'Aucun champ à mettre à jour' })
  }

  const { data, error } = await client
    .from('rewards')
    .update(updates)
    .eq('id', id)
    .select('id, identifier, name, description, valid_targets, modifiers')
    .single()

  if (error) {
    if (error.code === 'PGRST116') throw createError({ statusCode: 404, message: 'Récompense introuvable' })
    throw createError({ statusCode: 500, message: error.message })
  }

  return data
})
