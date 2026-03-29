# Sécurité — Modèle RLS et patterns d'accès

## Principes généraux

1. **Le RLS Supabase est activé sur toutes les tables** — pas d'accès sans policy explicite
2. **Le joueur anonyme n'a aucune policy SELECT directe** — toutes ses lectures passent par des server endpoints
3. **Aucun `select('*')` dans les endpoints publics** — sélections explicites uniquement
4. **Inputs normalisés côté serveur** — `.trim().toUpperCase()` sur les join_codes, ne pas faire confiance au format client

## Policies RLS par table

### `campaigns`
- `campaigns_gm_all` : MJ CRUD complet (`auth.uid() = gm_user_id`)
- Colonne `gm_user_id` doit être fournie à l'INSERT (ou via `DEFAULT auth.uid()` si ajouté au schéma)

### `characters`
- `characters_gm_all` : MJ CRUD complet (`auth.uid() = gm_user_id` via la campagne)
- Pas de policy SELECT anon — les feuilles de personnage ne sont jamais accessibles directement par les joueurs

### `sessions`
- `sessions_gm_all` : MJ CRUD complet
- Pas de policy SELECT anon — **choix délibéré** : la lecture par le joueur passe par le server endpoint `/api/session/[id]/state`

### `scenes`
- `scenes_gm_all` : MJ CRUD complet
- Pas de policy SELECT anon — même principe que `sessions`

### `scene_entities`
- `scene_entities_gm_all` : MJ CRUD complet
- Pas de policy SELECT anon — le server endpoint filtre `visible_to_players = true` avant de retourner les entités

### `session_participants`
- Géré entièrement côté serveur (endpoints avec client admin)

## Server endpoints et validation joueur

Tout endpoint servant des données à un joueur doit :

```typescript
// 1. Extraire les identifiants
const sessionId = getRouterParam(event, 'id')
const participantId = getQuery(event).participant_id as string

// 2. Valider la correspondance participant ↔ session
const { data: participant } = await admin
  .from('session_participants')
  .select('id')
  .eq('id', participantId)
  .eq('session_id', sessionId)
  .single()

if (!participant) throw createError({ statusCode: 403, ... })

// 3. Lire avec le client admin (service_role)
const { data } = await admin.from('sessions').select('id, status, active_scene_id, ...').single()
```

## Ce qu'on ne doit jamais exposer aux joueurs

| Donnée | Raison |
|---|---|
| `gm_user_id` | UUID interne de l'identité Supabase du MJ |
| `created_at`, `updated_at` | Métadonnées opérationnelles sans utilité UI |
| `scene_entities` avec `visible_to_players = false` | Entités cachées (secret MJ) |
| `characters.data` d'un autre joueur | Feuille de perso privée |

## Génération de codes

Utiliser exclusivement `crypto.randomInt` de `node:crypto` pour tout code ou token généré côté serveur :

```typescript
import { randomInt } from 'node:crypto'

const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
export function generateJoinCode(length = 6): string {
  return Array.from({ length }, () => CHARS[randomInt(0, CHARS.length)]).join('')
}
```

`Math.random()` est interdit pour les valeurs servant de credential ou d'identifiant secret.

## Points d'attention futurs

- **Rate-limiting sur `/api/session/join`** : l'espace de `join_code` est ~1 milliard, mais sans rate-limiting un brute-force distribué reste possible. Ajouter un middleware Nitro de rate-limiting par IP.
- **TTL des sessions** : prévoir l'expiration automatique des sessions `active` via un trigger ou un job cron Supabase.
- **Auth anonyme Supabase** : si la complexité des policies RLS joueur augmente, envisager l'activation de l'auth anonyme Supabase pour lier une identité côté DB sans imposer d'inscription.
