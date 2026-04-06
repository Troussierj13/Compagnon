# Carte de l'état — State Map

> Ce document répond à : **quel état vit où** dans l'application.
> À lire avant d'écrire un composable, une page, ou un endpoint.
>
> Référence : `app/docs/technical/types.md` (structures de données),
> `app/docs/architecture.md` (décisions d'architecture)

---

## Vue d'ensemble

```
┌─────────────────────────────────────────────────────────────────────────┐
│  PERSISTANCE LONGUE DURÉE                                               │
│  Supabase (PostgreSQL)                                                  │
│  → campaigns, sessions, characters, combatants, scene_entities,        │
│    initiative_slots, loot, media, nfc_tags, journey_maps...            │
└───────────────────────────────────┬─────────────────────────────────────┘
                                    │
             ┌──────────────────────┼──────────────────────┐
             ▼                      ▼                      ▼
    ┌─────────────────┐   ┌──────────────────┐   ┌─────────────────┐
    │  MJ (auth)      │   │  Joueur (anon)   │   │  TV (anon)      │
    │  Supabase Auth  │   │  localStorage    │   │  URL UUID       │
    │  session cookie │   │  participant_id  │   │  (secret)       │
    └────────┬────────┘   └────────┬─────────┘   └────────┬────────┘
             │                     │                       │
             ▼                     ▼                       ▼
    Lecture directe DB     Server endpoints        Server endpoints
    via composables        (jamais Supabase        (useSupabaseAdmin)
    (RLS MJ valide)        direct côté client)
```

---

## LocalStorage (client joueur uniquement)

> Persisté après `POST /api/session/join`. Effacé si le joueur quitte volontairement.
> Jamais de données MJ en localStorage.

```typescript
// Clés localStorage
'compagnon:session_id'      // UUID de la session en cours
'compagnon:participant_id'  // UUID généré à l'entrée, valide toute la session
'compagnon:character_id'    // UUID du personnage choisi (null si non choisi)
'compagnon:player_name'     // Nom affiché (saisi au join)
```

**Durée de vie** : jusqu'à fermeture de session ou nouvelle session.
**Sécurité** : `participant_id` est validé côté server à chaque requête via `validateParticipant()`.

---

## Composables — Inventaire complet

### Règle fondamentale
> Les refs sont déclarées **à l'intérieur** de la fonction composable.
> Chaque appel crée une instance d'état isolée.
> Pour partager l'état entre composants : même parent commun + `provide/inject`.

---

### `useGMCampaign(campaignId: string)`
**Surface** : Back-office MJ
**Fichier** : `app/composables/useGMCampaign.ts`

| État | Type | Source | Realtime |
|---|---|---|---|
| `campaign` | `Campaign \| null` | `GET /api/campaigns/[id]` | Non |
| `counters` | `{ characters, sessions, combatants, ... }` | idem | Non |
| `loading` | `boolean` | Local | — |

**Cycle de vie** : chargé sur `/gm/campaigns/[id]`, détruit à la navigation.
**Mutations** : `updateCampaign(patch)`, `deleteCampaign()`.

---

### `useCharacters(campaignId: string)`
**Surface** : Back-office MJ
**Fichier** : `app/composables/useCharacters.ts`

| État | Type | Source | Realtime |
|---|---|---|---|
| `characters` | `Character[]` | `GET /api/campaigns/[id]/characters` | Non |
| `loading` | `boolean` | Local | — |

**Mutations** : `createCharacter(data)`, `deleteCharacter(id)`.

---

### `useCharacter(characterId: string)`
**Surface** : Back-office MJ + Session MJ (lecture stats live)
**Fichier** : `app/composables/useCharacter.ts`

| État | Type | Source | Realtime |
|---|---|---|---|
| `character` | `Character \| null` | `GET /api/characters/[id]` | Non* |
| `isDirty` | `boolean` | Local (comparaison snapshot) | — |

*En session live, les modifications d'endurance/espoir transitent par `PATCH /api/characters/[id]/endurance`
et déclenchent un event Realtime sur `scene_entities` (pas sur `characters` directement).

**Mutations** : `save(patch)`, `updateEndurance(value)`, `updateHope(value)`.

---

### `useCombatants(campaignId: string)`
**Surface** : Back-office MJ
**Fichier** : `app/composables/useCombatants.ts`

| État | Type | Source | Realtime |
|---|---|---|---|
| `combatants` | `Combatant[]` | `GET /api/campaigns/[id]/combatants` | Non |

---

### `useCombatant(combatantId: string)`
**Surface** : Back-office MJ + Session MJ (fiche dans slideover)
**Fichier** : `app/composables/useCombatant.ts`

| État | Type | Source | Realtime |
|---|---|---|---|
| `combatant` | `Combatant \| null` | `GET /api/combatants/[id]` | Non |

---

### `useGameSystem()`
**Surface** : Back-office MJ (global, partagé entre composants)
**Fichier** : `app/composables/useGameSystem.ts`

| État | Type | Source | Realtime |
|---|---|---|---|
| `cultures` | `Culture[]` | `GET /api/game-system/cultures` | Non |
| `virtues` | `Virtue[]` | `GET /api/game-system/virtues` | Non |
| `rewards` | `Reward[]` | `GET /api/game-system/rewards` | Non |

**Stratégie de cache** : données quasi-statiques, charger une seule fois au montage.
Ne pas re-fetcher à chaque appel du composable — utiliser `provide/inject` depuis un layout.

---

### `useArmory(campaignId: string)`
**Surface** : Back-office MJ + CharacterEquipmentEditor (picker d'arme/armure)
**Fichier** : `app/composables/useArmory.ts`

| État | Type | Source | Realtime |
|---|---|---|---|
| `weapons` | `Weapon[]` | `GET /api/campaigns/[id]/armory/weapons` | Non |
| `armors` | `Armor[]` | `GET /api/campaigns/[id]/armory/armors` | Non |

---

### `useGMSession(sessionId: string)` ⚡ Realtime
**Surface** : Panneau session MJ
**Fichier** : `app/composables/useGMSession.ts`

| État | Type | Source | Realtime |
|---|---|---|---|
| `session` | `GameSession \| null` | `GET /api/session/[id]/state` (init) | `sessions` INSERT/UPDATE |
| `participants` | `Participant[]` | idem | `session_participants` INSERT |
| `activeSceneId` | `string \| null` | dérivé de `session` | idem |

**Channel Realtime** : `session:${sessionId}` — écoute `sessions` et `session_participants`.
**Nettoyage** : stocker `unsub` et appeler avant re-montage ou destruction du composable.

---

### `useScene(sessionId: string)` ⚡ Realtime
**Surface** : Panneau session MJ
**Fichier** : `app/composables/useScene.ts`

| État | Type | Source | Realtime |
|---|---|---|---|
| `scenes` | `Scene[]` | `GET /api/session/[id]/scenes` (init) | `scenes` INSERT/UPDATE/DELETE |
| `activeScene` | `Scene \| null` | dérivé de `scenes` + `activeSceneId` | idem |
| `entities` | `SceneEntity[]` | `GET .../scenes/[activeSceneId]/entities` | `scene_entities` ALL |

**Important** : sur INSERT `scene_entities`, ne pas utiliser `payload.new` pour les relations
(ex: character ou combatant joint). Faire un fetch ciblé après l'event.

**Mutations** :
- `createScene(data)` → POST
- `activateScene(sceneId)` → POST
- `addEntity(sceneId, data)` → POST
- `moveEntity(entityId, position)` → PATCH (drag & drop temps réel)
- `removeEntity(entityId)` → DELETE

---

### `useInitiative(sessionId: string)` ⚡ Realtime
**Surface** : Panneau session MJ (colonne droite)
**Fichier** : `app/composables/useInitiative.ts`

| État | Type | Source | Realtime |
|---|---|---|---|
| `slots` | `InitiativeSlot[]` | `GET /api/session/[id]/initiative` (init) | `initiative_slots` ALL |
| `currentTurnIndex` | `number` | dérivé de `slots` | idem |
| `isActive` | `boolean` | dérivé de session status | — |

**Mutations** : `reorder(orderedIds)`, `nextTurn()`, `endCombat()`.

---

### `useDisplaySession(sessionId: string)` ⚡ Realtime
**Surface** : Affichage TV
**Fichier** : `app/composables/useDisplaySession.ts`

| État | Type | Source | Realtime |
|---|---|---|---|
| `displayMode` | `DisplayMode` | `GET /api/display/[id]/state` (init) | `sessions` UPDATE (display_mode) |
| `activeScene` | `Scene \| null` | idem | `scenes` UPDATE |
| `entities` | `SceneEntity[]` | idem | `scene_entities` ALL |
| `initiativeSlots` | `InitiativeSlot[]` | idem | `initiative_slots` ALL |
| `nfcOverlay` | `NFCOverlay \| null` | — | `nfc_events` INSERT |

**Lecture seule** — ce composable ne mute jamais la DB.
**Exception sécurité** : l'accès TV est autorisé par UUID de session dans l'URL, pas par auth.

---

### `usePlayerSession()` ⚡ Realtime (exception)
**Surface** : Vue joueur téléphone
**Fichier** : `app/composables/usePlayerSession.ts`

| État | Type | Source | Realtime |
|---|---|---|---|
| `session` | `GameSession \| null` | `GET /api/session/[id]/state` | `sessions` (client anon) |
| `character` | `Character \| null` | inclus dans state | — |
| `activeScene` | `Scene \| null` | inclus dans state | `scene_entities` (client anon) |
| `visibleEntities` | `SceneEntity[]` | filtré `visible_to_players` | idem |
| `announcements` | `Announcement[]` | `GET /api/session/[id]/state` | `chat_messages` (client anon) |

**Exception Realtime joueur** : ce composable souscrit directement au client Supabase anon
pour les tables `sessions` et `scene_entities`. Les canaux Realtime fonctionnent différemment
du RLS SELECT. Le filtrage `visible_to_players` est appliqué **côté client** sur les events.

**Lecture depuis localStorage** au montage :
```typescript
const sessionId     = localStorage.getItem('compagnon:session_id')
const participantId = localStorage.getItem('compagnon:participant_id')
const characterId   = localStorage.getItem('compagnon:character_id')
```

---

### `useMediaLibrary(campaignId: string)`
**Surface** : Back-office MJ (ImagePicker transverse)
**Fichier** : `app/composables/useMediaLibrary.ts`

| État | Type | Source | Realtime |
|---|---|---|---|
| `images` | `MediaImage[]` | `GET /api/campaigns/[id]/media` | Non |

---

### `useLoot(campaignId: string)`
**Surface** : Back-office MJ + Session (distribution)
**Fichier** : `app/composables/useLoot.ts`

| État | Type | Source | Realtime |
|---|---|---|---|
| `catalog` | `LootItem[]` | `GET /api/campaigns/[id]/loot/catalog` | Non |
| `tables` | `LootTable[]` | `GET /api/campaigns/[id]/loot/tables` | Non |

---

### `useJourney(sessionId: string)` ⚡ Realtime
**Surface** : Panneau session MJ (mode journey) + TV (mode travel)
**Fichier** : `app/composables/useJourney.ts`

| État | Type | Source | Realtime |
|---|---|---|---|
| `journeyMap` | `JourneyMap \| null` | `GET /api/session/[id]/journey` | `journey_progress` UPDATE |
| `currentHex` | `HexPosition \| null` | dérivé | idem |

---

## Flux de données par surface

### Back-office MJ (`/gm/**`)

```
Page /gm/campaigns/[id]
  └── useGMCampaign(id)
        └── Supabase direct (MJ auth, RLS valide)

Page /gm/campaigns/[id]/characters/[charId]
  ├── useCharacter(charId)
  │     └── GET /api/characters/[id]  (MJ auth)
  ├── useGameSystem()               ← provide depuis layout /gm
  └── useArmory(campaignId)
```

### Panneau session MJ (`/gm/.../session/[sessionId]`)

```
Page session/[sessionId]
  ├── useGMSession(sessionId) ──── Realtime: sessions, participants
  ├── useScene(sessionId)     ──── Realtime: scenes, scene_entities
  └── useInitiative(sessionId) ─── Realtime: initiative_slots

  Colonne gauche  : SceneSelector    ← useScene.scenes
  Colonne centre  : EntityTokenGM[]  ← useScene.entities (drag & drop)
  Colonne droite  : EntityList       ← useScene.entities
                    InitiativeTrack  ← useInitiative.slots
                    StatsPopover     ← useCharacter | useCombatant (à la demande)
  Bas centre      : AnnouncementPanel
```

### Display TV (`/display/[sessionId]`)

```
Page display/[sessionId]
  └── useDisplaySession(sessionId) ── Realtime: sessions, scenes, entities, initiative, nfc
        ├── displayMode === 'waiting'    → WaitingScreen
        ├── displayMode === 'battlemap'  → BattlemapView + InitiativeBanner
        ├── displayMode === 'travel'     → TravelView
        └── displayMode === 'end_screen' → EndScreen
```

### Vue joueur téléphone (`/player/**`)

```
Page player/join
  └── (pas de composable, appelle POST /api/session/join directement)
        → persiste session_id + participant_id + player_name en localStorage
        → redirige vers /player/scene

Page player/scene
  └── usePlayerSession()
        ├── Init: GET /api/session/[id]/state (valide participant_id)
        ├── Realtime anon: sessions, scene_entities
        ├── Filtre client: visible_to_players = true
        └── Composants: SceneView, AnnouncementBanner, CharacterSelectModal
              └── CharacterSelectModal → GET /api/session/[id]/characters
                                       → PATCH /api/player/[pid]/character
```

---

## Subscriptions Realtime — Récapitulatif

| Composable | Table(s) écoutée(s) | Événements | Auth client |
|---|---|---|---|
| `useGMSession` | `sessions`, `session_participants` | ALL | MJ (auth) |
| `useScene` | `scenes`, `scene_entities` | ALL | MJ (auth) |
| `useInitiative` | `initiative_slots` | ALL | MJ (auth) |
| `useDisplaySession` | `sessions`, `scenes`, `scene_entities`, `initiative_slots`, `nfc_events` | ALL | Anon (UUID) |
| `usePlayerSession` | `sessions`, `scene_entities` | ALL | Anon (join_code validé) |
| `useJourney` | `journey_progress` | UPDATE | MJ (auth) |

**Règle de nettoyage** :
```typescript
// Dans chaque composable avec Realtime
onUnmounted(() => {
  if (unsub) unsub()
})
// OU via onScopeDispose() si le composable n'est pas dans un composant directement
```

---

## Ce qui N'est PAS géré en état côté client

Ces données sont toujours **refetchées à la demande** et non stockées en mémoire :

- Catalogue de cultures/vertus/récompenses (si pas de `useGameSystem` monté)
- Historique de sessions passées
- Logs d'events NFC (consulté en back-office, pas en live)
- Inventaire complet d'un personnage (chargé à l'ouverture de la fiche, pas en session)
