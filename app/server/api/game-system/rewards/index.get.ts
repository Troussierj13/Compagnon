import { useSupabaseAdmin } from '~/server/utils/supabaseAdmin'

export default defineEventHandler(async (_event) => {
  const client = useSupabaseAdmin()

  const { data, error } = await client
    .from('rewards')
    .select('id, identifier, name, description, valid_targets, modifiers')
    .order('name')

  if (error) throw createError({ statusCode: 500, message: error.message })

  return data
})
