/**
 * Middleware de protection des routes /gm/*.
 * Redirige vers la page de connexion si le MJ n'est pas authentifié.
 */
export default defineNuxtRouteMiddleware(() => {
  const user = useSupabaseUser()

  if (!user.value) {
    return navigateTo('/login')
  }
})
