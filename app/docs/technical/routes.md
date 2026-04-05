# Routes & Architecture des pages

> Référence : `app/docs/vision/README.md`, tous les `feature-*.md`.
> Ce fichier décrit toutes les pages Nuxt 3, leurs layouts, middlewares, composables et composants attendus.

---

## Vue d'ensemble des surfaces

| Surface | Préfixe URL | Auth | Layout | Middleware |
|---|---|---|---|---|
| Back-office MJ | `/gm/**` | Supabase Auth | `default` | `gm.ts` |
| Panneau session MJ | `/gm/.../session/[id]` | Supabase Auth | `default` | `gm.ts` |
| Affichage TV | `/display/[sessionId]` | Aucune | `fullscreen` | — |
| Vue joueur téléphone | `/player/**` | localStorage | `minimal` ou custom | `player-session.ts` |
| NFC Back-office | `/gm/nfc/**` | Supabase Auth | `default` | `gm.ts` |

---

## Back-office MJ (`/gm/**`)

### `/gm`
**Page** : Dashboard campagnes (liste de toutes les campagnes du MJ)

- **Layout** : `default`
- **Middleware** : `gm` (redirige vers `/login` si non auth)
- **Composables** : `useSupabaseClient()`, query directe `campaigns` filtrée par `gm_user_id`
- **Composants** : `CampaignCard` (nom, nb de sessions, date mise à jour)
- **Actions** : Créer une campagne (modal ou page dédiée)

---

### `/gm/campaigns/[id]`
**Page** : Hub central de campagne

- **Layout** : `default`
- **Middleware** : `gm`
- **Composables** : `useGMCampaign(id)` — charge la campagne + compteurs
- **Données affichées** :
  - En-tête : nom de campagne, date in-game courante, bouton "Lancer/Reprendre la session active"
  - Grid de 7 cards de navigation (voir ci-dessous)

| Card | Sous-page | Compteur |
|---|---|---|
| Personnages joueurs | `/characters` | N personnages |
| Ennemis & PNJ | `/combatants` | N combatants |
| Sessions | `/sessions` | N sessions (X active) |
| Armurerie | `/armory` | N armes + armures |
| Bibliothèque média | `/media` | N images |
| Carte de campagne | `/map` | N voyages terminés |
| Configuration | `/settings` | — |

---

### `/gm/campaigns/[id]/characters`
**Page** : Liste des personnages joueurs de la campagne

- **Middleware** : `gm`
- **Composables** : query `characters` WHERE `campaign_id = id`
- **Composants** : `CharacterListItem` (nom, player_name, portrait, culture, vocation)
- **Actions** : "Nouveau personnage" → wizard de création (`feature-character-creation.md`)

---

### `/gm/campaigns/[id]/characters/[charId]`
**Page** : Fiche complète et éditable d'un personnage

- **Middleware** : `gm`
- **Composables** : `useCharacter(charId)` — charge fiche + culture + vertus + récompenses
- **Composants** :
  - `CharacterSheet` — fiche complète (tous les onglets éditables)
  - `CharacterAttributesEditor`
  - `CharacterSkillsEditor`
  - `CharacterEquipmentEditor`
  - `CharacterInventoryEditor`
  - `CharacterWisdomEditor` (vertus)
  - `CharacterValorEditor` (récompenses)
- **Actions** : Export NFC, distribuer des points, sauvegarder

---

### `/gm/campaigns/[id]/characters/new`
**Page** : Wizard de création de personnage (Phase future)

- **Middleware** : `gm`
- **Composants** : `CharacterCreationWizard` (7 étapes)
- **Étapes** : Infos → Culture → Attributs → Compétences → Équipement → Trésor → Vertus/Récompenses

---

### `/gm/campaigns/[id]/combatants`
**Page** : Liste des ennemis ET PNJ de la campagne

- **Middleware** : `gm`
- **Composables** : query `combatants` WHERE `campaign_id = id`
- **Composants** : `CombatantListItem` (nom, kind, rarity badge, famille, endurance)
- **Filtres UI** : kind (enemy/npc), rareté, recherche texte
- **Actions** : "Nouvel ennemi", "Nouveau PNJ"

> **Note** : Les opérations CRUD sur `combatants` et ses sous-tables (`combatant_combat_skills`, `combatant_fearsome_abilities`, `enemy_loot_table`, `npc_inventory`) se font via **queries directes Supabase** depuis les composables MJ authentifiés. Pas de server endpoint Nitro nécessaire — le RLS filtre par `campaign_id IN (SELECT id FROM campaigns WHERE gm_user_id = auth.uid())`.

