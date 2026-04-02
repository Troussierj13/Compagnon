# Feature — Fil d'initiative

**Dernière mise à jour** : 2026-04-03
**Système de jeu** : The One Ring (pas de jet d'initiative automatique — le MJ fixe l'ordre)

---

## Vue d'ensemble

Le fil d'initiative est activé manuellement par le MJ au début d'un combat. Il orchestre l'ordre de jeu des entités de la scène (PJ, ennemis, PNJ) et l'affiche sur la TV sous forme d'un bandeau en bas de la battlemap.

---

## Acteurs et responsabilités

| Acteur | Action |
|---|---|
| **MJ** | Démarre/termine le combat, définit et modifie l'ordre, passe le tour |
| **Joueur** | Annonce son initiative à voix haute → le MJ la retranscrit |
| **TV** | Affiche le bandeau d'initiative en lecture seule |
| **Téléphone joueur** | Pas d'interaction sur l'initiative (lecture seule future possible) |

---

## Cycle de vie d'un combat

```
MJ clique "Démarrer le combat" sur la scène active
        │
Modal de préparation — MJ ordonne les entités (drag & drop)
  - Toutes les entités de la scène sont pré-chargées
  - MJ peut ajouter des entités supplémentaires (invocations, embuscade)
  - MJ valide l'ordre
        │
Combat actif
  - Bandeau initiative visible sur TV + panneau MJ
  - MJ passe les tours manuellement (bouton / raccourci)
  - L'entité active est mise en avant
  - Compteur de round incrémenté à chaque cycle complet
        │
Entité à 0 endurance
  - Icône grisée, tour automatiquement sauté
  - Reste visible dans le fil (historique visuel)
        │
Tous les ennemis à 0 endurance
  - Notification MJ : possibilité de terminer le combat
  - (Alternative) MJ peut terminer le combat à tout moment
        │
Fin du combat
  - Bandeau retiré de la TV (retour scène classique)
  - Possibilité de déclencher une résolution de loot (voir feature-loot.md)
  - Session conservée, scène inchangée
```

---

## Interface MJ

### Modal de préparation (avant le combat)

Déclenchée par "Démarrer le combat" dans le panneau session.

- Liste drag & drop de toutes les entités de la scène active (enemy, npc + PJ liés aux participants)
- Possibilité d'ajouter une entité à la volée (même interface que le spawn manuel de la scène)
- Bouton "Lancer le combat" pour valider et démarrer

### Panneau MJ pendant le combat

Pendant un combat actif, le panneau MJ expose les actions prioritaires :

- **Fil d'initiative** visible en permanence (même représentation que la TV — bandeau horizontal)
- **Drag & drop** toujours disponible pour corriger l'ordre en cours de combat
- **Bouton "Tour suivant"** (+ raccourci clavier — à définir dans feature dédiée aux raccourcis)
- **Bouton "Terminer le combat"** (toujours accessible, déclenche confirmation si tous les ennemis ne sont pas à 0)
- **Indicateur du round courant**

> Le détail complet du layout du panneau MJ pendant le combat sera décrit dans `feature-session-panel.md`.

---

## Affichage TV — Bandeau initiative

Bandeau positionné en bas de la battlemap, par-dessus la map (overlay).

### Carte d'entité

Chaque entité du fil est représentée par une carte verticale :

| Élément | PJ | Ennemi / PNJ |
|---|---|---|
| Portrait / icône | ✅ | ✅ |
| Nom | ✅ | ✅ |
| Endurance courante | ✅ (affiché) | ❌ (mystère) |
| Grisé si mort | ✅ | ✅ |

### Carte active (entité qui joue)

- Mise en avant visuellement (plus grande, surbrillance, animation légère)
- Style inspiré Baldur's Gate 3 : carte élevée par rapport aux autres

### Compteur de round

- Affiché de façon discrète dans le bandeau (ex: coin supérieur du bandeau)
- Format : `Round 3`

### Comportement

- Le bandeau n'est présent sur la TV que lorsque `combat_active = true` sur la session
- Entités invisibles (`visible_to_players = false`) n'apparaissent **pas** dans le bandeau TV
- Entités à 0 endurance : carte grisée, pas retirée du bandeau

---

## Modèle de données

### Modifications sur `sessions`

```sql
ALTER TABLE sessions
  ADD COLUMN combat_active BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN combat_round  INTEGER NOT NULL DEFAULT 0;
```

### Modifications sur `scene_entities`

