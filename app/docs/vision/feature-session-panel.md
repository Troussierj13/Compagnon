# Feature — Panneau Session Live MJ (`feature-session-panel.md`)

> Vision globale : [`README.md`](./README.md)
> Affichage TV : [`feature-display-tv.md`](./feature-display-tv.md)
> Initiative : [`feature-initiative.md`](./feature-initiative.md)
> Drag & Drop : [`feature-live-stats-dragdrop.md`](./feature-live-stats-dragdrop.md)
> Loot : [`feature-loot.md`](./feature-loot.md)
> Voyage : [`feature-journey.md`](./feature-journey.md)

**Statut** : ✅ Spécifié — 2026-04-05

---

## Principe fondamental

Le panneau session est **la télécommande de la TV**. Tout ce que le MJ fait dans ce panneau se reflète immédiatement sur l'affichage spectateur. C'est sa seule et unique raison d'être pendant une session live.

Le MJ ne configure rien de fondamental ici (les fiches, les ennemis, les campagnes se gèrent dans le back-office). Il **pilote** : il change ce qui est visible, ce qui se passe, ce que les joueurs voient sur la TV.

---

## Route & contexte technique

- **URL** : `/gm/campaigns/[id]/session/[sessionId]`
- **Auth** : MJ (Supabase Auth, middleware `gm`)
- **Layout** : `default`
- **Composables** : `useGMSession(sessionId)`, `useScene(sessionId)`, `useParticipants(sessionId)`

---

## Layout général

```
┌──────────────────────────────────────────────────────────────────────────┐
│  HEADER BARRE                                                             │
│  [Nom campagne] · [Nom scène active] · [Status TV] · [Round si combat]   │
│  [Démarrer combat]  [Démarrer voyage]  [Phase communauté]  [Fin session]  │
├──────────────┬───────────────────────────────────────────────────────────┤
│  SIDEBAR     │  ZONE CENTRALE CONTEXTUELLE                                │
│  GAUCHE      │  (ratio 16:9, prend toute la largeur restante)             │
│  (fixe,      │                                                            │
│  ~260px)     │  Type combat / exploration → Battlemap + tokens D&D        │
│              │  Type journey              → Panel voyage                  │
│  [Scènes]    │  Type community            → Panel phase de communauté     │
│              │                                                            │
│  [Partici-   ├───────────────────────────────────────────────────────────┤
│   pants]     │  PANNEAU ENTITÉS (sous la zone contextuelle)               │
│              │  [Entités en scène]  [En réserve]  [+ Ajouter]             │
│  [Chat       │                                                            │
│   annonces]  │                                                            │
└──────────────┴───────────────────────────────────────────────────────────┘
```

---

## Header barre

Barre horizontale fixe en haut du panneau. Toujours visible.

### Informations affichées

| Élément | Source | Comportement |
|---|---|---|
| Nom de la campagne | `campaign.name` | Lien vers le back-office campagne |
| Nom de la scène active | `activeScene.name` | Texte simple |
| Status TV | `session.display_mode` | Badge coloré (ex: `🟢 Combat`, `🔵 Voyage`, `⚪ Exploration`) |
| Round courant | `session.combat_round` | Affiché uniquement si `combat_active = true` — format `Round 3` |

### Actions contextuelles (boutons)

Ces boutons changent selon l'état de la session. Ils ne sont pas tous visibles en même temps.

| Bouton | Visible si | Action |
|---|---|---|
| `Démarrer le combat` | Scène active de type `combat` ou `exploration`, `combat_active = false` | Ouvre le modal de préparation combat (voir `feature-initiative.md`) |
| `Tour suivant` | `combat_active = true` | Passe au tour suivant (voir `feature-initiative.md`) |
| `Terminer le combat` | `combat_active = true` | Confirmation → fin du combat |
| `Démarrer le voyage` | Scène active de type `journey`, voyage non démarré | Ouvre le panel de configuration voyage |
| `Phase de Communauté` | Scène active de type `community` | Bascule la zone centrale vers le panel communauté |
| `Terminer la session` | Toujours | Ouvre le modal de fin de session (voir section dédiée) |

