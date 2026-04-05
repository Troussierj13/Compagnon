# Contrats d'API — Server Endpoints

> Tous les server endpoints sont dans `app/server/api/`.
> Référence technique : `app/docs/architecture.md`, `app/docs/security.md`.
>
> **Conventions :**
> - Endpoints MJ : authentification Supabase Auth (`serverSupabaseClient`) — `auth.uid()` disponible
> - Endpoints Joueur : `useSupabaseAdmin()` + `validateParticipant(participant_id, session_id)`
> - Endpoints TV : `useSupabaseAdmin()`, UUID de session = secret
> - Jamais de `select('*')` dans les endpoints publics
> - Toujours valider et normaliser les inputs côté serveur

---

## Sessions

### `GET /api/session/[code]`
Preview d'une session par son `join_code`. Utilisé sur la page join pour afficher le nom de la campagne.

**Auth** : Aucune
**Path param** : `code` — join_code (6 chars)

**Response 200 :**
```typescript
{ id: string, campaign: { name: string }, status: 'waiting' | 'active' | 'ended' }
```

**Errors :** `404` session non trouvée

---

### `POST /api/session/join`
Un joueur anonyme rejoint une session avec un join_code.

**Auth** : Aucune
**Body :**
```typescript
{ join_code: string, player_name: string }
```

**Response 200 :**
```typescript
{ session_id: string, participant_id: string }
```
→ Le client persiste `session_id` et `participant_id` dans localStorage.

**Errors :** `404` code invalide, `400` session terminée

---

### `POST /api/session/create`
Le MJ crée une nouvelle session.

**Auth** : MJ (Supabase Auth)
**Body :**
```typescript
{ campaign_id: string, name: string, days_elapsed?: number }
```
- `days_elapsed` : si fourni, avance `campaigns.current_date` de ce nombre de jours avant de créer la session

**Response 201 :**
```typescript
{ id: string, join_code: string }
```

**Errors :** `401` non authentifié, `403` campagne n'appartient pas au MJ

---

### `GET /api/session/[id]/state`
État complet de la session pour un joueur.

**Auth** : Joueur (valide `participant_id`)
**Query params** : `participant_id` (UUID)

**Response 200 :**
```typescript
{
  session: {
    id: string
    status: string
    display_mode: string
    combat_active: boolean
    combat_round: number
  }
  campaign: {
    id: string
    name: string
    current_date: { year: number, month: number, day: number } | null
    current_haven: { name: string, hope_bonus: number } | null
    travel_rules: string | null
  }
  active_scene: {
    id: string
    name: string
    scene_type: 'normal' | 'community' | 'journey'
    battlemap_url: string | null
    wallpaper_url: string | null
  } | null
  entities: Array<{            // uniquement visible_to_players = true
    id: string
    type: string
    name: string
    position: { x: number, y: number }
    // Pour les entités 'character': portrait_url, character_id
    // Pour les ennemis/PNJ: artwork_url (jamais endurance_current ni hatred_current)
    in_combat: boolean
    initiative_order: number | null
    is_current_turn: boolean
  }>
  participant: {
    id: string
    character_id: string | null
  }
}
```

**Errors :** `400` participant_id manquant, `403` participant invalide

---

### `GET /api/session/[id]/characters`
Liste des personnages de la campagne de la session (pour le joueur).

**Auth** : Joueur (valide `participant_id`)
**Query params** : `participant_id`

**Response 200 :**
```typescript
Array<{ id: string, name: string, player_name: string, portrait_url: string | null }>
```

**Errors :** `403` participant invalide

---

### `GET /api/session/[id]/characters/available`
Personnages non encore assignés dans cette session. Étape 2 du join.

**Auth** : Joueur (valide `participant_id`)
**Query params** : `participant_id`

**Response 200 :**
```typescript
Array<{
  id: string
  name: string
  player_name: string
  portrait_url: string | null
  culture: string | null        // Nom de la culture
  vocation: string | null       // depuis characters.data.vocation
}>
```

---

### `PATCH /api/session/[id]/participants/[pid]/character`
Assigne un personnage à un participant (joueur au join ou réassignation MJ).

**Auth** : Joueur (valide participant_id) OU MJ (auth)
**Body :**
```typescript
{ character_id: string | null }  // null = mode spectateur
```

