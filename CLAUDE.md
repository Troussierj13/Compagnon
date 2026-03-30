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

- Utiliser `useSupabaseAdmin()` pour les endpoints joueur (contourne RLS) — singleton Nitro, une seule instance par processus
- Utiliser `useSupabaseClient()` (via `serverSupabaseClient`) pour les endpoints MJ authentifiés
- **Jamais de `select('*')` dans les endpoints publics ou joueur** — sélections explicites uniquement
- Toujours valider `participant_id + session_id` via `validateParticipant()` (`server/utils/validateParticipant.ts`) avant de retourner des données joueur
- **Jointures Supabase ambiguës** : si deux FK existent entre deux tables, préciser avec `!nom_colonne` — ex: `scenes!active_scene_id(*)` au lieu de `scenes(*)`. Sinon PostgREST retourne `"more than one relationship was found"`

### Composables

- Les composables MJ (`useGMSession`, `useCharacter`, `useScene`) peuvent lire Supabase directement — le MJ est authentifié et les policies RLS le protègent
- Les composables joueur (`usePlayerSession`) ne lisent jamais Supabase directement — ils appellent les server endpoints
- Les refs des composables sont déclarées **à l'intérieur de la fonction** — chaque appel crée une instance d'état isolée. Si plusieurs composants doivent partager le même état, ils doivent être dans le même composant parent ou utiliser `provide/inject`

### Realtime Supabase

- Sur un événement INSERT de `postgres_changes`, **ne pas utiliser `payload.new` pour les relations jointes** — `payload.new` ne contient que les colonnes de la table directement modifiée, pas les foreign keys résolues. Faire un fetch ciblé après.
- Toujours nettoyer les subscriptions : stocker la fonction `unsub` retournée par `subscribeToXxx()` et l'appeler avant de créer un nouveau channel (éviter les memory leaks).
- **Exception Realtime joueur** : `usePlayerSession` souscrit directement à Supabase (client anon) pour les tables `sessions` et `scene_entities`. Les canaux Realtime fonctionnent différemment du RLS SELECT — cette exception est documentée dans `architecture.md`. Le filtrage `visible_to_players` est appliqué côté client sur les événements reçus.

### Sécurité

- Utiliser `crypto.randomInt` (Node.js) pour toute génération de codes/tokens, pas `Math.random()`
- Normaliser les inputs côté serveur (`.trim().toUpperCase()`) — ne pas faire confiance au format client
- Ne jamais exposer `gm_user_id`, timestamps internes, ou colonnes d'ownership dans les réponses joueur

## Architecture des fichiers `app/`

```
app/
├── types/
│   └── rpg.ts                ← Types TypeScript centraux (Campaign, Character, GameSession, Scene, SceneEntity, …)
├── composables/
│   ├── useGMSession.ts       ← état session MJ + realtime participants
│   ├── usePlayerSession.ts   ← état session joueur (lit via server endpoints)
│   ├── useScene.ts           ← CRUD scènes/entités MJ
│   └── useCharacter.ts       ← CRUD personnages MJ
├── components/
│   ├── gm/                   ← Composants MJ (EntityBadge, EntityToken)
│   └── player/               ← Composants joueur (CharacterSheet, EnemyCard, EntityCard, EntityToken)
├── layouts/
│   ├── default.vue           ← Layout standard
│   ├── fullscreen.vue        ← Layout plein écran (feuille de perso dédiée)
│   └── minimal.vue           ← Layout minimal (page join)
├── middleware/
│   ├── gm.ts                 ← Redirige vers /login si MJ non authentifié
│   └── player-session.ts     ← Redirige vers /player/join si localStorage vide (côté client uniquement)
├── pages/
│   ├── gm/                   ← Routes MJ (middleware gm)
│   └── player/
│       ├── join.vue          ← Saisie du join_code + nom
│       ├── scene.vue         ← Scène active + feuille de perso (slideover)
│       └── sheet.vue         ← Feuille de perso plein écran (vue alternative, ex: tablette)
├── utils/
│   └── entityDisplay.ts      ← Constantes partagées ENTITY_TOKEN_COLOR / ENTITY_TOKEN_ICON (auto-importé)
├── server/
│   ├── api/session/
│   │   ├── create.post.ts    ← MJ : crée une session (auth requise)
│   │   ├── join.post.ts      ← Joueur : rejoint via join_code (anon)
│   │   ├── [code].get.ts     ← Preview session par code (page join, public)
│   │   └── [id]/
│   │       ├── state.get.ts      ← Joueur : état complet session (valide participant_id)
│   │       └── characters.get.ts ← Joueur : liste des personnages de la campagne (id, name, player_name uniquement)
│   └── utils/
│       ├── supabaseAdmin.ts      ← Client Supabase service_role (singleton)
│       ├── validateParticipant.ts ← Validation participant_id + session_id (partagée entre endpoints joueur)
│       └── generateJoinCode.ts   ← Génère un code 6 chars (crypto.randomInt)
└── supabase/migrations/
    └── 001_initial_schema.sql ← Schéma complet + RLS + Realtime
```

## Variables d'environnement requises

Voir `app/.env.example`. Les clés sensibles (`SUPABASE_SERVICE_KEY`, `SESSION_SECRET`) ne sont jamais exposées côté client (`runtimeConfig` sans `public`).

## Documentation

- `app/docs/architecture.md` — architecture détaillée et décisions de design
- `app/docs/security.md` — modèle de sécurité RLS et patterns d'accès
- `app/docs/adr/001-player-access-pattern.md` — ADR sur l'accès joueur via server endpoints
- `app/docs/todo.md` — bugs connus et améliorations à faire (à lire en début de session)
