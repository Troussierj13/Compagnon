---
name: Projet Compagnon JdR — état technique
description: App Nuxt 3 d'aide au MJ pour The One Ring 2e — état de la documentation technique et des docs à implémenter
type: project
---

App web de support pour parties de jeu de rôle (The One Ring 2e). Monorepo : `app/` (Nuxt 3 actif), `backend/` et `frontend/` (legacy, ne pas modifier).

**Why:** Permettre au MJ de gérer campagnes, fiches, sessions live avec TV + téléphones joueurs + puces NFC.

**How to apply:** Toujours lire la doc technique avant d'implémenter. Les 4 fichiers dans `app/docs/technical/` sont les refs d'implémentation. Les fichiers `app/docs/vision/` sont la source de vérité produit.

## Docs techniques créées (2026-04-05)

- `app/docs/technical/schema.md` — Schéma DB complet (migrations 002–010), toutes les tables + RLS
- `app/docs/technical/api-contracts.md` — Tous les server endpoints avec request/response
- `app/docs/technical/types.md` — Toutes les interfaces TypeScript (TORCharacterData complète, etc.)
- `app/docs/technical/routes.md` — Toutes les pages Nuxt avec composants, layouts, composables

## Schéma DB — état actuel vs cible

Seule la migration 001 existe (`app/supabase/migrations/001_initial_schema.sql`).
Tables existantes : `campaigns`, `characters`, `sessions`, `scenes`, `scene_entities`, `session_participants`.
Tout le reste (cultures, combatants, loot, NFC, voyage, médias, overlays…) est à créer via les migrations 002–010 dans `schema.md`.

## Priorité des docs (ordre de lecture pour l'implémentation)

1. `app/docs/rules/` — règles TOR 2e (mécanique de jeu)
2. `app/docs/vision/feature-*.md` — specs produit feature par feature
3. `app/docs/technical/schema.md` — schéma DB cible
4. `app/docs/technical/types.md` — types TypeScript
5. `app/docs/technical/api-contracts.md` — endpoints
6. `app/docs/technical/routes.md` — pages/composants
