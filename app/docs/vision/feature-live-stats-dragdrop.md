# Feature — Stats en live + Drag & Drop tokens

**Dernière mise à jour** : 2026-04-03
**Système de jeu** : The One Ring

---

## Vue d'ensemble

Deux mécaniques liées qui permettent au MJ de contrôler la battlemap en temps réel :

1. **Drag & drop des tokens** — positionner les entités librement sur la battlemap, synchronisé en temps réel sur la TV
2. **Modification des stats en live** — mettre à jour les valeurs clés des entités (endurance, espoir, blessures) via un popover rapide pendant la session

---

## 1. Drag & Drop des tokens

### Principe

Le MJ déplace les tokens directement sur la battlemap dans le panneau session. Les positions sont synchronisées en temps réel sur la TV. Les téléphones joueurs n'affichent pas les tokens (la battlemap y est en lecture seule).

### Positionnement

- **Libre** (coordonnées pixel, pas de grille)
- La position est stockée dans `scene_entities.position` : `{ x: number, y: number }`
- `x` et `y` sont des pourcentages de la taille de la battlemap (0–100) pour être indépendants de la résolution d'affichage
- Synchronisation **au fil du déplacement** (pas seulement au drop) — Supabase UPDATE direct depuis le client MJ authentifié (pas via server endpoint — trop lent pour du real-time pixel)

### Entités visibles (`visible_to_players = true`)

- Token affiché sur la battlemap MJ et sur la TV
- Déplaçable par le MJ
- Le déplacement se reflète en temps réel sur la TV via Supabase Realtime

### Entités cachées (`visible_to_players = false`)

Ces entités sont "en attente de révélation" — prêtes à être positionnées avant d'apparaître aux joueurs.

| Contexte | Affichage MJ | Affichage TV |
|---|---|---|
| Entité placée sur la battlemap | Token semi-transparent (opacité ~40%) | Absent |
| Entité non positionnée | Liste "Entités cachées" dans le panneau | Absent |

Le MJ peut :
- Drag & dropper une entité cachée depuis la liste vers la battlemap (elle y apparaît en semi-transparent)
- La repositionner librement tant qu'elle est cachée
- Déclencher sa **révélation** (toggle `visible_to_players = true`) → le token apparaît sur la TV sans animation particulière

> Les révélations avec animation (spawn NFC, apparition dramatique) sont traitées dans `feature-nfc.md` et `feature-display-tv.md`.

### Révélation d'une entité

Action MJ : clic droit sur un token semi-transparent ou bouton dans la liste → "Révéler aux joueurs".

- Met `visible_to_players = true`
- Le token devient opaque sur le panneau MJ
- Supabase Realtime → la TV affiche immédiatement le token à sa position courante

---

## 2. Modification des stats en live

### Principe général

Le MJ clique sur un token ou un badge d'entité dans le panneau session → un **popover contextuel** s'ouvre avec les valeurs modifiables. Les modifications sont sauvegardées dans `scene_entities.data` (JSONB) et propagées via Supabase Realtime.

---

### Popover — Ennemi & PNJ

Le popover est identique pour les ennemis et les PNJ (tous deux stockés dans `combatants`). Stats modifiables :

| Stat | Colonne | Type | Contrôle UI |
|---|---|---|---|
| Endurance courante | `scene_entities.endurance_current` | integer | `[−]` / `[+]` + saisie directe |
| Blessures reçues | `scene_entities.wounds_received` | integer | Bouton `[Blesser]` (incrémente de 1) |
| Haine / Détermination restante | `scene_entities.hatred_current` | integer | `[−]` / `[+]` |

L'endurance max (`combatants.endurance`) est affichée en référence (non éditable dans le popover — modifiable uniquement en back-office).

Comportement à 0 endurance :
- Token grisé sur la battlemap et dans le fil d'initiative
- Si un combat est actif, le tour de cette entité est sauté automatiquement (voir `feature-initiative.md`)

Comportement quand `wounds_received >= combatants.wound_threshold` :
- L'entité est considérée inconsciente/morte (indépendamment de l'endurance restante)
- Même effet visuel qu'endurance à 0

Pour les PNJ, un bouton supplémentaire **"Inventaire"** ouvre le panneau de gestion de l'inventaire PNJ (donner/prendre des objets).

---

### Popover — PJ (édition rapide)

Le popover PJ expose les valeurs qui changent fréquemment en session :

| Stat | Champ source | Type |
|---|---|---|
| Endurance courante | `characters.data.endurance_current` | integer |
| Espoir courant | `characters.data.hope_current` | integer |
| Blessures | `characters.data.wounds` (à définir dans feature fiche PJ) | integer ou boolean[] |

