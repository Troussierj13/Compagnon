import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)

  const { data: { user } } = await client.auth.getUser()
  if (!user) throw createError({ statusCode: 401, message: 'Non authentifié' })

  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, message: 'ID manquant' })

  const { error } = await client
    .from('rewards')
    .delete()
    .eq('id', id)

  if (error) throw createError({ statusCode: 500, message: error.message })

  return { success: true }
})
