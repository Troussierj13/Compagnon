# Plan d'implémentation — Ordre de build

> **Ce fichier est à la fois le plan de construction et le tracker de progression.**
> Il se lit en début de session et se met à jour en fin de session.
>
> Règle d'or : **ne jamais inférer de comportements depuis le code existant** — toujours
> référencer les docs `vision/` + `technical/` comme source de vérité.

---

## 🔖 RÉSUMÉ DE SESSION COURANTE

> **Mettre à jour ce bloc en fin de chaque session.** C'est le seul contexte à lire
> avant de reprendre le travail. Une fois le bloc mis à jour, rouvrir une nouvelle
> conversation Claude avec uniquement ce fichier + les fichiers listés dans "Prochaine étape".

```
Dernière session : 2026-04-07

✅ Terminé cette session :
  - Phase 1 complète ✅ (voir session précédente)
  - Corrections post-review Phase 1 :
    - Fix B1 : virtues/index.get.ts + rewards/index.get.ts → accès public (useSupabaseAdmin)
    - Fix B2 : app/pages/gm/index.vue créé (dashboard MJ)
    - Fix B3 : app/pages/index.vue créé (redirect racine)
    - Fix B4 : cultures/[id].vue refactoré → mutations via useGameSystem + inject(GameSystemKey)
    - Fix I3 : virtues/[id].patch.ts → culture_id inclus dans select cultural
    - Fix I1 : virtues/index.vue + rewards/index.vue → useGameSystem (plus de state local, inject)
    - Fix I2 : default.vue → provide(GameSystemKey, gs) + InjectionKey exporté
    - Fix M3 : confirm() remplacé par UModal dans les 4 pages
    - Fix M7 : console.error ajouté dans tous les catch
    - Fix template : .value supprimé dans les templates (gs.loading, gs.error, gs.cultures, gs.virtues, gs.rewards)

📂 Fichiers créés / modifiés :
  - app/server/api/game-system/virtues/index.get.ts (modifié)
  - app/server/api/game-system/rewards/index.get.ts (modifié)
  - app/server/api/game-system/virtues/[id].patch.ts (modifié)
  - app/pages/gm/index.vue (créé)
  - app/pages/index.vue (créé)
  - app/pages/gm/system/index.vue (modifié)
  - app/pages/gm/system/cultures/[id].vue (modifié)
  - app/pages/gm/system/virtues/index.vue (modifié)
  - app/pages/gm/system/rewards/index.vue (modifié)
  - app/composables/useGameSystem.ts (modifié — GameSystemKey exporté)
  - app/layouts/default.vue (modifié — provide GameSystem)
  - app/docs/technical/build-order.md (RÉSUMÉ mis à jour)

🎯 Prochaine étape exacte :
  Phase 2.1 — server endpoints Campaigns
  Fichiers à charger :
    - app/docs/technical/api-contracts.md (section Campaigns)
    - app/docs/vision/feature-campaign-management.md

⚠️  Décisions prises / blocages :
  - virtues/rewards GET : utilise useSupabaseAdmin() car les endpoints sont publics (pas d'auth user)
  - GameSystemKey (InjectionKey) exporté depuis useGameSystem.ts pour typage strict du provide/inject
  - default.vue ne charge fetchAll() que si route commence par /gm/system (évite charge inutile sur autres pages MJ)
  - confirm() → UModal : chaque page gère son propre état de confirmation (pas de composant partagé — à factoriser en Phase 4+)
  - system/index.vue : migrate vers inject(GameSystemKey) pour partager l'instance du layout
  - virtues/[id].patch.ts et [id].delete.ts utilisent un flag is_cultural (body pour PATCH, query param pour DELETE) pour cibler cultural_virtues vs virtues
  - virtues/index.post.ts : si culture_id fourni dans le body → insère dans cultural_virtues, sinon dans virtues
  - useGameSystem : expose readonly() sur toutes les refs (immutabilité depuis l'extérieur)
  - Phase 0 complète ✅ — Phase 1 complète ✅
```

---

## Comment utiliser ce fichier entre les sessions

### Début de session
1. Lire uniquement ce bloc "RÉSUMÉ DE SESSION COURANTE"
2. Charger dans le contexte Claude **uniquement** les fichiers listés dans "Prochaine étape"
3. Commencer à coder — ne pas charger tout le projet

