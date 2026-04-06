/**
 * Clés localStorage centralisées pour l'application.
 * Utiliser ces constantes dans tout le code joueur pour éviter les typos.
 * Auto-importé par Nuxt — accessible sans import dans les composants.
 */
export const STORAGE_KEYS = {
  /** UUID du participant (retourné par POST /api/session/join) */
  PARTICIPANT_ID: 'participant_id',
  /** UUID de la session rejointe */
  SESSION_ID: 'session_id',
  /** Nom saisi par le joueur au join */
  PLAYER_NAME: 'player_name',
} as const

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS]
