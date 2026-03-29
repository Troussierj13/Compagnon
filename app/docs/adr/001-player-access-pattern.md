# ADR-001 — Pattern d'accès joueur via server endpoints

**Date :** 2026-03-29
**Statut :** Accepté
**Contexte :** Code review PR #4

## Contexte

L'application a deux types d'acteurs : le MJ (authentifié Supabase Auth) et le joueur (anonyme, identifié uniquement par un `join_code`). Supabase RLS est activé sur toutes les tables.

La première implémentation du composable `usePlayerSession` lisait directement les tables `sessions`, `scenes` et `scene_entities` via le client Supabase anon, sans qu'il existe de policy RLS SELECT pour les joueurs sur ces tables. En production (RLS activé), ces requêtes retournaient silencieusement 0 résultats, rendant la fonctionnalité joueur entièrement non opérationnelle.

## Décision

**Toute lecture de données par un joueur anonyme transite par un server endpoint Nuxt.**

Le client joueur n'appelle jamais directement `supabase.from(table).select(...)` pour les tables métier. À la place :

1. Le front-end appelle un endpoint Nitro (`$fetch('/api/session/...')`)
2. L'endpoint valide le `participant_id` et `session_id` (correspondance en base)
3. L'endpoint utilise `useSupabaseAdmin()` (service_role) pour lire les données
4. L'endpoint retourne uniquement les champs nécessaires à l'UI joueur

Le schéma SQL ne définit **pas** de policies SELECT anon sur `sessions`, `scenes`, `scene_entities` — c'est intentionnel et documenté dans le fichier de migration.

## Alternatives considérées

### Option A : Ajouter des policies RLS SELECT anon

```sql
CREATE POLICY "sessions_player_read" ON sessions FOR SELECT TO anon
  USING (status != 'ended');
```

**Rejeté** : sans notion d'identité joueur côté Supabase, toute policy anon est équivalente à un accès public sur ces tables. N'importe qui connaissant la clé anon publique pourrait lire toutes les sessions actives de tous les MJ.

### Option B : Auth anonyme Supabase

Activer l'auth anonyme de Supabase lors du `join` pour créer une identité éphémère, puis écrire des policies RLS basées sur `auth.uid()`.

**Non retenu pour l'instant** : augmente la complexité (gestion des sessions auth éphémères, synchronisation avec `session_participants`) sans bénéfice fonctionnel immédiat dans le contexte actuel.

### Option C : Server endpoints (retenu)

**Avantages :**
- Sécurité centralisée : la validation du `participant_id` est un seul point d'entrée, facile à auditer
- Contrôle total des données exposées (sélections explicites, filtrage `visible_to_players`)
- Cohérent avec l'endpoint `join.post.ts` déjà existant

**Inconvénients :**
- Tout changement de structure de données nécessite une mise à jour de l'endpoint
- Pas de bénéfice direct des subscriptions Realtime Supabase (les mises à jour temps réel restent via le canal Realtime anon, qui fonctionne différemment du SELECT RLS)

## Conséquences

- `usePlayerSession.restore()` appelle `$fetch('/api/session/${id}/state?participant_id=${pid}')` au lieu de lire Supabase directement
- Endpoint créé : `server/api/session/[id]/state.get.ts`
- Les subscriptions Realtime du joueur restent via le client Supabase anon (les canaux Realtime ont un modèle d'autorisation différent du RLS SELECT standard)
- Toute future donnée nécessaire au joueur doit être ajoutée à cet endpoint (ou un endpoint dédié) — jamais en ajoutant une policy anon directe