---

## Sidebar gauche

### Section 1 — Liste des scènes

Liste verticale scrollable des scènes de la session.

```
▼ Scènes (3)
  ┌─────────────────────────┐
  │ ● Forge de Nogrod       │  ← scène active (•)
  │   [type: combat]        │
  ├─────────────────────────┤
  │   Chemin des Mines      │
  │   [type: journey]       │
  ├─────────────────────────┤
  │   Havre de Fondcombe    │
  │   [type: community]     │
  └─────────────────────────┘
  [+ Nouvelle scène]
```

**Comportement :**
- Cliquer sur une scène → modale de confirmation si la scène active change (`"Changer de scène active ? L'affichage TV sera mis à jour."`) → `session.active_scene_id` mis à jour → TV change immédiatement
- La scène active est mise en avant (indicateur visuel `●`)
- `[+ Nouvelle scène]` ouvre un formulaire inline : nom, type (`combat`, `journey`, `community`, `exploration`), image de battlemap (Image Picker depuis la médiathèque)
- Si `combat_active = true` et le MJ change de scène → le combat est terminé automatiquement (règle `feature-initiative.md`) — une alerte en informe le MJ avant confirmation

**Types de scènes :**

| Type | Zone centrale | Usage typique |
|---|---|---|
| `combat` | Battlemap + tokens + (initiative si actif) | Combat contre des ennemis |
| `exploration` | Battlemap + tokens (sans initiative) | Exploration libre, PNJ en scène |
| `journey` | Panel voyage | Déplacement entre deux lieux |
| `community` | Panel phase de communauté | Havre, soin, level-up |

---

### Section 2 — Participants connectés

Liste des joueurs actuellement connectés à la session.

```
▼ Joueurs (3/4)
  ┌────────────────────────────────┐
  │ 🟢 Mathieu  →  Legolas         │
  │ 🟢 Claire   →  Aelindra        │
  │ 🟢 Tom      →  Borin           │
  │ 🔴 Alice    →  (non connectée) │
  └────────────────────────────────┘
```

**Données affichées :**
- Indicateur de connexion (vert = connecté / rouge = déconnecté)
- Nom du joueur (`participants.player_name`)
- Personnage assigné (`characters.name`)

**Actions :**
- Clic sur un participant → popover avec option "Réassigner un personnage" (dropdown des personnages de la campagne sans participant actif)

---

### Section 3 — Chat & Annonces MJ (ancré en bas de la sidebar)

Zone de chat simplifiée positionnée en bas de la sidebar gauche. Permet au MJ d'envoyer des annonces texte visibles sur les téléphones joueurs.

```
┌────────────────────────────────────────┐
│ Annonces                               │
├────────────────────────────────────────┤
│ [MJ] Vous entendez des bruits...  10:23│
│ [App] Combat démarré              10:31│
│ [MJ] Gobelin vaincu !             10:45│
├────────────────────────────────────────┤
│ [Saisir une annonce...     ] [Envoyer] │
└────────────────────────────────────────┘
```

**Types de messages :**

| Type | Source | Style |
|---|---|---|
| `gm_message` | Saisie MJ | Texte normal, tag `[MJ]` |
| `app_event` | Système (combat démarré, loot distribué, etc.) | Italique, tag `[App]` |

**Comportement :**
- Le MJ tape un message et valide (Enter ou bouton) → `POST /api/session/[id]/announce`
- Les messages `app_event` sont générés automatiquement par le serveur lors des actions clés
- Les joueurs voient les annonces sur leur téléphone (onglet Annonces de `feature-player-view.md`)
- L'historique est scrollable dans la sidebar, 50 derniers messages

---

## Zone centrale contextuelle

La zone centrale est **déterminée par le type de la scène active**. Elle occupe toute la largeur disponible à droite de la sidebar gauche, avec un ratio **16:9 fixe** — ce qui la rend visuellement cohérente avec l'affichage TV qu'elle pilote. Le panneau entités se trouve en dessous.