**Response 200 :** `{ ok: true }`

**Errors :** `403`, `409` personnage déjà assigné à un autre participant actif

---

## Affichage TV

### `GET /api/display/[sessionId]/state`
État complet de la session pour l'affichage TV.

**Auth** : Aucune (UUID de session = secret)

**Response 200 :**
```typescript
{
  session: {
    id: string
    display_mode: 'waiting' | 'battlemap' | 'travel'
    combat_active: boolean
    combat_round: number
  }
  campaign: {
    name: string
    current_date: { year: number, month: number, day: number } | null
    wallpaper_url: string | null
    current_haven: { name: string, hope_bonus: number } | null
  }
  active_scene: {
    id: string
    name: string
    scene_type: 'normal' | 'community' | 'journey'
    battlemap_url: string | null
    wallpaper_url: string | null
  } | null
  entities: Array<{           // uniquement visible_to_players = true
    id: string
    type: string
    name: string
    position: { x: number, y: number }
    portrait_url?: string      // PJ
    artwork_url?: string       // Ennemi/PNJ
    character_id?: string      // Pour afficher endurance/espoir des PJ
    endurance_display?: { current: number, max: number }  // PJ uniquement
    in_combat: boolean
    initiative_order: number | null
    is_current_turn: boolean
  }>
  overlays: Array<{
    id: string
    type: string
    reference_id: string | null
    content: object | null
    is_featured: boolean
    position: number
  }>
  active_journey: {           // null si pas de voyage actif
    journey_id: string
    current_hex: { q: number, r: number }
    actual_path: Array<{ q: number, r: number }>
    planned_path: Array<{ q: number, r: number }>
    current_date: { year: number, month: number, day: number }
    estimated_end_date: { year: number, month: number, day: number }
    map_id: string
  } | null
  past_journeys_trails: Array<{   // Tous les voyages terminés (carte cumulative)
    actual_path: Array<{ q: number, r: number }>
  }>
}
```

---

## Personnages

### `GET /api/characters/[id]`
Fiche complète d'un personnage.

**Auth** : MJ (auth) OU Joueur (participant valide + character_id = id)

**Response 200 :**
```typescript
{
  id: string
  campaign_id: string
  culture_id: string | null
  name: string
  player_name: string
  portrait_url: string | null
  data: TORCharacterData      // Voir types.md
  culture: {                  // Joint depuis cultures si culture_id non null
    name: string
    endurance_bonus: number
    hope_bonus: number
    parade_bonus: number
  } | null
}
```

---

### `PATCH /api/characters/[id]`
Mise à jour partielle d'une fiche personnage.

**Auth** : MJ (auth) OU Joueur (participant valide + son personnage uniquement)

**Body (tous optionnels) :**
```typescript
{
  // Joueur peut modifier ces champs en session normale:
  current_endurance?: number
  current_hope?: number
  fatigue?: number
  shadows?: number
  sequels?: number
  hurt?: boolean
  injury?: { value: number, unit: 'hours' | 'days' } | null
  treasure?: number
  // MJ peut modifier tous les champs (via fiche complète back-office)
  name?: string
  player_name?: string
  portrait_url?: string
  culture_id?: string
  data?: Partial<TORCharacterData>
}
```

**Actions serveur :** Merge dans `characters.data` via `jsonb_set` ciblé (pas de réécriture complète).

**Response 200 :** `{ ok: true }`

---

### `POST /api/characters/[id]/level-up`
Dépense des points de progression (mode level-up, scène de type `community`).

**Auth** : Joueur (participant valide + son personnage) OU MJ (auth)

**Body :**
```typescript
{
  type: 'skill' | 'virtue' | 'reward'
  // Pour type='skill':
  skill_id?: string           // Ex: "hunting", "axes"
  target_rank?: number        // Rang cible (rank actuel + 1)
  // Pour type='virtue':
  virtue_id?: string
  chosen_variant?: number     // Index de la variante choisie
  is_cultural?: boolean
  // Pour type='reward':
  reward_id?: string
  apply_to?: string           // Ex: "weapon_0", "armor"
}
```

