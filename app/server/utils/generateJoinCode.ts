const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // sans O/0/1/I pour éviter confusions

/**
 * Génère un code de session lisible de 6 caractères.
 * Ex: "XK7P2M"
 */
export function generateJoinCode(): string {
  return Array.from({ length: 6 }, () => CHARS[Math.floor(Math.random() * CHARS.length)]).join('')
}