> Ces valeurs sont sur la table `characters`, pas `scene_entities`. La modification passe par un **server endpoint** (pas d'écriture directe sur `characters` côté MJ client pour garder la cohérence avec les mises à jour joueur).

Interface : un champ par stat avec `+` / `−` + saisie directe, max affiché en référence.

---

### Feuille personnage complète (overlay TV)

Quand le MJ affiche la fiche d'un PJ en grand sur la TV (feature future `feature-display-tv.md` — overlay fiche), la fiche est éditable sur presque toutes ses valeurs :

- Compétences, équipement, inventaire, vertus, récompenses, notes
- Cette interface de modification complète est définie dans la feature dédiée aux fiches personnages (`feature-characters.md` — à créer)
- Le MJ et le joueur peuvent modifier simultanément (le joueur depuis son téléphone, le MJ depuis le panneau)

---

## Modifications du côté joueur (téléphone)

Le joueur peut modifier sa propre fiche depuis `/player/sheet` ou `/player/scene` (fiche en slideover). Les modifications transitent obligatoirement par un **server endpoint** (jamais d'écriture directe Supabase côté joueur).

Stats modifiables par le joueur :
- Endurance courante
- Espoir courant
- Notes personnelles

> Le détail complet est dans la feature fiche joueur (`feature-characters.md` — à créer).

---

## Modèle de données

### Colonnes dédiées sur `scene_entities` (ajoutées via `feature-enemies.md`)

Les stats de combat des ennemis et PNJ utilisent des **colonnes dédiées** sur `scene_entities`, pas le JSONB `data` :

| Colonne | Type | Description |
|---|---|---|
| `combatant_id` | uuid FK \| null | Référence vers `combatants` (null pour objets/zones) |
| `endurance_current` | integer \| null | HP courants |
| `wounds_received` | integer \| null | Blessures reçues |
| `hatred_current` | integer \| null | Points haine/détermination restants |
| `is_defeated` | boolean | Vaincu (déclenche le loot) |

Colonnes existantes conservées :
- `scene_entities.position` (`JSONB`, `{"x": 0, "y": 0}`) → coordonnées en **pourcentages** (0–100)
- `scene_entities.visible_to_players` → déjà présent
- `characters.data` (`JSONB`) → `endurance_current`, `hope_current` dans `TORCharacterData` (les PJ restent sur JSONB pour leur structure riche)

### Convention position en pourcentage

```typescript
// Position stockée en % de la battlemap (0–100)
// Exemple : token au centre
{ x: 50, y: 50 }

// Conversion à l'affichage :
// left: `${position.x}%`
// top:  `${position.y}%`
```

---

## Endpoints serveur

### `PATCH /api/session/[id]/entity/[entityId]/visibility`

Authentifié MJ. Révèle ou masque une entité.

**Body :**
```json
{ "visible_to_players": true }
```

**Actions :**
1. Vérifie que l'entité appartient à une scène de la session du MJ
2. Met à jour `scene_entities.visible_to_players`
3. Supabase Realtime propage → TV et téléphones

---

### `PATCH /api/session/[id]/entity/[entityId]/stats`

Authentifié MJ. Met à jour les stats d'une entité de scène (ennemi / PNJ).

**Body (tous les champs optionnels — seuls les champs présents sont mis à jour) :**
```json
{
  "endurance_current": 8,
  "wounds_received": 1,
  "hatred_current": 2,
  "is_defeated": false
}
```

**Actions :**
1. Validation :
   - `endurance_current >= 0` si présent
   - `wounds_received >= 0` si présent
   - `hatred_current >= 0` si présent
2. Vérifie que l'entité possède un `combatant_id` (sinon 400 — pas de stats sur objets/zones)
3. UPDATE des colonnes présentes sur `scene_entities`
4. Supabase Realtime propage

---

### `PATCH /api/session/[id]/character/[characterId]/stats`

Authentifié MJ. Met à jour les stats rapides d'un PJ (endurance, espoir, blessures).

**Body :**
```json
{
  "endurance_current": 14,
  "hope_current": 5
}
```

**Actions :**
1. Vérifie que le personnage appartient à la campagne de la session
2. Merge dans `characters.data`
3. Supabase Realtime propage → téléphone du joueur concerné se met à jour

---

### Position — mise à jour directe Supabase (client MJ)

Le drag & drop envoie des updates **directement via le client Supabase authentifié** (pas de server endpoint) pour garantir la fluidité temps réel :

```typescript
// Dans useScene.ts — appelé à chaque mousemove/touchmove pendant le drag
supabase
  .from('scene_entities')
  .update({ position: { x, y } })
  .eq('id', entityId)
```

Le RLS `scene_entities_gm_all` autorise ces écritures. Supabase Realtime propage chaque UPDATE → la TV reçoit les nouvelles coordonnées et repositionne le token immédiatement.

> **Performance** : limiter les updates à ~30/s côté client (throttle) pour éviter de saturer Supabase Realtime.

---

## Realtime — comportement attendu

| Événement | Source | Destinataires |
|---|---|---|
| Token déplacé | MJ (client direct) | TV uniquement |
| Entité révélée | Server endpoint | TV + téléphones joueurs |
| Endurance ennemi/PNJ modifiée | Server endpoint | Panneau MJ (feedback) |
| Stats PJ modifiées | Server endpoint | Téléphone du joueur + panneau MJ |

---

## Ce qui n'est PAS dans cette feature

- Modification complète de la fiche personnage (compétences, inventaire, etc.) — `feature-characters.md` à créer
- Animations de révélation dramatique — `feature-display-tv.md`
- Affichage des tokens sur les téléphones joueurs — hors scope (TV uniquement)
- Snap sur grille — non prévu (positionnement libre uniquement)
