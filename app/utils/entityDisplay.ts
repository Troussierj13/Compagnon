import type { EntityType } from '~/types/rpg'

/**
 * Couleur du token par type d'entité.
 * Valeurs : classes Tailwind CSS (bg-xxx) pour les tokens sur la battlemap.
 * Auto-importé par Nuxt — accessible sans import dans les composants.
 */
export const ENTITY_TOKEN_COLOR: Record<EntityType, string> = {
  character: 'bg-blue-500',
  combatant:  'bg-red-600',
  enemy:      'bg-red-700',
  npc:        'bg-amber-500',
  item:       'bg-emerald-500',
  zone:       'bg-purple-500',
}

/**
 * Icône du token par type d'entité.
 * Valeurs : noms d'icônes @nuxt/ui (Heroicons).
 * Auto-importé par Nuxt — accessible sans import dans les composants.
 */
export const ENTITY_TOKEN_ICON: Record<EntityType, string> = {
  character: 'i-heroicons-user',
  combatant:  'i-heroicons-bolt',
  enemy:      'i-heroicons-fire',
  npc:        'i-heroicons-chat-bubble-left',
  item:       'i-heroicons-gift',
  zone:       'i-heroicons-map-pin',
}