---

### `/gm/campaigns/[id]/combatants/[combatantId]`
**Page** : Fiche ennemi ou PNJ (création et édition)

- **Middleware** : `gm`
- **Composables** : `useCombatant(combatantId)` — charge fiche + combat skills + fearsome abilities + loot table
- **Composants** :
  - `CombatantPresentation` (nom, sous-nom, traits, famille, rareté, artwork)
  - `CombatantStats` (niveau, endurance, puissance, haine/détermination, parade, armure, seuil)
  - `CombatantCombatSkillsTable` (drag-sort éditable)
  - `CombatantFearsomeAbilitiesTable` (drag-sort éditable)
  - `CombatantLootTable` (enemies uniquement — picker items + probabilité + quantité)
  - `NpcInventoryEditor` (PNJ uniquement)
  - `NfcExportSection` (enemies uniquement)

> **Note** : Les opérations CRUD sur `combatants` et ses sous-tables (`combatant_combat_skills`, `combatant_fearsome_abilities`, `enemy_loot_table`, `npc_inventory`) se font via **queries directes Supabase** depuis les composables MJ authentifiés. Pas de server endpoint Nitro nécessaire — le RLS filtre par `campaign_id IN (SELECT id FROM campaigns WHERE gm_user_id = auth.uid())`.

---

### `/gm/campaigns/[id]/sessions`
**Page** : Liste des sessions de la campagne

- **Middleware** : `gm`
- **Composables** : query `sessions` WHERE `campaign_id = id`, ORDER BY `created_at DESC`
- **Composants** : `SessionListItem` (nom, statut, date), `CreateSessionModal`
- **Actions** : Créer une session, reprendre une session active, archiver/supprimer

---

### `/gm/campaigns/[id]/session/[sessionId]`
**Page** : Panneau session live MJ — interface principale de jeu

- **Middleware** : `gm`
- **Layout** : `default` (mais interface très dense, sections dédiées)
- **Composables** :
  - `useGMSession(sessionId)` — état session + participants + realtime
  - `useScene(sessionId)` — scènes + entités + CRUD
- **Structure** : *(spec complète dans `feature-session-panel.md` à créer)*
  - Sidebar gauche : scènes de la session, entités cachées
  - Zone centrale : battlemap avec tokens drag & drop
  - Sidebar droite : participants, chat/annonces, actions combat
  - Bandeau haut : mode TV, contrôles session, lancer combat
- **Composants** :
  - `Battlemap` — canvas drag & drop des tokens
  - `EntityToken` / `gm/EntityToken` — token déplaçable
  - `EntityPopover` — stats rapides au clic
  - `InitiativeBar` — fil d'initiative (même composant que TV)
  - `LootOverlay` — distribution du loot
  - `AnnouncementPanel` — envoi d'annonces MJ
  - `CombatModal` — préparation du combat
  - `OverlayManager` — gestion des overlays TV

---

### `/gm/campaigns/[id]/armory`
**Page** : Hub armurerie (redirection vers /weapons ou /armors)

---

### `/gm/campaigns/[id]/armory/weapons`
**Page** : Catalogue des armes de la campagne

- **Middleware** : `gm`
- **Composables** : query `campaign_weapons` WHERE `campaign_id = id`
- **Composants** : `WeaponTable` (nom, dmg, injury 1/2 main, poids, notes)
- **Actions** : Créer, éditer, supprimer (bloqué si arme équipée)

> **Note** : Les opérations CRUD sur `campaign_weapons` et `campaign_armors` se font via **queries directes Supabase** depuis les composables MJ. Pas de server endpoint nécessaire.

---

### `/gm/campaigns/[id]/armory/armors`
**Page** : Catalogue armures, casques, boucliers

- **Middleware** : `gm`
- **Composables** : query `campaign_armors` WHERE `campaign_id = id`
- **Filtres** : type (armor/helm/shield)
- **Actions** : Pré-remplir avec données TOR de base, créer, éditer, supprimer

> **Note** : Les opérations CRUD sur `campaign_weapons` et `campaign_armors` se font via **queries directes Supabase** depuis les composables MJ. Pas de server endpoint nécessaire.

---

### `/gm/campaigns/[id]/media`
**Page** : Bibliothèque d'images de la campagne

