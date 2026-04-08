import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)

  const { data: { user } } = await client.auth.getUser()
  if (!user) throw createError({ statusCode: 401, message: 'Non authentifié' })

  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, message: 'ID manquant' })

  const query = getQuery(event)
  // is_cultural=true → supprimer depuis cultural_virtues
  const is_cultural = query.is_cultural === 'true'

  const table = is_cultural ? 'cultural_virtues' : 'virtues'

  const { error } = await client
    .from(table)
    .delete()
    .eq('id', id)

  if (error) throw createError({ statusCode: 500, message: error.message })

  return { success: true }
})
