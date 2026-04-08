import { useSupabaseAdmin } from '~/server/utils/supabaseAdmin'

export default defineEventHandler(async (event) => {
  const client = useSupabaseAdmin()

  const query = getQuery(event)

  // Filtre optionnel par culture (retourne les vertus culturelles d'une culture)
  // Sans filtre : retourne les vertus ordinaires (table virtues)
  if (query.culture_id) {
    const { data, error } = await client
      .from('cultural_virtues')
      .select('id, identifier, name, description, variants, culture_id')
      .eq('culture_id', query.culture_id as string)
      .order('name')

    if (error) throw createError({ statusCode: 500, message: error.message })
    return data
  }

  const { data, error } = await client
    .from('virtues')
    .select('id, identifier, name, description, variants')
    .order('name')

  if (error) throw createError({ statusCode: 500, message: error.message })

  return data
})