```sql
ALTER TABLE scene_entities
  ADD COLUMN in_combat        BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN initiative_order INTEGER,          -- position dans le fil (1 = premier)
  ADD COLUMN is_current_turn  BOOLEAN NOT NULL DEFAULT FALSE;
```

> `initiative_order` est `NULL` pour les entités hors combat.
> Un seul `is_current_turn = TRUE` peut exister par scène à la fois — contrainte applicative (pas SQL pour éviter la complexité).

### Types TypeScript à mettre à jour

```typescript
// rpg.ts — GameSession
export interface GameSession {
  // ... existant ...
  combat_active: boolean
  combat_round: number
}

// rpg.ts — SceneEntity
export interface SceneEntity {
  // ... existant ...
  in_combat: boolean
  initiative_order: number | null
  is_current_turn: boolean
}
```

---

## Endpoints serveur

### `POST /api/session/[id]/combat/start`

Authentifié MJ. Démarre le combat sur la session.

**Body :**
```json
{
  "entity_order": ["uuid-1", "uuid-2", "uuid-3"]
}
```

**Actions :**
1. Valide que la session appartient au MJ
2. Met à jour `sessions.combat_active = true`, `combat_round = 1`
3. Pour chaque entité dans `entity_order` : `in_combat = true`, `initiative_order = index + 1`
4. Première entité : `is_current_turn = true`
5. Supabase Realtime propage → TV + panneau MJ se mettent à jour

---

### `POST /api/session/[id]/combat/next`

Authentifié MJ. Passe au tour suivant.

**Actions :**
1. Trouve l'entité `is_current_turn = true`
2. Cherche la prochaine entité `in_combat = true` dont l'endurance n'est pas à 0, dans l'ordre `initiative_order`
3. Si entité courante était la dernière → `combat_round += 1`, on repart du début
4. Met à jour `is_current_turn` (false sur l'ancienne, true sur la nouvelle)
5. Les entités à 0 endurance sont **sautées automatiquement** (pas de `is_current_turn`)

---

### `POST /api/session/[id]/combat/reorder`

Authentifié MJ. Met à jour l'ordre d'initiative en cours de combat (drag & drop).

**Body :**
```json
{
  "entity_order": ["uuid-2", "uuid-1", "uuid-3"]
}
```

**Actions :**
Réassigne `initiative_order` pour chaque entité listée. Ne modifie pas `is_current_turn`.

---

### `POST /api/session/[id]/combat/end`

Authentifié MJ. Termine le combat.

**Actions :**
1. `sessions.combat_active = false`, `combat_round = 0`
2. Toutes les entités de la scène : `in_combat = false`, `initiative_order = null`, `is_current_turn = false`
3. Supabase Realtime propage → TV retire le bandeau

---

### `POST /api/session/[id]/combat/add-entity`

Authentifié MJ. Ajoute une entité au combat en cours (invocation, ennemi caché).

**Body :**
```json
{
  "entity_id": "uuid",
  "insert_after": "uuid-existant"  // optionnel — sinon ajouté en fin de fil
}
```

---

## Règles métier

- Un seul combat actif par session à la fois
- Une entité ne peut être dans le fil que si elle appartient à la scène active de la session
- Les entités de type `item` et `zone` ne sont **pas** ajoutées au fil d'initiative (filtrées à l'ouverture de la modal)
- Les PJ sont représentés par les `session_participants` liés à un `character_id` — leur portrait vient de `characters.data.portrait_url` (à définir dans feature-loot ou feature-characters)
- Si `combat_active = true` et `active_scene_id` change (changement de scène) → le combat est terminé automatiquement

---

## Realtime

Les colonnes `combat_active`, `combat_round` (table `sessions`) et `in_combat`, `initiative_order`, `is_current_turn` (table `scene_entities`) sont déjà couvertes par la publication Realtime existante.

Aucune nouvelle subscription n'est nécessaire — les composables existants (`useGMSession`, `usePlayerSession`, `useScene`) devront simplement réagir aux nouvelles colonnes.

---

## Ce qui n'est PAS dans cette feature

- Raccourcis clavier globaux — feature dédiée à prévoir (`feature-shortcuts.md`)
- Détail du layout du panneau MJ — `feature-session-panel.md` à créer
- Résolution de loot post-combat — `feature-loot.md`
- Affichage de l'endurance côté joueur (téléphone) — `feature-player-view.md` à créer
- Statuts visuels (blessé, mort stylisé, effets) — Phase 4, `F2`