### Mode battlemap (`combat` et `exploration`)

La battlemap est l'image de la scène active. Les tokens des entités y sont positionnés librement.

- Image de la scène (`activeScene.background_url`) en fond, centrée et couvrant toute la zone
- Tokens des entités **visibles** affichés en pleine opacité, **déplaçables** (drag & drop)
- Tokens des entités **cachées** (`visible_to_players = false`) affichés en semi-transparent (~40% opacité)
- Si `combat_active = true` : fil d'initiative affiché en bandeau en bas de la battlemap (même rendu que la TV — voir `feature-initiative.md`)
- Gestion des tokens : voir section [Panneau entités]

> Détail technique du drag & drop et du popover de stats : voir `feature-live-stats-dragdrop.md`.

### Mode voyage (`journey`)

Quand la scène active est de type `journey`, la zone centrale affiche le **panel de gestion du voyage**.

> Contenu complet défini dans `feature-journey.md` — section "Panneau session MJ".

Résumé :
- Grille hexagonale de la carte sélectionnée
- Marqueur de groupe déplaçable sur la grille
- Panneau de configuration : rôles des PJ, chemin tracé, résolution des étapes
- Saisie des résultats de dés par le MJ après chaque jet physique

### Mode phase de communauté (`community`)

Quand la scène active est de type `community`, la zone centrale affiche le **panel de phase de communauté**.

> Spec détaillée à compléter lors de la phase d'implémentation.

Ce qui est prévu :
- Récapitulatif des points d'aventure (XP) gagnés pendant la session
- Attribution des points de progression aux personnages présents
- Le MJ valide → les fiches des PJ sont mises à jour (`characters.data`)
- La TV affiche un overlay "Phase de Communauté" pendant cette phase

---

## Panneau entités (sous la zone contextuelle)

Panneau horizontal positionné sous la zone centrale contextuelle, sur toute la largeur restante (à droite de la sidebar gauche). Il est toujours visible quelle que soit la scène active.

### Section 1 — Entités en scène

Liste des entités actuellement placées sur la battlemap (visibles ou cachées).

```
▼ En scène (5)
  ┌──────────────────────────────────────────┐
  │ 👁 Gobelin Éclaireur    [12/18 END]  ···  │  ← visible
  │ 🔵 Gobelin Archer       [ 9/15 END]  ···  │  ← visible
  │ 🌫 Troll des Cavernes   [—/—]        ···  │  ← caché (semi-transparent sur battlemap)
  │ ⚔ Borin (PJ)           [14/16 END]  ···  │
  │ ⚔ Legolas (PJ)         [12/12 END]  ···  │
  └──────────────────────────────────────────┘
```

**Icônes de visibilité :**
- `👁` = visible aux joueurs
- `🌫` = caché (semi-transparent sur battlemap, invisible sur TV)

**Actions sur une entité (bouton `···` → menu contextuel) :**
- Révéler / Masquer aux joueurs (toggle `visible_to_players`)
- Modifier les stats (ouvre le popover — voir `feature-live-stats-dragdrop.md`)
- Gérer l'inventaire (PNJ uniquement)
- Retirer de la scène → passe dans "En réserve"
- Supprimer de la session

**Pour les entités cachées :**
- Le token existe sur la battlemap mais en semi-transparent
- Action "Révéler" → le token devient visible sur la TV en temps réel

---

### Section 2 — En réserve

Entités définies pour la session mais **pas encore placées sur la battlemap**. Elles n'apparaissent pas sur la TV.

```
▼ En réserve (3)
  ┌──────────────────────────────────────┐
  │ [::] Gobelin Sentinelle              │  ← draggable
  │ [::] Araignée géante                 │  ← draggable
  │ [::] Nécromancien (boss)             │  ← draggable
  └──────────────────────────────────────┘
```

