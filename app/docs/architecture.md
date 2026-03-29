# Architecture — Compagnon JdR

## Vue d'ensemble

Application web de support pour les parties de jeu de rôle, construite avec Nuxt 3 et Supabase. Elle sert deux types d'utilisateurs avec des parcours distincts.

## Modèle d'identité

| Acteur | Identité | Credential |
|---|---|---|
| MJ (Game Master) | Supabase Auth (`auth.uid()`) | Email + mot de passe |
| Joueur | Anonyme | `join_code` de session (6 chars) + `participant_id` (UUID, localStorage) |

Cette asymétrie est le principe central qui gouverne toutes les décisions d'accès aux données.

## Stack technique

- **Nuxt 3** — framework full-stack (SSR + server endpoints via Nitro)
- **@nuxtjs/supabase** — intégration Supabase Auth pour le MJ, client anon pour les joueurs
- **@nuxt/ui** — composants UI
- **Supabase** — Postgres (données), RLS (sécurité), Realtime (temps réel), Storage (battlemaps)
- **TypeScript strict**

## Parcours MJ

```
Login (Supabase Auth)
  └─ Dashboard campagnes (/gm)
      └─ Détail campagne (/gm/campaigns/[id])
          ├─ Gestion personnages (/gm/campaigns/[id]/characters/[charId])
          └─ Session live (/gm/campaigns/[id]/session/[sessionId])
              ├─ Gestion scènes + entités
              ├─ Vue participants temps réel
              └─ Upload battlemaps (Supabase Storage)
```

Le middleware `gm.ts` protège toutes les routes `/gm/**` en vérifiant la session Supabase Auth.

## Parcours Joueur

```
Page d'accueil (/)
  └─ Rejoindre (/player/join)
      └─ [Saisit le join_code à 6 chars]
          └─ Scène en temps réel (/player/scene)
              └─ Feuille de personnage (/player/sheet)
```

Le middleware `player-session.ts` vérifie la présence de l'état local (`session_id + participant_id` dans localStorage). Le joueur n'a aucun compte Supabase.

## Accès aux données

### MJ (authentifié)

Le MJ utilise le client Supabase front-end (`useSupabaseClient()`). Le RLS autorise toutes les opérations sur les ressources dont `gm_user_id = auth.uid()`.

### Joueur (anonyme)

> Voir aussi : [ADR-001 — Pattern d'accès joueur](./adr/001-player-access-pattern.md)

Le joueur ne lit **jamais** directement les tables Supabase depuis le front-end. Toutes ses lectures transitent par des server endpoints Nuxt qui :
1. Valident le `participant_id` (correspondance `session_participants.id + session_id`)
2. Utilisent `useSupabaseAdmin()` (clé `service_role`) pour contourner le RLS
3. Retournent uniquement les champs nécessaires à l'UI joueur

```
Client joueur (anon)
  └─ $fetch('/api/session/[id]/state?participant_id=xxx')
      └─ Server endpoint (Nitro)
          ├─ Valide participant_id ↔ session_id
          ├─ useSupabaseAdmin() ← service_role, contourne RLS
          └─ Retourne { session, active_scene, scene_entities (visible uniquement) }
```

## Realtime

Supabase Realtime est activé sur trois tables : `sessions`, `scenes`, `scene_entities`.

### Côté MJ (`useGMSession`, `useScene`)
- Souscription directe via le client Supabase (authentifié, RLS autorise)
- Sur INSERT de `session_participants` : **refetch le participant complet** avec `character:characters(*)` (le payload Realtime ne contient pas les relations jointes)

### Côté joueur (`usePlayerSession`)
- Souscription directe via le client Supabase anon — **exception justifiée** : les subscriptions Realtime ne passent pas par RLS SELECT de la même façon. Le canal est établi après validation côté serveur.
- Sur changement de `active_scene_id` : nettoyage de l'ancienne subscription avant création de la nouvelle (éviter les memory leaks)

## Schéma de base de données

Tables principales :

| Table | Description | RLS |
|---|---|---|
| `campaigns` | Campagnes du MJ | MJ owner uniquement |
| `characters` | Personnages (feuille JSONB) | MJ CRUD, lecture joueur via server endpoint |
| `sessions` | Sessions de jeu | MJ CRUD, lecture joueur via server endpoint |
| `session_participants` | Joueurs d'une session | Contrôlé côté serveur |
| `scenes` | Scènes d'une session | MJ CRUD, lecture joueur via server endpoint |
| `scene_entities` | Entités d'une scène | MJ CRUD, lecture joueur filtrée `visible_to_players` |

Le schéma complet avec indexes, triggers `updated_at` et configuration Realtime est dans `supabase/migrations/001_initial_schema.sql`.

## Génération des join_codes

Les codes de session sont générés côté serveur (`server/utils/generateJoinCode.ts`) avec `crypto.randomInt` (Node.js), pas `Math.random()`. L'espace est `32^6 ≈ 1 milliard` de combinaisons avec un alphabet sans ambiguïté (pas de `0/O`, `1/I`).
