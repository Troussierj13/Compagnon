import { randomInt } from 'node:crypto'

const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // sans O/0/1/I pour éviter confusions

/**
 * Génère un code de session lisible de 6 caractères.
 * Ex: "XK7P2M"
 */
export function generateJoinCode(length = 6): string {
  return Array.from({ length }, () => CHARS[randomInt(0, CHARS.length)]).join('')
}