**Comportement :**
- Drag & drop depuis "En réserve" vers la battlemap → l'entité apparaît sur la battlemap en **semi-transparent** (cachée par défaut)
- Le MJ la repositionne puis peut la révéler quand il le souhaite
- Pratique pour préparer à l'avance les entités qui arrivent plus tard dans la scène

---

### Section 3 — Ajouter une entité

Bouton `[+ Ajouter une entité]` en bas du panneau entités.

Ouvre un **drawer** avec deux onglets :

**Onglet "Depuis la campagne"**
- Liste paginée des `combatants` (ennemis + PNJ) de la campagne
- Filtre par nom
- Clic → confirmation → entité ajoutée en "En réserve" (invisible par défaut)

**Onglet "Configurer une nouvelle"**
- Formulaire léger : nom, type (`enemy` | `npc`), endurance, haine/détermination
- Crée un `combatant` temporaire lié à la session uniquement (pas sauvegardé dans la campagne sauf option explicite)
- Une fois créé, ajouté en "En réserve"

> Les entités PJ (personnages des participants) sont ajoutées **automatiquement** à la scène quand un joueur rejoint la session et que son `character_id` est assigné. Elles apparaissent directement dans "Entités en scène" (visibles par défaut).

---

## Fin de session

### Déclenchement

Bouton `Terminer la session` dans le header barre → modal de confirmation.

### Modal de fin de session

```
┌─────────────────────────────────────────────────────────┐
│  Terminer la session                                    │
│                                                         │
│  Points d'aventure à distribuer                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │ Personnage         PA à ajouter                   │  │
│  │ Borin (Tom)        [  3  ] (suggéré : 3)          │  │
│  │ Legolas (Mathieu)  [  3  ] (suggéré : 3)          │  │
│  │ Aelindra (Claire)  [  3  ] (suggéré : 3)          │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  ℹ️  La session sera archivée. La TV affichera un       │
│      écran de résumé.                                   │
│                                                         │
│  [ Annuler ]          [ Terminer et distribuer ]        │
└─────────────────────────────────────────────────────────┘
```

### Actions déclenchées à la validation

1. Les points d'aventure saisis sont ajoutés à `characters.data.adventure_points` pour chaque personnage
2. `session.status` passe à `completed`
3. La TV bascule vers un **overlay de fin de session** (liste des personnages + PA gagnés + résumé loot distribué dans la session)
4. Les participants reçoivent une notification sur leur téléphone ("La session est terminée")
5. Le MJ est redirigé vers la page de la campagne

> Le contenu exact de l'overlay TV de fin de session est défini dans `feature-display-tv.md`.
> Le calcul des PA suggérés (règle TOR : 1 à 3 selon la qualité de la session) reste une saisie manuelle du MJ — l'app ne suggère qu'une valeur par défaut modifiable.

---

## Affichage TV — Principe de synchronisation

> **Le panneau session est la télécommande de la TV.** Toute action MJ dans ce panneau met à jour la TV en temps réel via Supabase Realtime.

| Action MJ | Effet sur la TV |
|---|---|
| Changer de scène active | Nouvelle battlemap affichée |
| Déplacer un token | Token repositionné en temps réel |
| Révéler une entité | Token apparaît |
| Masquer une entité | Token disparaît |
| Démarrer un combat | Bandeau initiative apparaît |
| Passer au tour suivant | Entité active mise en avant dans le bandeau |
| Terminer le combat | Bandeau retiré |
| Scène `journey` active | Mode voyage sur TV (grille hex + marqueur) |
| Scène `community` active | Mode communauté sur TV |
| Terminer la session | Overlay de fin de session |

Le `display_mode` de la session suit automatiquement le type de la scène active — le MJ ne le configure pas manuellement.

```typescript
// Mapping automatique type de scène → display_mode TV
const displayModeFromScene: Record<SceneType, DisplayMode> = {
  combat:      'combat',
  exploration: 'exploration',
  journey:     'journey',
  community:   'community',
}
```

---

## Données chargées au montage

Le composable `useGMSession(sessionId)` charge :