### Fin de session
1. Cocher les items terminés (remplacer `[ ]` par `[x]`)
2. Mettre à jour le bloc RÉSUMÉ ci-dessus
3. Indiquer la prochaine étape avec le nom de fichier exact
4. Fermer la session Claude

### Taille de contexte recommandée par session
- **Session de fondation (Phase 0)** : `types.md` + fichier à créer
- **Session d'endpoint** : `api-contracts.md` section concernée + fichier à créer
- **Session de composable** : `routes.md` + `types.md` + composable à créer
- **Session de page** : `feature-xxx.md` concernée + `routes.md` section + composants à créer
- Ne jamais charger plus de 3-4 fichiers de référence par session

---

## Dépendances entre phases

```
Phase 0 (Foundation)
  └── Phase 1 (Game System)
        └── Phase 2 (Campaigns)
              ├── Phase 3a (Characters)
              │     └── Phase 4 (Session Core)
              │           ├── Phase 5a (Display TV)
              │           └── Phase 5b (Player View)
              ├── Phase 3b (Combatants)
              │     └── Phase 4
              └── Phase 3c (Armory + Media)
                    └── Phase 6 (Advanced: NFC, Loot, Journey)
```

**Règle** : ne jamais commencer une phase si la phase parente n'est pas ✅ complète.

---

## Phase 0 — Foundation

> Durée estimée : 1 session
> **Bloquant pour tout le reste.** Ne rien implémenter d'autre avant que Phase 0 soit complète.
> Le code legacy a été supprimé — tout est à écrire from scratch depuis les docs.

### 0.1 — Types

- [x] **Créer `app/types/rpg.ts`** depuis `app/docs/technical/types.md` (intégralité du fichier)
  - Transcrire tous les enums, interfaces, types utilitaires tels quels
  - Référence unique : `app/docs/technical/types.md`

### 0.2 — Schéma DB

- [x] **Vérifier / compléter `app/supabase/migrations/001_initial_schema.sql`**
  - Toutes les tables de `schema.md` présentes
  - Enums PostgreSQL corrects (SceneType, EntityType, DisplayMode…)
  - RLS policies en place
  - Indexes définis
  - Référence : `app/docs/technical/schema.md`

### 0.3 — Server utils

- [x] **Créer `app/server/utils/supabaseAdmin.ts`** — client service_role singleton Nitro
- [x] **Créer `app/server/utils/validateParticipant.ts`** — valide `participant_id + session_id`
- [x] **Créer `app/server/utils/generateJoinCode.ts`** — 6 chars via `crypto.randomInt`

### 0.4 — Middlewares

- [x] **Créer `app/middleware/gm.ts`** — redirige vers `/login` si MJ non auth
- [x] **Créer `app/middleware/player-session.ts`** — vérifie localStorage, `client` only

### 0.5 — Layouts

- [x] **Créer `app/layouts/default.vue`** — back-office MJ (nav + slot)
- [x] **Créer `app/layouts/fullscreen.vue`** — TV + fiche perso plein écran (slot seul)
- [x] **Créer `app/layouts/minimal.vue`** — player join/scene (pas de nav)

### 0.6 — app.vue + utilitaires + config

- [x] **Créer `app/app.vue`** — racine Nuxt (`<NuxtLayout><NuxtPage />`)
- [x] **Créer `app/utils/entityDisplay.ts`** — constantes `ENTITY_TOKEN_COLOR` + `ENTITY_TOKEN_ICON` typées par `EntityType` (auto-importé)
- [x] **Créer `app/utils/storage.ts`** — clés localStorage centralisées (`STORAGE_KEYS` const)
- [x] **Vérifier `app/nuxt.config.ts`** — modules requis présents (`@nuxt/ui`, `@nuxtjs/supabase`)

---

## Phase 1 — Game System

> **Débloque** : création de personnages, armurerie, vertus/récompenses.
> Référence : `app/docs/vision/feature-game-system.md`

### 1.1 — Server endpoints Game System

