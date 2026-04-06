# Sécurité — Modèle RLS et patterns d'accès

> Référence principale : [`vision/README.md`](./vision/README.md)

---

## Principes généraux

1. **RLS activé sur toutes les tables** — pas d'accès sans policy explicite
2. **Le joueur anonyme n'a aucune policy SELECT directe** — toutes ses lectures passent par des server endpoints
3. **La TV n'a aucune policy SELECT directe** — elle passe par `/api/display/[id]/state`
4. **Le Pico NFC s'authentifie par token statique** — jamais via Supabase Auth
5. **Aucun `select('*')` dans les endpoints publics** — sélections explicites uniquement
6. **Inputs normalisés côté serveur** — `.trim().toUpperCase()` sur les join_codes

---

## Modèle d'accès par surface

| Surface | Mécanisme d'auth | Accès Supabase |
|---|---|---|
| Back-office MJ | Supabase Auth (JWT cookie) | Client front-end, RLS `auth.uid()` |
| Panneau session MJ | Supabase Auth (JWT cookie) | Client front-end, RLS `auth.uid()` |
| Affichage TV | UUID de session dans l'URL | Server endpoint + `service_role` |
| Vue joueur | `participant_id` en localStorage | Server endpoint + `service_role` |
| Pico NFC | `NFC_SECRET` dans le header | Server endpoint + `service_role` |

---

## Policies RLS par table

### `campaigns`
- `campaigns_gm_all` : MJ CRUD complet (`auth.uid() = gm_user_id`)

### `characters`
- `characters_gm_all` : MJ CRUD complet
- `characters_player_read` : lecture anonyme restreinte — uniquement le personnage assigné au joueur via `session_participants`, dans une session `active`. Malgré cette policy, les composables joueur passent toujours par le server endpoint (contrôle des champs exposés : `id`, `name`, `player_name` uniquement — jamais `data`).

### `sessions`
- `sessions_gm_all` : MJ CRUD complet
- Pas de policy SELECT anon — **choix délibéré** : TV et joueur passent par server endpoints

### `scenes`
- `scenes_gm_all` : MJ CRUD complet
- Pas de policy SELECT anon

### `scene_entities`
- `scene_entities_gm_all` : MJ CRUD complet
- Pas de policy SELECT anon — le server endpoint filtre `visible_to_players = true`

### `session_participants`
- Géré entièrement côté serveur (client `service_role`)

### `overlays`
- `overlays_gm_all` : MJ CRUD complet
- Pas de policy SELECT anon — la TV lit via `/api/display/[id]/state`

### `map_markers`
- `map_markers_gm_all` : MJ CRUD complet
- Pas de policy SELECT anon — la TV lit via server endpoint

### `combatants`
- `combatants_gm_all` : MJ CRUD complet (ennemis + PNJ unifiés)
- Pas de policy SELECT anon — exposés uniquement via server endpoints avec filtrage des champs

---

## Authentification endpoint NFC (`/api/nfc/trigger`)

Le Raspberry Pi Pico envoie un token statique dans le header HTTP :

```
Authorization: Bearer <NFC_SECRET>
```

`NFC_SECRET` est une variable d'environnement côté serveur (jamais exposée au client). Le endpoint rejette toute requête sans ce header ou avec un token incorrect (403).

```typescript
const secret = useRuntimeConfig().nfcSecret
const auth = getHeader(event, 'authorization')
if (auth !== `Bearer ${secret}`) {
  throw createError({ statusCode: 403, message: 'Non autorisé' })
}
```

---

## Authentification affichage TV (`/api/display/[id]/state`)

Pas de token — l'UUID de session (v4, 128 bits) dans l'URL fait office de secret. L'espace d'UUID est suffisamment large pour rendre la découverte par force brute impraticable.

Ce choix est intentionnel : la TV n'a pas de mécanisme de saisie, une URL suffit.

---

## Validation joueur — pattern standard

Tout endpoint servant des données à un joueur doit appeler `validateParticipant()` en premier :

```typescript
const sessionId = getRouterParam(event, 'id')
const participantId = getQuery(event).participant_id as string | undefined

await validateParticipant(sessionId, participantId)
// Lance 400 si manquant, 403 si la correspondance participant ↔ session est invalide

const admin = useSupabaseAdmin()
// Lire uniquement les champs nécessaires, jamais select('*')
```

---

## Ce qu'on ne doit jamais exposer

| Donnée | Raison |
|---|---|
| `gm_user_id` | UUID interne Supabase du MJ |
| `created_at`, `updated_at` | Métadonnées sans utilité UI |
| `scene_entities` avec `visible_to_players = false` | Entités cachées (secret MJ) |
| `characters.data` d'un autre joueur | Feuille de perso privée |
| `enemies.spawn_sound_url`, config spawn | Données internes de préparation MJ |
| `map_markers` avec `visible_on_display = false` | Notes privées MJ |

> **Attention aux relations jointes** : un `select('*, campaign:campaigns(*)')` expose `gm_user_id` via la relation. Toujours lister explicitement les colonnes : `campaign:campaigns(id, name)`.

---

## Génération de codes

Utiliser exclusivement `crypto.randomInt` de `node:crypto` :

```typescript
import { randomInt } from 'node:crypto'

const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
export function generateJoinCode(length = 6): string {
  return Array.from({ length }, () => CHARS[randomInt(0, CHARS.length)]).join('')
}
```

`Math.random()` est interdit pour tout ce qui sert de credential ou d'identifiant secret.

---

## Points d'attention futurs

- **Rate-limiting sur `/api/session/join`** : sans rate-limiting, un brute-force distribué sur les `join_code` reste possible. Ajouter un middleware Nitro de rate-limiting par IP.
- **Rate-limiting sur `/api/nfc/trigger`** : limiter les appels par IP pour éviter le spam depuis un Pico compromis.
- **TTL des sessions** : prévoir l'expiration automatique des sessions `active` via trigger Postgres ou job cron Supabase.
- **Rotation du `NFC_SECRET`** : prévoir une procédure de rotation sans downtime (re-flash du Pico).
