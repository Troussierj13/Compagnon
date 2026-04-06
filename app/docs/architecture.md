# Architecture — Compagnon JdR

> Référence principale : [`vision/README.md`](./vision/README.md)
> Ce document décrit les décisions techniques d'implémentation. En cas de contradiction avec `/vision`, `/vision` a priorité.

---

## Vue d'ensemble

Application web de support pour les parties de jeu de rôle sur table. Elle couvre deux phases : la **préparation** (back-office entre les sessions) et le **jeu en live** (panneau MJ + affichage TV + vue joueur téléphone).

## Les 4 surfaces

| Surface | URL | Identité | Temps réel |
|---|---|---|---|
| Back-office MJ | `/gm/**` | Supabase Auth | Partiel (session live) |
| Panneau session MJ | `/gm/.../session/[id]` | Supabase Auth | ✅ Complet |
| Affichage TV | `/display/[sessionId]` | Aucune (UUID = secret d'URL) | ✅ Complet |
| Vue joueur téléphone | `/player/**` | `join_code` + localStorage | ✅ Complet |

## Modèle d'identité

| Acteur | Identité | Credential |
|---|---|---|
| MJ | Supabase Auth (`auth.uid()`) | Email + mot de passe |
| Joueur | Anonyme | `join_code` (6 chars) + `participant_id` (UUID, localStorage) |
| TV | Aucune | UUID de session dans l'URL |
| Raspberry Pi Pico | Token statique | `NFC_SECRET` (variable d'environnement) |

## Stack technique

- **Nuxt 3** — framework full-stack (SSR + server endpoints via Nitro)
- **@nuxtjs/supabase** — Auth MJ + client anon Realtime
- **@nuxt/ui** — composants UI
- **Supabase** — Postgres (données), RLS (sécurité), Realtime (temps réel), Storage (images, sons)
- **TypeScript strict**

---

## Parcours MJ

```
Login (Supabase Auth)
  └─ Dashboard campagnes (/gm)
      └─ Détail campagne (/gm/campaigns/[id])
          ├─ Fiches personnages joueurs
          ├─ Fiches PNJ
          ├─ Fiches ennemis + encodage NFC
          └─ Session live (/gm/campaigns/[id]/session/[sessionId])
              ├─ Gestion scènes + entités + tokens
              ├─ Contrôle affichage TV (mode, overlays, fil d'initiative)
              ├─ Gestion loot + distribution joueurs
              ├─ Gestion inventaire PNJ en live
              └─ Réception spawns NFC
```

## Parcours TV (affichage spectateur)

```
URL /display/[sessionId] ouverte dans le navigateur TV
  └─ Modes d'affichage (piloté par sessions.display_mode) :
      ├─ Waiting Screen  — fond d'écran + nom campagne
      ├─ Battlemap       — carte + tokens + fil d'initiative
      └─ Voyage          — carte monde + marqueurs + règles
  └─ Overlay (par-dessus n'importe quel mode)
      └─ Fiches, artworks, textes libres poussés par le MJ
```

## Parcours Joueur (téléphone)

```
/player/join  →  Saisie join_code + nom + choix personnage
  └─ /player/scene  →  Scène active + inventaire + fiche perso
      └─ /player/sheet  →  Feuille de perso plein écran (tablette)
```

---

## Accès aux données

### MJ (authentifié)
Lit et écrit directement via `useSupabaseClient()`. RLS autorise toutes les opérations sur les ressources dont `gm_user_id = auth.uid()`.

**Exception drag & drop tokens** : les mises à jour de position (`scene_entities.position`) pendant un drag se font directement via le client Supabase MJ authentifié (pas via server endpoint) pour garantir la fluidité temps réel. Throttle côté client à ~30 updates/s. Voir `vision/feature-live-stats-dragdrop.md`.

### TV (anonyme, URL secrète)
La TV appelle `/api/display/[id]/state` — endpoint Nitro sans `participant_id`. L'UUID de session fait office de secret. Retourne uniquement les entités `visible_to_players = true`. Utilise `useSupabaseAdmin()`.

### Joueur (anonyme)
Le joueur ne lit **jamais** directement les tables Supabase depuis le front-end. Toutes ses lectures transitent par des server endpoints Nitro qui :
1. Valident le `participant_id` via `validateParticipant()`
2. Utilisent `useSupabaseAdmin()` pour contourner le RLS
3. Retournent uniquement les champs nécessaires

### Raspberry Pi Pico (NFC)
Appelle `/api/nfc/trigger` avec un token statique dans le header `Authorization: Bearer <NFC_SECRET>`. Le endpoint décode le payload base64, extrait les données de l'ennemi, crée l'entité dans la scène active.

---

## Realtime

Supabase Realtime activé sur : `sessions`, `scenes`, `scene_entities`, `overlays`, `map_markers`, `characters`.

### TV (`useDisplaySession`)
- Écoute `sessions` (changement de `display_mode`, `active_scene_id`, `combat_active`, `combat_round`)
- Écoute `scene_entities` de la scène active (spawn, déplacement, visibilité, `initiative_order`, `is_current_turn`)
- Écoute `nfc_events` de la session (animation overlay de spawn)

### MJ (`useGMSession`, `useScene`)
- Souscription directe via client Supabase Auth
- Sur INSERT `session_participants` : refetch le participant complet (le payload Realtime ne contient pas les relations jointes)

### Joueur (`usePlayerSession`)
- Exception documentée : souscription directe via client anon pour `sessions` et `scene_entities`
- Sur changement `active_scene_id` : nettoyage de l'ancienne subscription avant création de la nouvelle

---

## Schéma de base de données

> **Source de vérité : `app/docs/technical/schema.md`**
> Ce fichier contient le schéma complet (toutes les tables, colonnes, RLS, indexes, migrations SQL).
> Ne pas dupliquer le schéma ici — consulter `schema.md` directement.

---

## Système NFC

### Flux complet
```
Figurine posée → Pico lit la puce → POST /api/nfc/trigger { payload: base64, scene_id }
  → Nitro vérifie NFC_SECRET → décode base64 → crée scene_entity
  → Supabase Realtime → TV joue animation selon rareté
```

### Encodage
Les données d'un ennemi sont encodées en base64 par un programme Node externe. La rareté fait partie des données encodées et est extraite côté serveur pour déterminer l'animation de spawn.

### Animations par rareté
Configurables dans les paramètres de l'app. Sons issus d'une bibliothèque intégrée (pas d'upload). Voir `vision/feature-display-tv.md` pour le détail.

---

## Utilitaires serveur

### `server/utils/supabaseAdmin.ts`
Singleton Nitro : instance `service_role` créée une seule fois. Ne pas recréer manuellement.

### `server/utils/validateParticipant.ts`
Validation `participant_id ↔ session_id`. À appeler en premier dans tout endpoint joueur. Lance 400 ou 403 selon le cas.

### `server/utils/generateJoinCode.ts`
Génère un code 6 chars avec `crypto.randomInt`. Alphabet sans ambiguïté (`0/O`, `1/I` exclus). Espace ~1 milliard de combinaisons.

## Utilitaires client

### `utils/entityDisplay.ts` *(à créer — Phase 0.6)*
Constantes `ENTITY_TOKEN_COLOR` et `ENTITY_TOKEN_ICON` typées par `EntityType`. Auto-importées via Nuxt. À utiliser dans tous les composants affichant un token.

---

## Pièges connus

### Jointures Supabase ambiguës (PostgREST)
Quand deux FK existent entre deux tables, spécifier la FK explicitement :
```typescript
.select('*, active_scene:scenes!active_scene_id(*)')  // ✅
.select('*, active_scene:scenes(*)')                   // ❌ ambigu
```

### Realtime — payload INSERT sans relations jointes
Sur un événement INSERT de `postgres_changes`, `payload.new` ne contient que les colonnes directes. Faire un fetch ciblé après pour récupérer les relations.

### Refs des composables — isolation d'état
Les refs sont déclarées à l'intérieur de la fonction composable — chaque appel crée une instance isolée. Pour partager l'état entre composants, utiliser `provide/inject` depuis un parent commun.

### Position tokens — convention pourcentage
`scene_entities.position` (`{ x, y }`) est stocké en **pourcentage** de la battlemap (0–100), pas en pixels. Conversion à l'affichage : `left: ${x}%`, `top: ${y}%`. Cela rend les positions indépendantes de la résolution de la TV et du panneau MJ.