- [x] `app/server/api/game-system/cultures/index.get.ts` — liste toutes les cultures
- [x] `app/server/api/game-system/cultures/index.post.ts` — créer une culture (MJ)
- [x] `app/server/api/game-system/cultures/[id].get.ts` — détail culture
- [x] `app/server/api/game-system/cultures/[id].patch.ts` — modifier culture
- [x] `app/server/api/game-system/cultures/[id].delete.ts` — supprimer culture
- [x] `app/server/api/game-system/virtues/index.get.ts` — liste vertus (filtre par culture possible)
- [x] `app/server/api/game-system/virtues/index.post.ts`
- [x] `app/server/api/game-system/virtues/[id].patch.ts`
- [x] `app/server/api/game-system/virtues/[id].delete.ts`
- [x] `app/server/api/game-system/rewards/index.get.ts`
- [x] `app/server/api/game-system/rewards/index.post.ts`
- [x] `app/server/api/game-system/rewards/[id].patch.ts`
- [x] `app/server/api/game-system/rewards/[id].delete.ts`

### 1.2 — Composable Game System

- [x] Créer `app/composables/useGameSystem.ts`
  - `cultures`, `virtues`, `rewards` — listes en mémoire
  - Fetch une seule fois (pas de realtime — données quasi-statiques)
  - Exposer `getCultureById(id)`, `getVirtuesByCulture(cultureId)`
  - Référence : `app/docs/technical/state-map.md` section Game System

### 1.3 — Pages Game System

- [x] Créer `app/pages/gm/system/index.vue` — hub game system (liste cultures)
- [x] Créer `app/pages/gm/system/cultures/[id].vue` — édition culture + vertus culturelles
- [x] Créer `app/pages/gm/system/virtues/index.vue` — vertus ordinaires (liste globale)
- [x] Créer `app/pages/gm/system/rewards/index.vue` — récompenses (liste globale)

---

## Phase 2 — Campaigns

> **Débloque** : tout le reste (personnages, sessions, armurerie...).
> Référence : `app/docs/vision/feature-campaign-management.md`

### 2.1 — Server endpoints Campaigns

- [ ] `app/server/api/campaigns/index.get.ts` — liste campagnes du MJ
- [ ] `app/server/api/campaigns/index.post.ts` — créer campagne
- [ ] `app/server/api/campaigns/[id].get.ts` — détail + compteurs
- [ ] `app/server/api/campaigns/[id].patch.ts` — modifier (nom, date in-game)
- [ ] `app/server/api/campaigns/[id].delete.ts` — supprimer

### 2.2 — Composable Campaign

- [ ] Créer `app/composables/useGMCampaign.ts`
  - `campaign`, `counters` (nb persos, sessions, ennemis...)
  - Méthodes CRUD délégant aux endpoints

### 2.3 — Pages Campaign

- [ ] Auditer/réécrire `app/pages/gm/index.vue` — dashboard (liste campagnes)
- [ ] Auditer/réécrire `app/pages/gm/campaigns/[id]/index.vue` — hub campagne (7 cards)

---

## Phase 3a — Characters (Personnages joueurs)

> **Débloque** : session panel (entités PJ), player view.
> Référence : `app/docs/vision/feature-characters.md`

### 3a.1 — Server endpoints Characters

- [ ] `app/server/api/campaigns/[id]/characters/index.get.ts` — liste personnages
- [ ] `app/server/api/campaigns/[id]/characters/index.post.ts` — créer personnage
- [ ] `app/server/api/characters/[id].get.ts` — fiche complète
- [ ] `app/server/api/characters/[id].patch.ts` — modifier (champs partiels)
- [ ] `app/server/api/characters/[id].delete.ts` — supprimer
- [ ] `app/server/api/characters/[id]/endurance.patch.ts` — modifier endurance (session live)
- [ ] `app/server/api/characters/[id]/hope.patch.ts` — modifier espoir (session live)
- [ ] `app/server/api/characters/[id]/nfc-export.post.ts` — exporter vers NFC

### 3a.2 — Composables Characters

- [ ] Auditer/réécrire `app/composables/useCharacter.ts` depuis `types.md` + `feature-characters.md`
- [ ] Créer `app/composables/useCharacters.ts` — liste pour une campagne

### 3a.3 — Composants CharacterSheet

