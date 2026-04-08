import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)

  const { data: { user } } = await client.auth.getUser()
  if (!user) throw createError({ statusCode: 401, message: 'Non authentifié' })

  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, message: 'ID manquant' })

  const { data, error } = await client
    .from('cultures')
    .select('*, cultural_virtues(id, identifier, name, description, variants)')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') throw createError({ statusCode: 404, message: 'Culture introuvable' })
    throw createError({ statusCode: 500, message: error.message })
  }

  return data
})