**Validations serveur :**
- Scène active de type `community`
- Points suffisants (calcul du coût selon barème)
- Rang Sagesse 1 → vertu ordinaire uniquement
- Points d'aventure pour vertus/récompenses, points de progression pour compétences

**Response 200 :** `{ updated_data: TORCharacterData, points_remaining: { adventure: number, progression: number } }`

**Errors :** `400` points insuffisants, `403` pas en mode community, `422` règle violée

---

### `POST /api/characters/[id]/distribute-points`
MJ distribue des points à un personnage.

**Auth** : MJ (auth)

**Body :**
```typescript
{ adventure_points?: number, progression_points?: number, community_points?: number }
```

**Response 200 :** `{ ok: true }`

---

## Scènes

### `GET /api/session/[id]/scenes`
Liste des scènes d'une session. MJ uniquement.

**Auth** : MJ (auth)

**Response 200 :**
```typescript
Array<{
  id: string
  name: string
  description: string | null
  scene_type: 'normal' | 'community' | 'journey'
  battlemap_url: string | null
  wallpaper_url: string | null
  sort_order: number
  created_at: string
}>
```

---

### `POST /api/session/[id]/scenes`
Crée une nouvelle scène dans une session. MJ uniquement.

**Auth** : MJ (auth)

**Body :**
```typescript
{
  name: string
  description?: string
  scene_type?: 'normal' | 'community' | 'journey'   // default: 'normal'
  battlemap_url?: string
  wallpaper_url?: string
  sort_order?: number
}
```

**Response 201 :** `{ id: string }`

---

### `PATCH /api/session/[id]/scenes/[sceneId]`
Modifie une scène. MJ uniquement.

**Auth** : MJ (auth)

**Body (tous optionnels) :**
```typescript
{
  name?: string
  description?: string
  scene_type?: 'normal' | 'community' | 'journey'
  battlemap_url?: string | null
  wallpaper_url?: string | null
  sort_order?: number
}
```

**Response 200 :** `{ ok: true }`

---

### `DELETE /api/session/[id]/scenes/[sceneId]`
Supprime une scène (et toutes ses entités). MJ uniquement.

**Auth** : MJ (auth)

**Validations :** Interdit si la scène est la scène active de la session.

**Response 200 :** `{ ok: true }`

**Errors :** `409` scène active — désactiver d'abord via `PATCH /active-scene`

---

### `PATCH /api/session/[id]/active-scene`
Change la scène active d'une session. MJ uniquement.

**Auth** : MJ (auth)

**Body :**
```typescript
{ scene_id: string | null }   // null = aucune scène active
```

**Actions serveur :**
1. `sessions.active_scene_id = scene_id`
2. Si `combat_active = true` → terminer le combat automatiquement avant de changer de scène

**Response 200 :** `{ ok: true }`

---

## Entités de scène (session live)

### `POST /api/session/[id]/entities`
Spawn une entité sur la scène active. MJ uniquement.

**Auth** : MJ (auth)

**Body :**
```typescript
{
  type: 'combatant' | 'character' | 'item' | 'zone'
  name: string
  combatant_id?: string      // Pour type='combatant' — initialise endurance_current/hatred_current
  character_id?: string      // Pour type='character'
  item_id?: string           // Pour type='item'
  position?: { x: number, y: number }   // % battlemap (défaut: centre)
  visible_to_players?: boolean           // défaut: false pour combatants, true pour characters
}
```

**Actions serveur :**
1. Récupère la scène active depuis `sessions.active_scene_id`
2. Pour `type='combatant'` : initialise `endurance_current` depuis `combatants.endurance`, `hatred_current` depuis `combatants.hatred_value`
3. Crée la `scene_entity`

**Response 201 :** `{ id: string }`

**Errors :** `409` aucune scène active

---

### `DELETE /api/session/[id]/entity/[entityId]`
Supprime une entité de scène. MJ uniquement.

**Auth** : MJ (auth)

**Response 200 :** `{ ok: true }`

---

### `PATCH /api/session/[id]/entity/[entityId]/visibility`
Révéler ou masquer une entité. MJ uniquement.

**Auth** : MJ (auth)

**Body :** `{ visible_to_players: boolean }`

**Response 200 :** `{ ok: true }`

---