- **Middleware** : `gm`
- **Composables** : query `campaign_media` WHERE `campaign_id = id`
- **Composants** :
  - `MediaGrid` — grille d'images avec filtres par catégorie
  - `MediaUploader` — drag & drop upload vers Supabase Storage
  - `NfcMappingsTable` — tableau famille×rareté → image
- **Storage** : bucket `campaign-media/{campaign_id}/`

---

### `/gm/campaigns/[id]/map`
**Page** : Carte cumulative des voyages de la campagne

- **Middleware** : `gm`
- **Composables** : query `journeys` WHERE `campaign_id = id AND status = 'completed'`
- **Composants** : `HexGrid` (read-only, superposition de tous les `actual_path`)
- **Note** : Vue synthétique calculée dynamiquement — pas d'image statique stockée

---

### `/gm/campaigns/[id]/settings`
**Page** : Configuration de la campagne

- **Middleware** : `gm`
- **Composables** : `useCampaign(id)` — charge + édite la campagne
- **Composants** :
  - Formulaire : nom, description, start_date, current_date (+ contrôle +X jours), season override, havre actif, travel_rules (Markdown), wallpaper (Image Picker)
- **Actions** : Sauvegarder, avancer la date

---

### `/gm/system`
**Page** : Hub du système de jeu global

- **Middleware** : `gm`
- **Navigation** : Cultures, Vertus, Récompenses, Havres

---

### `/gm/system/cultures`
**Page** : Liste et CRUD des cultures

- **Middleware** : `gm`
- **Composables** : query `cultures` + `cultural_virtues`
- **Actions** : Créer, éditer (incl. gestion des vertus culturelles associées), supprimer (bloqué si perso utilise la culture)

---

### `/gm/system/cultures/[id]`
**Page** : Édition d'une culture + ses vertus culturelles

---

### `/gm/system/virtues`
**Page** : Liste et CRUD des vertus ordinaires

- **Composants** : `VirtueEditor` — gestion dynamique des variantes et modifiers

---

### `/gm/system/rewards`
**Page** : Liste et CRUD des récompenses

- **Composants** : `RewardEditor` — multi-sélection des cibles + modifiers

---

### `/gm/system/havens`
**Page** : Liste et CRUD des Havres

---

### `/gm/nfc`
**Page** : Portail NFC — accès aux outils NFC

- **Middleware** : `gm`
- **Liens vers** : `/encode`, `/types`, `/pico`

---

### `/gm/nfc/encode`
**Page** : Outil d'encodage des puces NFC

- **Middleware** : `gm`
- **Composables** : query `nfc_entity_types`
- **Composants** :
  - `NfcTypeSelector` — sélection du type d'entité
  - `NfcDynamicForm` — formulaire généré depuis `nfc_entity_types.fields`
  - `NfcPayloadPreview` — affichage base64 en temps réel
- **Actions** : Copier base64, envoyer au Pico

---

### `/gm/nfc/types`
**Page** : Gestion des types d'entités NFC

---

### `/gm/nfc/pico`
**Page** : Configuration de la connexion au Raspberry Pi Pico

- **Middleware** : `gm`
- **Composables** : `$fetch('/api/nfc/pico-config')` (GET) + `$fetch('/api/nfc/pico-config', { method: 'PUT' })` (save)
- **Composants** :
  - `PicoUrlInput` — champ URL + bouton "Tester la connexion"
  - `PicoConnectionStatus` — indicateur vert/rouge + latence + dernière date de test
- **Note** : `NFC_SECRET` est configuré uniquement via variable d'environnement serveur (`app/.env`) — jamais via cette page UI

---

## Affichage TV (`/display/**`)

### `/display/[sessionId]`
**Page** : Affichage spectateur plein écran

- **Layout** : `fullscreen`
- **Middleware** : aucun
- **Composables** :
  - `useDisplaySession(sessionId)` — charge l'état initial + souscriptions Realtime
  - Souscriptions : `sessions`, `scene_entities`, `overlays`, `session_announcements`, `journeys`, `journey_stages`
