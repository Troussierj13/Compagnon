import { randomInt } from 'node:crypto'

const CHARSET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
const CODE_LENGTH = 6

/**
 * Génère un code de session aléatoire de 6 caractères.
 * Utilise crypto.randomInt (Node.js) pour éviter les biais de Math.random().
 * Charset: lettres majuscules + chiffres (sans caractères ambigus O, 0, I, 1).
 */
export function generateJoinCode(): string {
  let code = ''
  for (let i = 0; i < CODE_LENGTH; i++) {
    code += CHARSET[randomInt(0, CHARSET.length)]
  }
  return code
}
