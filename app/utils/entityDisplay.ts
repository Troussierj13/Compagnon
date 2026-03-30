import type { EntityType } from '~/types/rpg'

/**
 * Constantes d'affichage des tokens d'entité.
 * Partagées entre GmEntityToken et PlayerEntityToken.
 */
export const ENTITY_TOKEN_COLOR: Record<EntityType, string> = {
  enemy: 'bg-red-600',
  npc: 'bg-blue-600',
  item: 'bg-yellow-500',
  zone: 'bg-green-700',
}

export const ENTITY_TOKEN_ICON: Record<EntityType, string> = {
  enemy: 'i-heroicons-skull',
  npc: 'i-heroicons-user',
  item: 'i-heroicons-gift',
  zone: 'i-heroicons-map-pin',
}
