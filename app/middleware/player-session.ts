/**
 * Middleware joueur — vérifie que participant_id et session_id sont en localStorage.
 * Si absent, redirige vers /player/join.
 * S'exécute côté client uniquement (import.meta.client).
 * Référence : CLAUDE.md § Modèle d'identité, architecture.md
 *
 * ⚠️ LIMITE DE SÉCURITÉ CONNUE (documentée, non corrigée) :
 * Ce middleware protège la navigation, mais usePlayerSession souscrit directement
 * à Supabase Realtime (client anon) pour scene_entities. Le payload Realtime contient
 * toutes les entités y compris visible_to_players = false. Filtrage côté client uniquement.
 * Un client malicieux peut recevoir et lire les entités cachées par le MJ.
 * Voir architecture.md § Exception Realtime joueur.
 */
export default defineNuxtRouteMiddleware((_to, _from) => {
  if (!import.meta.client) return

  const participantId = localStorage.getItem(STORAGE_KEYS.PARTICIPANT_ID)
  const sessionId     = localStorage.getItem(STORAGE_KEYS.SESSION_ID)

  if (!participantId || !sessionId) {
    return navigateTo('/player/join')
  }
})