- [ ] Créer `app/components/characters/CharacterSheet.vue` — fiche complète (7 onglets)
- [ ] Créer `app/components/characters/CharacterAttributesEditor.vue`
- [ ] Créer `app/components/characters/CharacterSkillsEditor.vue`
- [ ] Créer `app/components/characters/CharacterEquipmentEditor.vue`
- [ ] Créer `app/components/characters/CharacterInventoryEditor.vue`
- [ ] Créer `app/components/characters/CharacterWisdomEditor.vue` — vertus
- [ ] Créer `app/components/characters/CharacterValorEditor.vue` — récompenses

### 3a.4 — Pages Characters

- [ ] Créer `app/pages/gm/campaigns/[id]/characters/index.vue` — liste persos
- [ ] Auditer/réécrire `app/pages/gm/campaigns/[id]/characters/[charId].vue`

---

## Phase 3b — Combatants (Ennemis & PNJ)

> **Débloque** : session panel (entités ennemis), loot sur ennemis.
> Référence : `app/docs/vision/feature-enemies.md`

### 3b.1 — Server endpoints Combatants

- [ ] `app/server/api/campaigns/[id]/combatants/index.get.ts` — liste ennemis/PNJ
- [ ] `app/server/api/campaigns/[id]/combatants/index.post.ts` — créer
- [ ] `app/server/api/combatants/[id].get.ts` — fiche complète
- [ ] `app/server/api/combatants/[id].patch.ts` — modifier
- [ ] `app/server/api/combatants/[id].delete.ts` — supprimer
- [ ] `app/server/api/combatants/[id]/wounds.patch.ts` — gérer blessures (session live)

### 3b.2 — Composables Combatants

- [ ] Créer `app/composables/useCombatant.ts` — fiche unique
- [ ] Créer `app/composables/useCombatants.ts` — liste campagne

### 3b.3 — Composants Combatants

- [ ] Créer `app/components/combatants/CombatantSheet.vue` — fiche ennemi complète
- [ ] Créer `app/components/combatants/CombatantCard.vue` — carte résumé (liste)
- [ ] Créer `app/components/combatants/FearfulPresenceDisplay.vue` — capacité redoutable

### 3b.4 — Pages Combatants

- [ ] Créer `app/pages/gm/campaigns/[id]/combatants/index.vue` — liste
- [ ] Créer `app/pages/gm/campaigns/[id]/combatants/[combatantId].vue` — fiche

---

## Phase 3c — Armory + Media Library

> **Débloque** : équipement des personnages, NFC images.
> Références : `feature-game-system.md`, `feature-media-library.md`

### 3c.1 — Armory

- [ ] `app/server/api/campaigns/[id]/armory/weapons/index.get.ts`
- [ ] `app/server/api/campaigns/[id]/armory/weapons/index.post.ts`
- [ ] `app/server/api/campaigns/[id]/armory/weapons/[id].patch.ts`
- [ ] `app/server/api/campaigns/[id]/armory/armors/index.get.ts`
- [ ] `app/server/api/campaigns/[id]/armory/armors/index.post.ts`
- [ ] `app/server/api/campaigns/[id]/armory/armors/[id].patch.ts`
- [ ] Créer `app/composables/useArmory.ts`
- [ ] Créer `app/pages/gm/campaigns/[id]/armory/index.vue`

### 3c.2 — Media Library

- [ ] `app/server/api/campaigns/[id]/media/index.get.ts` — liste images
- [ ] `app/server/api/campaigns/[id]/media/upload.post.ts` — upload (Supabase Storage)
- [ ] `app/server/api/campaigns/[id]/media/[imageId].delete.ts` — supprimer
- [ ] Créer `app/composables/useMediaLibrary.ts`
- [ ] Créer `app/components/media/ImagePicker.vue` — composant transverse (utilisé partout)
- [ ] Créer `app/pages/gm/campaigns/[id]/media/index.vue`

---

## Phase 4 — Session Core (Panneau MJ)

> **Débloque** : display TV, player view.
> Références : `feature-session-panel.md`, `feature-live-stats-dragdrop.md`, `feature-initiative.md`

### 4.1 — Server endpoints Session

