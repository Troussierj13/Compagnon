# CLAUDE.md — Compagnon JdR

Guide pour Claude Code sur ce repo. Lis ce fichier avant toute intervention.

## Structure du monorepo

```
/
├── app/          ← Application Nuxt 3 (stack principale)
├── backend/      ← Ancien backend Express (legacy, ne pas modifier)
├── frontend/     ← Ancien frontend Vue 2 (legacy, ne pas modifier)
└── API/          ← Specs API legacy
```

**Tout le développement actif se fait dans `app/`.**

## Stack `app/`

| Couche | Technologie |
|---|---|
| Framework | Nuxt 3 (SSR + server endpoints via Nitro) |
| UI | @nuxt/ui |
| Base de données | Supabase (Postgres + RLS + Realtime) |
| Auth | @nuxtjs/supabase — uniquement pour le MJ |
| Langage | TypeScript strict |

## Modèle d'identité — règle fondamentale

Il existe **deux types d'acteurs** avec des niveaux d'accès asymétriques :

- **MJ (Game Master)** : authentifié via Supabase Auth (`auth.uid()` disponible). Accède aux données via le client Supabase front-end ou les server endpoints.
- **Joueur anonyme** : aucune identité Supabase. Son seul credential est le `join_code` de session (6 caractères). Son `participant_id` (UUID) est persisté dans le localStorage après le `join`.

## Règle d'or — accès joueur anonyme

> **Tout accès aux données par un joueur anonyme transite par un server endpoint Nuxt.**

Le client joueur ne doit **jamais** lire directement les tables Supabase via la clé anon. Le RLS est configuré pour bloquer ces accès délibérément.

```
✅  $fetch('/api/session/${id}/state?participant_id=${pid}')   ← server endpoint avec admin client
❌  supabase.from('sessions').select('*').eq('id', id)         ← bloqué par RLS en prod
```

Les server endpoints utilisent `useSupabaseAdmin()` (clé `service_role`) et valident le `participant_id` avant de répondre.

## Conventions de code

### Server endpoints

- Utiliser `useSupabaseAdmin()` pour les endpoints joueur (contourne RLS)
- Utiliser `useSupabaseClient()` (via `serverSupabaseClient`) pour les endpoints MJ authentifiés
- **Jamais de `select('*')` dans les endpoints publics ou joueur** — sélections explicites uniquement
- Toujours valider `participant_id + session_id` avant de retourner des données joueur

### Composables

- Les composables MJ (`useGMSession`, `useCharacter`, `useScene`) peuvent lire Supabase directement — le MJ est authentifié et les policies RLS le protègent
- Les composables joueur (`usePlayerSession`) ne lisent jamais Supabase directement — ils appellent les server endpoints
- Les refs des composables sont déclarées **au niveau module** (hors de la fonction) pour partager l'état entre composants

### Realtime Supabase

- Sur un événement INSERT de `postgres_changes`, **ne pas utiliser `payload.new` pour les relations jointes** — `payload.new` ne contient que les colonnes de la table directement modifiée, pas les foreign keys résolues. Faire un fetch ciblé après.
- Toujours nettoyer les subscriptions : stocker la fonction `unsub` retournée par `subscribeToXxx()` et l'appeler avant de créer un nouveau channel (éviter les memory leaks).

### Sécurité

- Utiliser `crypto.randomInt` (Node.js) pour toute génération de codes/tokens, pas `Math.random()`
- Normaliser les inputs côté serveur (`.trim().toUpperCase()`) — ne pas faire confiance au format client
- Ne jamais exposer `gm_user_id`, timestamps internes, ou colonnes d'ownership dans les réponses joueur

## Architecture des fichiers `app/`

```
app/
├── composables/
│   ├── useGMSession.ts       ← état session MJ + realtime participants
│   ├── usePlayerSession.ts   ← état session joueur (lit via server endpoints)
│   ├── useScene.ts           ← CRUD scènes/entités MJ
│   └── useCharacter.ts       ← CRUD personnages MJ
├── server/
│   ├── api/session/
│   │   ├── create.post.ts    ← MJ : crée une session (auth requise)
│   │   ├── join.post.ts      ← Joueur : rejoint via join_code (anon)
│   │   ├── [code].get.ts     ← Preview session par code (page join)
│   │   └── [id]/
│   │       └── state.get.ts  ← Joueur : état complet session (valide participant_id)
│   └── utils/
│       ├── supabaseAdmin.ts  ← Client Supabase service_role
│       └── generateJoinCode.ts ← Génère un code 6 chars (crypto.randomInt)
├── supabase/migrations/
│   └── 001_initial_schema.sql ← Schéma complet + RLS + Realtime
└── pages/
    ├── gm/                   ← Routes MJ (middleware auth)
    └── player/               ← Routes joueur (middleware session locale)
```

## Variables d'environnement requises

Voir `app/.env.example`. Les clés sensibles (`SUPABASE_SERVICE_KEY`, `SESSION_SECRET`) ne sont jamais exposées côté client (`runtimeConfig` sans `public`).

## Documentation

- `app/docs/architecture.md` — architecture détaillée et décisions de design
- `app/docs/security.md` — modèle de sécurité RLS et patterns d'accès
- `app/docs/adr/001-player-access-pattern.md` — ADR sur l'accès joueur via server endpoints