```typescript
{
  session: GameSession        // id, status, display_mode, combat_active, combat_round, active_scene_id
  campaign: Campaign          // id, name, current_date_ingame, current_haven
  participants: SessionParticipant[]  // joueurs connectés + character_id + player_name
  activeScene: Scene | null   // background_url, type, name
}
```

Le composable `useScene(sessionId)` gère :

```typescript
{
  scenes: Scene[]             // toutes les scènes de la session
  activeEntities: SceneEntity[]  // entités de la scène active (visible ou cachées)
  reserveEntities: SceneEntity[] // entités non positionnées (position null)
}
```

---

## Endpoints serveur spécifiques à cette feature

### `POST /api/session/[id]/scene`

Authentifié MJ. Crée une nouvelle scène dans la session en cours.

**Body :**
```json
{
  "name": "Nom de la scène",
  "type": "combat",
  "background_url": "https://..." // optionnel
}
```

---

### `PATCH /api/session/[id]/active-scene`

Authentifié MJ. Change la scène active.

**Body :**
```json
{ "scene_id": "uuid" }
```

**Actions :**
1. Vérifie que la scène appartient à la session
2. Si `combat_active = true` → termine le combat automatiquement avant le changement
3. Met à jour `session.active_scene_id`
4. Calcule et met à jour `session.display_mode` d'après le type de la nouvelle scène
5. Supabase Realtime propage → TV change

---

### `POST /api/session/[id]/announce`

Authentifié MJ. Envoie une annonce aux joueurs.

**Body :**
```json
{ "message": "Texte de l'annonce" }
```

**Actions :**
1. Insert dans `session_messages` (table à créer — voir schéma)
2. Supabase Realtime propage → téléphones joueurs

---

### `POST /api/session/[id]/end`

Authentifié MJ. Termine la session.

**Body :**
```json
{
  "adventure_points": [
    { "character_id": "uuid", "points": 3 },
    { "character_id": "uuid", "points": 3 }
  ]
}
```

**Actions :**
1. Pour chaque entrée : `characters.data.adventure_points += points`
2. `session.status = 'completed'`
3. `session.display_mode = 'end_screen'`
4. Insert un message `app_event` "La session est terminée"
5. Supabase Realtime propage → TV affiche l'overlay de fin

---

## Modèle de données — ajouts

### Table `session_messages` (nouvelle)

```sql
CREATE TABLE session_messages (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id   uuid NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  type         text NOT NULL CHECK (type IN ('gm_message', 'app_event')),
  content      text NOT NULL,
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- Index pour la récupération chronologique
CREATE INDEX session_messages_session_id_created_at
  ON session_messages(session_id, created_at DESC);

-- RLS : le MJ voit tout, les joueurs voient via server endpoint
ALTER TABLE session_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY session_messages_gm_all ON session_messages
  FOR ALL TO authenticated
  USING (
    session_id IN (
      SELECT s.id FROM sessions s
      JOIN campaigns c ON c.id = s.campaign_id
      WHERE c.gm_user_id = auth.uid()
    )
  );
```

### Ajout sur `sessions`

```sql
ALTER TABLE sessions
  ADD COLUMN display_mode text NOT NULL DEFAULT 'exploration'
    CHECK (display_mode IN ('exploration', 'combat', 'journey', 'community', 'end_screen'));
```

---

## Ce qui n'est PAS dans cette feature

- Contenu du panel voyage (grille hex, rôles, étapes) → `feature-journey.md`
- Contenu détaillé du panel communauté (dépense XP, vertus) → à spécifier Phase 4
- Overlay TV de fin de session (rendu visuel) → `feature-display-tv.md`
- Raccourcis clavier (Tour suivant, etc.) → `feature-shortcuts.md` (Phase 4)
- Mode préparation pré-session (préparer les entités avant de lancer) → `feature-shortcuts.md` Phase 4 (F1)
- Statuts visuels sur tokens (blessé, mort stylisé) → Phase 4 (F2)
- Historique détaillé de session → `feature-session-history.md`