### `PATCH /api/session/[id]/entity/[entityId]/stats`
Mettre à jour les stats de combat d'un ennemi/PNJ. MJ uniquement.

**Auth** : MJ (auth)

**Body (tous optionnels — seuls les champs présents sont mis à jour) :**
```typescript
{
  endurance_current?: number    // >= 0
  wounds_received?: number      // >= 0
  hatred_current?: number       // >= 0
  is_defeated?: boolean
}
```

**Validations :** L'entité doit avoir un `combatant_id` (erreur 400 pour items/zones).

**Response 200 :** `{ ok: true }`

---

### `PATCH /api/session/[id]/character/[characterId]/stats`
Mettre à jour les stats rapides d'un PJ depuis le panneau MJ. MJ uniquement.

**Auth** : MJ (auth)

**Body :**
```typescript
{
  current_endurance?: number
  current_hope?: number
  fatigue?: number
  shadows?: number
  hurt?: boolean
  injury?: { value: number, unit: 'hours' | 'days' } | null
}
```

**Response 200 :** `{ ok: true }`

---

## Combat (initiative)

### `POST /api/session/[id]/combat/start`
Démarre un combat. MJ uniquement.

**Auth** : MJ (auth)

**Body :**
```typescript
{ entity_order: string[] }  // UUIDs des scene_entities dans l'ordre d'initiative
```

**Actions serveur :**
1. `sessions.combat_active = true`, `combat_round = 1`
2. Chaque entité : `in_combat = true`, `initiative_order = index + 1`
3. Première entité : `is_current_turn = true`

**Response 200 :** `{ ok: true }`

---

### `POST /api/session/[id]/combat/next`
Passe au tour suivant. MJ uniquement.

**Auth** : MJ (auth)

**Actions serveur :**
1. Trouve l'entité `is_current_turn = true`
2. Cherche l'entité suivante `in_combat = true` avec `endurance_current > 0` et `is_defeated = false`
3. Si fin de cycle → `combat_round += 1`, recommence depuis le début
4. Met à jour `is_current_turn` (old = false, new = true)

**Response 200 :** `{ current_entity_id: string, combat_round: number }`

---

### `POST /api/session/[id]/combat/reorder`
Réordonne le fil d'initiative en cours. MJ uniquement.

**Auth** : MJ (auth)

**Body :** `{ entity_order: string[] }`

**Actions serveur :** Réassigne `initiative_order` pour chaque entité. Ne modifie pas `is_current_turn`.

**Response 200 :** `{ ok: true }`

---

### `POST /api/session/[id]/combat/end`
Termine le combat. MJ uniquement.

**Auth** : MJ (auth)

**Actions serveur :**
1. `sessions.combat_active = false`, `combat_round = 0`
2. Toutes les entités de la scène active : `in_combat = false`, `initiative_order = null`, `is_current_turn = false`

**Response 200 :** `{ ok: true }`

---

### `POST /api/session/[id]/combat/add-entity`
Ajoute une entité au combat en cours. MJ uniquement.

**Auth** : MJ (auth)

**Body :**
```typescript
{ entity_id: string, insert_after?: string }  // insert_after = UUID d'une entité existante
```

**Response 200 :** `{ ok: true }`

---

## Overlays TV

### `POST /api/session/[id]/overlays`
Crée un overlay TV. MJ uniquement.

**Auth** : MJ (auth)

**Body :**
```typescript
{
  type: 'character' | 'combatant' | 'item' | 'text' | 'image'
  reference_id?: string      // FK selon le type (characters.id, combatants.id, campaign_items.id)
  content?: { text?: string, url?: string }   // Pour types 'text' et 'image'
  is_featured?: boolean      // Mettre en avant (défaut: false)
  position?: number          // Ordre dans la pile (défaut: 0 = premier plan)
}
```

**Response 201 :** `{ id: string }`

---

### `PATCH /api/session/[id]/overlays/[overlayId]`
Modifie un overlay (featured, position, content). MJ uniquement.

**Auth** : MJ (auth)

**Body (tous optionnels) :**
```typescript
{
  is_featured?: boolean
  position?: number
  content?: { text?: string, url?: string } | null
}
```

**Response 200 :** `{ ok: true }`

---

### `DELETE /api/session/[id]/overlays/[overlayId]`
Supprime un overlay TV. MJ uniquement.