- [ ] Auditer `app/server/api/session/create.post.ts`
- [ ] Auditer `app/server/api/session/join.post.ts`
- [ ] Auditer `app/server/api/session/[code].get.ts`
- [ ] Auditer `app/server/api/session/[id]/state.get.ts`
- [ ] Auditer `app/server/api/session/[id]/characters.get.ts`
- [ ] `app/server/api/session/[id]/end.post.ts` — terminer la session
- [ ] `app/server/api/session/[id]/scenes/index.get.ts` — liste scènes
- [ ] `app/server/api/session/[id]/scenes/index.post.ts` — créer scène
- [ ] `app/server/api/session/[id]/scenes/[sceneId]/activate.post.ts` — activer scène
- [ ] `app/server/api/session/[id]/scenes/[sceneId]/entities/index.get.ts`
- [ ] `app/server/api/session/[id]/scenes/[sceneId]/entities/index.post.ts` — ajouter entité
- [ ] `app/server/api/session/[id]/scenes/[sceneId]/entities/[entityId].patch.ts` — position/état
- [ ] `app/server/api/session/[id]/scenes/[sceneId]/entities/[entityId].delete.ts`
- [ ] `app/server/api/session/[id]/initiative/index.get.ts`
- [ ] `app/server/api/session/[id]/initiative/order.patch.ts` — réordonner
- [ ] `app/server/api/session/[id]/initiative/next.post.ts` — tour suivant
- [ ] `app/server/api/session/[id]/initiative/end.post.ts` — fin combat
- [ ] `app/server/api/session/[id]/announce.post.ts` — message MJ → joueurs

### 4.2 — Composables Session

- [ ] Auditer/réécrire `app/composables/useGMSession.ts`
- [ ] Auditer/réécrire `app/composables/useScene.ts`
- [ ] Créer `app/composables/useInitiative.ts` — fil d'initiative + realtime

### 4.3 — Composants Session Panel

- [ ] Créer `app/components/session/SceneSelector.vue` — liste scènes + création
- [ ] Créer `app/components/session/EntityList.vue` — liste entités de la scène
- [ ] Créer `app/components/session/EntityTokenGM.vue` — token draggable MJ
- [ ] Créer `app/components/session/StatsPopover.vue` — endurance/espoir inline
- [ ] Créer `app/components/session/InitiativeTrack.vue` — fil d'initiative
- [ ] Créer `app/components/session/AnnouncementPanel.vue` — chat annonces MJ
- [ ] Créer `app/components/session/ParticipantList.vue` — joueurs connectés

### 4.4 — Page Session Panel MJ

- [ ] Auditer/réécrire `app/pages/gm/campaigns/[id]/session/[sessionId].vue`
  - Layout 3 colonnes (scènes | tokens | entités)
  - Intègre tous les composants 4.3

---

## Phase 5a — Display TV

> Référence : `app/docs/vision/feature-display-tv.md`

### 5a.1 — Server endpoint Display

- [ ] Auditer `app/server/api/display/[id]/state.get.ts`
- [ ] `app/server/api/display/[id]/mode.patch.ts` — changer le mode TV depuis MJ

### 5a.2 — Composable Display

- [ ] Auditer/réécrire `app/composables/useDisplaySession.ts`

### 5a.3 — Composants TV

- [ ] Créer `app/components/display/WaitingScreen.vue` — mode waiting
- [ ] Créer `app/components/display/BattlemapView.vue` — mode battlemap
- [ ] Créer `app/components/display/InitiativeBanner.vue` — bandeau style BG3
- [ ] Créer `app/components/display/TravelView.vue` — mode travel (hexagones)
- [ ] Créer `app/components/display/NFCOverlay.vue` — animation NFC
- [ ] Créer `app/components/display/EndScreen.vue` — fin de session

### 5a.4 — Page Display TV

- [ ] Auditer/réécrire `app/pages/display/[sessionId].vue`

---

## Phase 5b — Player View (Vue joueur téléphone)

> Référence : `app/docs/vision/feature-player-view.md`

### 5b.1 — Server endpoints Player

- [ ] Auditer `app/server/api/session/[id]/state.get.ts` (déjà fait Phase 4)
- [ ] `app/server/api/player/[participantId]/character.patch.ts` — le joueur choisit son perso

