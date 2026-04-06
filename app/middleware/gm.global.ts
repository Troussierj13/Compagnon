/**
 * Middleware MJ global — intercepte automatiquement toutes les routes /gm/**.
 * Redirige vers /login si l'utilisateur n'est pas authentifié.
 * S'exécute côté client uniquement (import.meta.server guard) pour éviter le flash SSR.
 * Référence : CLAUDE.md § Modèle d'identité
 */
export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server) return
  if (!to.path.startsWith('/gm')) return

  const user = useSupabaseUser()
  if (!user.value) {
    return navigateTo('/login')
  }
})
