/**
 * Middleware pour les routes /player/*.
 * Vérifie que la session joueur est présente dans le localStorage.
 * Si absente, redirige vers /player/join.
 */
export default defineNuxtRouteMiddleware((to) => {
  // Côté serveur, impossible de lire le localStorage → on laisse passer
  // La page côté client prendra le relais avec restore()
  if (import.meta.server) return

  const stored = localStorage.getItem(PLAYER_SESSION_STORAGE_KEY)

  if (!stored && to.path !== '/player/join') {
    return navigateTo('/player/join')
  }
})