- **Rendu selon `display_mode`** :
  - `waiting` → `WaitingScreen` (wallpaper ou carte cumulative si voyages terminés)
  - `battlemap` → `BattlemapDisplay` (carte + tokens + fil d'initiative si combat)
  - `travel` → `JourneyDisplay` (grille hex + marqueur + trail)
- **Overlays permanents** (sur tous les modes) :
  - Date in-game (haut centre, italique)
  - Overlay phase de communauté (si scène type `community`)
  - Toasts annonces MJ
  - Historique annonces
- **Composants** :
  - `WaitingScreen` — fond ou carte cumulative
  - `BattlemapDisplay` — map + tokens (lecture seule)
  - `JourneyDisplay` — grille hex
  - `InitiativeBar` — bandeau initiative (si combat_active)
  - `OverlayStack` — overlays en cascade
  - `DateOverlay` — date in-game permanente
  - `AnnouncementToast` — toast annonces
  - `AnnouncementHistory` — fil des dernières annonces
  - `EntityToken` / `player/EntityToken` — token lecture seule

---

## Vue joueur téléphone (`/player/**`)

### `/player/join`
**Page** : Rejoindre une session

- **Layout** : `minimal`
- **Middleware** : aucun
- **Étape 1** (existante) : Saisie join_code + player_name → `POST /api/session/join`
- **Étape 2** (nouvelle) : Sélection du personnage → `GET /api/session/[id]/characters/available`
- **Composants** :
  - `JoinCodeInput` — saisie du code (debounce + preview campagne)
  - `CharacterSelector` — liste des personnages disponibles (cards avec portrait + culture + vocation)
- **Post-join** : persiste `session_id`, `participant_id`, `character_id` dans localStorage → redirect `/player/scene`

---

### `/player/scene`
**Page** : Vue principale joueur (scène active + accès fiche)

- **Layout** : custom mobile-first (pas de sidebar MJ)
- **Middleware** : `player-session` (redirige vers `/player/join` si localStorage vide)
- **Composables** :
  - `usePlayerSession()` — charge l'état via server endpoints + Realtime anon
  - `useCharacterSheet(character_id)` — fiche du personnage (pour le slideover)
  - Souscriptions Realtime (client anon — policies publiques requises dans schema.md migration 011) :
    - `sessions` filtre `id = session_id`
    - `scene_entities` filtre `scene_id = active_scene_id` (uniquement `visible_to_players = true` via RLS)
    - `session_announcements` filtre `session_id = session_id`
    - `characters` : **NE PAS souscrire directement** — après un event Realtime sur `session_participants`, fetch `GET /api/characters/[id]` via server endpoint
- **Structure** :
  - Barre de status fixe (top) : nom joueur/perso, badge session, bouton "Feuille de perso", bouton "Quitter"
  - Zone haute : battlemap en lecture seule (mode spectateur)
  - Panneau bas : entités visibles (liste compacte)
  - Overlay fixe bas : endurance/espoir courants + états actifs
  - Slideover plein écran : fiche personnage (8 onglets)
- **Composants** :
  - `PlayerBattlemap` — battlemap lecture seule + tokens
  - `PlayerEntityList` — liste entités visibles
  - `PlayerVitalityOverlay` — bandeau fixe endurance/espoir
  - `CharacterSheetSlideover` — fiche 8 onglets
  - `CharacterTabIdentity`, `CharacterTabVitality`, `CharacterTabSkills`
  - `CharacterTabWisdom`, `CharacterTabWeapons`, `CharacterTabDefense`
  - `CharacterTabInventory`, `CharacterTabJourney` (contextuel)
  - `LevelUpBanner` — mode level-up (scène community)
  - `AnnouncementToast` — toasts annonces MJ

---

### `/player/sheet`
**Page** : Redirige vers `/player/scene`

```typescript
// pages/player/sheet.vue
definePageMeta({ middleware: 'player-session' })
navigateTo('/player/scene')
```

---

## Middlewares

### `gm.ts`
```typescript
// Redirige vers /login si l'utilisateur n'est pas authentifié via Supabase Auth
export default defineNuxtRouteMiddleware(() => {
  const user = useSupabaseUser()
  if (!user.value) return navigateTo('/login')
})
```

### `player-session.ts`
```typescript
// Côté client uniquement — redirige vers /player/join si localStorage vide
export default defineNuxtRouteMiddleware(() => {
  if (import.meta.server) return
  const sessionId = localStorage.getItem('session_id')
  const participantId = localStorage.getItem('participant_id')
  if (!sessionId || !participantId) return navigateTo('/player/join')
})
```

### `usePlayerStorage` (composable recommandé)
Centralise l'accès aux clés localStorage du joueur. À créer dans `app/composables/usePlayerStorage.ts`.

```typescript
// app/composables/usePlayerStorage.ts
export function usePlayerStorage() {
  // Côté client uniquement — toujours vérifier import.meta.client avant d'appeler
  const get = () => ({
    sessionId: localStorage.getItem('session_id'),
    participantId: localStorage.getItem('participant_id'),
    characterId: localStorage.getItem('character_id'),
  })
  const set = (data: { sessionId: string, participantId: string, characterId?: string }) => {
    localStorage.setItem('session_id', data.sessionId)
    localStorage.setItem('participant_id', data.participantId)
    if (data.characterId) localStorage.setItem('character_id', data.characterId)
  }
  const clear = () => {
    localStorage.removeItem('session_id')
    localStorage.removeItem('participant_id')
    localStorage.removeItem('character_id')
  }
  return { get, set, clear }
}
```

Le middleware `player-session.ts` et `usePlayerSession` doivent consommer ce composable.

---

## Layouts

### `default.vue`
Layout standard back-office MJ : header avec navigation + sidebar optionnelle.

### `fullscreen.vue`
Layout plein écran sans navigation : pour l'affichage TV (`/display/[sessionId]`).
- `overflow: hidden`, fond noir, pas de marges
- `height: 100vh`, `width: 100vw`

### `minimal.vue`
Layout minimal mobile : pour la page join joueur.
- Centré, padding réduit, pas de sidebar

---

## Server endpoints — emplacement des fichiers

```
app/server/api/
├── session/
│   ├── [code].get.ts                    ← GET /api/session/[code]
│   ├── join.post.ts                     ← POST /api/session/join
│   ├── create.post.ts                   ← POST /api/session/create
│   └── [id]/
│       ├── state.get.ts                 ← GET /api/session/[id]/state
│       ├── active-scene.patch.ts        ← PATCH /api/session/[id]/active-scene
│       ├── characters.get.ts            ← GET /api/session/[id]/characters
│       ├── characters/
│       │   └── available.get.ts         ← GET /api/session/[id]/characters/available
│       ├── participants/
│       │   └── [pid]/
│       │       └── character.patch.ts   ← PATCH /api/session/[id]/participants/[pid]/character
│       ├── scenes/
│       │   ├── index.get.ts             ← GET /api/session/[id]/scenes
│       │   ├── index.post.ts            ← POST /api/session/[id]/scenes
│       │   └── [sceneId]/
│       │       ├── index.patch.ts       ← PATCH /api/session/[id]/scenes/[sceneId]
│       │       └── index.delete.ts      ← DELETE /api/session/[id]/scenes/[sceneId]
│       ├── entities.post.ts             ← POST /api/session/[id]/entities (spawn)
│       ├── combat/
│       │   ├── start.post.ts
│       │   ├── next.post.ts
│       │   ├── reorder.post.ts
│       │   ├── end.post.ts
│       │   └── add-entity.post.ts
│       ├── entity/
│       │   └── [entityId]/
│       │       ├── index.delete.ts      ← DELETE /api/session/[id]/entity/[entityId]
│       │       ├── visibility.patch.ts
│       │       └── stats.patch.ts
│       ├── character/
│       │   └── [characterId]/
│       │       └── stats.patch.ts
│       ├── overlays/
│       │   ├── index.post.ts            ← POST /api/session/[id]/overlays
│       │   └── [overlayId]/
│       │       ├── index.patch.ts       ← PATCH /api/session/[id]/overlays/[overlayId]
│       │       └── index.delete.ts      ← DELETE /api/session/[id]/overlays/[overlayId]
│       ├── end.post.ts                  ← POST /api/session/[id]/end
│       ├── announcements.post.ts
│       ├── loot/
│       │   ├── resolve.post.ts
│       │   ├── confirm.post.ts
│       │   └── distribute.post.ts
│       └── journey/
│           ├── start.post.ts
│           ├── [journeyId]/
│           │   ├── resolve-stage.post.ts
│           │   └── complete.post.ts
├── display/
│   └── [sessionId]/
│       └── state.get.ts                 ← GET /api/display/[sessionId]/state
├── campaigns/
│   └── [id]/
│       └── characters.post.ts          ← POST /api/campaigns/[id]/characters
├── characters/
│   └── [id]/
│       ├── index.get.ts                 ← GET /api/characters/[id]
│       ├── index.patch.ts               ← PATCH /api/characters/[id]
│       ├── level-up.post.ts
│       └── distribute-points.post.ts
├── nfc/
│   ├── trigger.post.ts                 ← POST /api/nfc/trigger
│   ├── types/
│   │   ├── index.get.ts                ← GET /api/nfc/types
│   │   ├── index.post.ts               ← POST /api/nfc/types
│   │   └── [typeId]/
│   │       ├── index.patch.ts          ← PATCH /api/nfc/types/[typeId]
│   │       └── index.delete.ts         ← DELETE /api/nfc/types/[typeId]
│   └── pico-config/
│       ├── index.get.ts                ← GET /api/nfc/pico-config
│       ├── index.put.ts                ← PUT /api/nfc/pico-config
│       └── test.post.ts                ← POST /api/nfc/pico-config/test
├── game-system/
│   ├── cultures.get.ts
│   ├── virtues.get.ts
│   └── rewards.get.ts
└── journey-maps/
    ├── index.get.ts
    ├── index.post.ts                    ← POST /api/journey-maps
    └── [id]/
        ├── tiles.get.ts
        └── tiles/
            ├── bulk.post.ts             ← POST /api/journey-maps/[id]/tiles/bulk
            └── [tileId].patch.ts        ← PATCH /api/journey-maps/[id]/tiles/[tileId]
```

---

## Composables — emplacement et responsabilités

```
app/composables/
├── useGMSession.ts          ← État session MJ (session + campaign + activeScene + realtime)
├── useParticipants.ts       ← Liste des participants connectés + realtime (MJ)
│                               Expose: participants[], assign(pid, charId), Realtime session_participants
├── useScene.ts              ← CRUD scènes + entités MJ (lecture directe Supabase)
├── useCharacter.ts          ← Fiche personnage MJ (lecture directe Supabase)
├── usePlayerSession.ts      ← État session joueur (via server endpoints + realtime anon)
├── useCharacterSheet.ts     ← Fiche joueur (lecture + mutations via server endpoints)
├── useDisplaySession.ts     ← État TV (via server endpoint initial + realtime anon)
├── useInitiative.ts         ← Fil d'initiative (partagé MJ + TV)
├── useJourney.ts            ← Voyage en cours (MJ)
├── useLoot.ts               ← Résolution + distribution du loot (MJ)
├── useAnnouncements.ts      ← Annonces MJ (souscription realtime partagée)
└── usePlayerStorage.ts      ← Accès centralisé aux clés localStorage joueur
```

### Convention de partage d'état

Les refs sont déclarées **à l'intérieur de la fonction** composable (pas en module-scope).
→ Chaque appel crée une instance isolée.
→ Pour partager entre composants : `provide/inject` depuis un parent commun.

```typescript
// ❌ Anti-pattern : ref partagée entre tous les appels
const session = ref(null)  // en dehors de la fonction

// ✅ Correct : ref isolée par appel
export function useGMSession() {
  const session = ref(null)
  // ...
  return { session }
}
```

---

## Realtime — abonnements par surface

| Surface | Tables écoutées | Client | Exception |
|---|---|---|---|
| **MJ** | `session_participants`, `scene_entities`, `sessions` | Supabase Auth client | — |
| **TV** | `sessions`, `scene_entities`, `overlays`, `session_announcements`, `journeys`, `journey_stages` | Supabase anon | Lecture seule |
| **Joueur** | `sessions`, `scene_entities`, `session_announcements` | Supabase anon | Voir note ci-dessous |

> **Realtime joueur — Supabase v2** : Dans Supabase Realtime v2, le RLS s'applique aussi aux
> souscriptions Realtime (contrairement à v1). Le client anon ne reçoit des événements que si
> une policy SELECT l'autorise. Pour que les joueurs reçoivent les updates en temps réel :
>
> - `sessions` : policy public SELECT nécessaire sur la ligne de la session (par `join_code` ou `id`) — déjà couverte par la policy `sessions_public_read` du schéma initial
> - `scene_entities` : les joueurs reçoivent uniquement les entités `visible_to_players = true`. Une policy `scene_entities_player_read` avec `USING (visible_to_players = true)` est requise
> - `characters` : policy public SELECT bloquerait les données sensibles — **ne pas utiliser directement**. Le composable `usePlayerSession` doit appeler `GET /api/characters/[id]` (server endpoint) après avoir reçu un event Realtime
> - `session_announcements` : une policy `announcements_public_read` est requise (voir `schema.md` migration 011)
> - `characters` : **ne pas souscrire directement** — données sensibles, pas de column-level RLS possible. Le composable `usePlayerSession` doit fetch `GET /api/characters/[id]` après avoir reçu un event Realtime sur `session_participants` (quand `character_id` change)
>
> Voir `schema.md` section "Policies RLS requises pour Realtime v2" et `architecture.md`.