**Auth** : MJ (auth)

**Response 200 :** `{ ok: true }`

---

## Annonces

### `POST /api/session/[id]/announcements`
Envoie une annonce (visible sur TV et/ou téléphones). MJ uniquement.

**Auth** : MJ (auth)

**Body :**
```typescript
{ message: string, target: 'players' | 'tv' | 'all' }
```

**Response 201 :** `{ id: string }`

---

## NFC

### `POST /api/nfc/trigger`
Déclenché par le Pico quand une figurine est posée.

**Auth** : Token statique `NFC_SECRET` dans `Authorization: Bearer <token>`

**Body :**
```typescript
{ data: string }  // Payload base64 (version byte + CBOR map)
```

**Actions serveur :**
1. Valider le token secret
2. Décoder le base64 → Buffer → version byte + CBOR map
3. Lire `_t` → lookup `nfc_entity_types` pour récupérer l'action
4. Exécuter l'action sur la scène active de la session courante
5. Répondre avec les infos de l'entité créée

**Response 200 :**
```typescript
{
  ok: true
  action: string
  entity_id?: string      // Pour action spawn_entity
  scene_id: string
}
```

**Errors :**
- `401` token invalide
- `400` byte de version inconnu (puce illisible)
- `400` décodage CBOR échoué
- `422` type `_t` inconnu en BDD
- `422` champs requis manquants (puce incomplète)
- `409` aucune session active

---

## Voyages

### `POST /api/session/[id]/journey/start`
Démarre un voyage. MJ uniquement.

**Auth** : MJ (auth)

**Body :**
```typescript
{
  map_id: string
  start_hex: { q: number, r: number }
  destination_hex: { q: number, r: number }
  planned_path: Array<{ q: number, r: number }>
  roles: {
    guide?: string           // character_id
    scout?: string[]         // character_ids
    lookout?: string         // character_id
    hunter?: string          // character_id
  }
}
```

**Actions serveur :**
1. Calcule `total_days` depuis `planned_path` × `hex_tiles.days_cost`
2. Crée l'entrée `journeys`
3. Génère les `journey_stages` (une par tranche de 7 jours)
4. Met à jour `scenes.scene_type = 'journey'` sur la scène active

**Response 201 :** `{ journey_id: string, stages: JourneyStage[], estimated_end_date: InGameDate }`

---

### `POST /api/session/[id]/journey/[journeyId]/resolve-stage`
Résout une étape avec ses jets de dés et événements. MJ uniquement.

**Auth** : MJ (auth)

**Body :**
```typescript
{
  stage_id: string
  rolls: Array<{
    character_id: string
    role: 'guide' | 'scout' | 'lookout' | 'hunter'
    skill_key: string
    total: number
    feat_die: number          // 1–12
    eye_of_sauron: boolean
  }>
  events?: Array<{
    event_type: 'ill_health' | 'mishap' | 'foul_weather' | 'shadow_fell' | 'encounter' | 'loss_of_way'
    affected_scope: 'individual' | 'full_party'
    affected_character_id?: string
    consequence_type: 'fatigue' | 'shadow' | 'endurance' | 'days_added' | 'rp_only'
    consequence_value: number
    notes?: string
  }>
}
```

**Actions serveur :**
1. Sauvegarde les jets dans `journey_stages.rolls`
2. Crée les `journey_events` et applique les conséquences sur les fiches (JSONB update ciblé)
3. Si `loss_of_way` : recalcule `journeys.total_days`, crée de nouvelles étapes si nécessaire
4. Avance `journeys.days_elapsed` et `journeys.current_date`
5. Met à jour `journeys.current_hex`

**Response 200 :** `{ updated_journey: Journey, new_stages?: JourneyStage[] }`

---

### `POST /api/session/[id]/journey/[journeyId]/complete`
Termine le voyage. MJ uniquement.

**Auth** : MJ (auth)

**Actions serveur :**
1. `journeys.status = 'completed'`
2. Met à jour `campaigns.current_date` depuis `journeys.current_date`

**Response 200 :** `{ ok: true }`

---

### `GET /api/journey-maps`
Liste des cartes hexagonales disponibles.

**Auth** : MJ (auth)