### 5b.2 — Composable Player

- [ ] Auditer/réécrire `app/composables/usePlayerSession.ts`

### 5b.3 — Composants Player

- [ ] Créer `app/components/player/CharacterSelectModal.vue` — choix du perso au join
- [ ] Créer `app/components/player/PlayerCharacterSheet.vue` — fiche 7 onglets (lecture seule)
- [ ] Créer `app/components/player/AnnouncementBanner.vue` — annonces MJ reçues
- [ ] Créer `app/components/player/SceneView.vue` — scène active (vue simplifiée)

### 5b.4 — Pages Player

- [ ] Auditer/réécrire `app/pages/player/join.vue`
- [ ] Auditer/réécrire `app/pages/player/scene.vue`
- [ ] Créer `app/pages/player/sheet.vue` — fiche perso fullscreen

---

## Phase 6 — Features Avancées

> Ces features peuvent être développées en parallèle une fois Phase 4 terminée.

### 6a — NFC System

> Référence : `feature-nfc.md`, `feature-nfc-encoding.md`

- [ ] `app/server/api/nfc/encode.post.ts` — encodage CBOR
- [ ] `app/server/api/nfc/decode.post.ts` — décodage
- [ ] `app/server/api/nfc/trigger.post.ts` — déclenchement overlay TV
- [ ] Créer `app/pages/gm/nfc/index.vue` — liste des puces
- [ ] Créer `app/pages/gm/nfc/[id].vue` — édition puce + QR preview

### 6b — Loot System

> Référence : `feature-loot.md`

- [ ] `app/server/api/campaigns/[id]/loot/catalog/index.get.ts`
- [ ] `app/server/api/campaigns/[id]/loot/catalog/index.post.ts`
- [ ] `app/server/api/campaigns/[id]/loot/tables/index.get.ts`
- [ ] `app/server/api/campaigns/[id]/loot/tables/index.post.ts`
- [ ] `app/server/api/campaigns/[id]/loot/tables/[tableId]/roll.post.ts` — tirage
- [ ] `app/server/api/session/[id]/loot/distribute.post.ts` — distribution aux joueurs
- [ ] Créer `app/composables/useLoot.ts`
- [ ] Créer `app/pages/gm/campaigns/[id]/loot/index.vue`

### 6c — Journey Maps

> Référence : `feature-journey.md`

- [ ] `app/server/api/campaigns/[id]/journeys/index.get.ts`
- [ ] `app/server/api/campaigns/[id]/journeys/index.post.ts`
- [ ] `app/server/api/session/[id]/journey/progress.patch.ts` — avancer sur la carte
- [ ] Créer `app/composables/useJourney.ts`
- [ ] Créer `app/components/journey/HexGrid.vue` — grille hexagonale
- [ ] Créer `app/pages/gm/campaigns/[id]/map/index.vue`

---

## Phase 7 — Features Phase 4 (Basse priorité)

> Ne démarrer qu'après Phase 6 et une fois `SPECS-RESTANTES.md` marquées complètes.

- [ ] **`feature-session-history.md` à finaliser d'abord** (spec incomplète)
- [ ] `feature-shortcuts.md` à finaliser
- [ ] Implémenter historique de session (`/gm/campaigns/[id]/sessions/[sessionId]`)
- [ ] Implémenter raccourcis clavier (Tour suivant, etc.)
- [ ] Mode préparation de session (F1)
- [ ] Statuts visuels sur tokens (F2)

---

## Récapitulatif de progression

| Phase | Description | Items | Terminés |
|---|---|---|---|
| 0 | Foundation | 9 | 9 |
| 1 | Game System | 20 | 20 |
| 2 | Campaigns | 7 | 0 |
| 3a | Characters | 13 | 0 |
| 3b | Combatants | 11 | 0 |
| 3c | Armory + Media | 12 | 0 |
| 4 | Session Core | 24 | 0 |
| 5a | Display TV | 8 | 0 |
| 5b | Player View | 9 | 0 |
| 6a | NFC | 5 | 0 |
| 6b | Loot | 8 | 0 |
| 6c | Journey | 7 | 0 |
| 7 | Phase 4 features | 6 | 0 |
| **Total** | | **139** | **20** |