**Response 200 :** `Array<{ id: string, name: string, grid_width: number, grid_height: number }>`

---

### `GET /api/journey-maps/[id]/tiles`
Toutes les cases d'une carte.

**Auth** : MJ (auth) OU public (utilisé par la TV)

**Response 200 :**
```typescript
{
  map: { id: string, name: string, grid_width: number, grid_height: number, hex_size: number, grid_offset_x: number, grid_offset_y: number, background_image_url: string | null }
  tiles: Array<{
    q: number, r: number
    terrain_type: string
    days_cost: number
    danger_level: string
    passable: boolean
    label: string | null
    poi_type: string | null
    poi_hidden: boolean
  }>
}
```

---

## Système de jeu

### `GET /api/game-system/cultures`
Liste de toutes les cultures.

**Auth** : MJ (auth) — appelé aussi par server endpoints joueur

**Response 200 :**
```typescript
Array<{
  id: string, name: string, description: string | null
  endurance_bonus: number, hope_bonus: number, parade_bonus: number
  starting_favored_skills: string[]
  starting_combat_skills: Record<string, number>
  cultural_virtues: Array<{ id: string, identifier: string, name: string }>
}>
```

---

### `GET /api/game-system/virtues`
Liste de toutes les vertus ordinaires (avec variantes).

**Auth** : Public (MJ + joueur via endpoint)

**Response 200 :**
```typescript
Array<{
  id: string, identifier: string, name: string, description: string
  variants: Array<{ name: string, description: string, modifiers: ModifierParam[] }>
}>
```

---

### `GET /api/game-system/rewards`
Liste de toutes les récompenses.

**Auth** : Public

**Response 200 :**
```typescript
Array<{
  id: string, identifier: string, name: string, description: string
  valid_targets: string[]
  modifiers: ModifierParam[]
}>
```

---

## Loot

### `POST /api/session/[id]/loot/resolve`
Résout le loot d'une entité vaincue. MJ uniquement.

**Auth** : MJ (auth)

**Body :**
```typescript
{ entity_id: string }     // scene_entity avec is_defeated = true
```

**Actions serveur :**
1. Charge la `enemy_loot_table` du `combatant_id` de l'entité
2. Pour chaque entrée : tirage de probabilité + quantité
3. Retourne les résultats pour validation MJ (pas encore créé en scène)

**Response 200 :**
```typescript
{
  loot_results: Array<{
    item_id: string
    item_name: string
    item_artwork_url: string | null
    quantity: number
    probability: number       // Pour affichage informatif
  }>
}
```

---

### `POST /api/session/[id]/loot/confirm`
Confirme la résolution du loot (après override MJ éventuel). Crée les entités de scène.

**Auth** : MJ (auth)

**Body :**
```typescript
{
  items: Array<{ item_id: string, quantity: number }>  // Liste finale validée par le MJ
}
```

**Actions serveur :**
1. Crée chaque objet comme `scene_entity` de type `item` avec `visible_to_players = false`

**Response 201 :** `{ entity_ids: string[] }`

---

### `POST /api/session/[id]/loot/distribute`
Distribue un objet du loot à un personnage joueur.

**Auth** : MJ (auth)

**Body :**
```typescript
{
  entity_id: string         // scene_entity de type item
  character_id: string      // Personnage destinataire
}
```

**Actions serveur :**
1. Récupère l'objet depuis `scene_entity.item_id`
2. Ajoute à `characters.data.inventory` (jsonb_set ciblé) avec `source: 'loot'`
3. Supprime (ou marque) la `scene_entity`
4. Supabase Realtime propage → toast sur téléphone joueur

**Response 200 :** `{ ok: true }`

---

## Conventions d'erreur

Toutes les réponses d'erreur suivent ce format :

```typescript
{ error: string, code?: string }
```

| Code HTTP | Cas |
|---|---|
| `400` | Paramètres invalides ou manquants |
| `401` | Authentification manquante ou invalide |
| `403` | Accès refusé (mauvais propriétaire, participant invalide) |
| `404` | Ressource non trouvée |
| `409` | Conflit (ex: personnage déjà assigné) |
| `422` | Règle métier violée (ex: points insuffisants, puce incomplète) |
| `500` | Erreur serveur inattendue |
