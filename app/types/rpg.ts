// ── Rareté ────────────────────────────────────────────────────────────────────
export type Rarity = 'common' | 'uncommon' | 'rare' | 'legendary'

// ── Types de terrain (voyage) ─────────────────────────────────────────────────
export type TerrainType =
  | 'road' | 'plain' | 'hills'
  | 'light_forest' | 'dense_forest'
  | 'marsh' | 'mountain' | 'hostile_mountain'

// ── Niveau de risque terrain ──────────────────────────────────────────────────
export type DangerLevel = 'standard' | 'risky' | 'dire'

// ── Type de scène ─────────────────────────────────────────────────────────────
// 'combat'      → Battlemap + tokens + fil d'initiative (combat actif possible)
// 'exploration' → Battlemap + tokens (pas de combat, déplacement libre)
// 'journey'     → Panel voyage hexagonal (feature-journey.md)
// 'community'   → Phase de communauté (level-up, repos, havre)
export type SceneType = 'combat' | 'exploration' | 'journey' | 'community'

// ── Mode affichage TV ─────────────────────────────────────────────────────────
// 'waiting'    → Wallpaper ou carte cumulative (aucune scène active)
// 'battlemap'  → Carte + tokens (scènes combat + exploration)
// 'travel'     → Grille hexagonale (scène journey)
// 'end_screen' → Écran de fin affiché après POST /api/session/[id]/end
export type DisplayMode = 'waiting' | 'battlemap' | 'travel' | 'end_screen'

// ── Type d'entité de scène ────────────────────────────────────────────────────
// 'enemy' | 'npc' maintenus pour compatibilité avec données legacy
// Nouvelles entités: 'combatant' (enemy+npc), 'character' (PJ), 'item', 'zone'
export type EntityType = 'enemy' | 'npc' | 'combatant' | 'character' | 'item' | 'zone'

// ── Kind combatant ────────────────────────────────────────────────────────────
export type CombatantKind = 'enemy' | 'npc'

// ── Type haine ───────────────────────────────────────────────────────────────
export type HatredType = 'haine' | 'détermination'

// ── Qualité de vie (personnage) ───────────────────────────────────────────────
export type QualityOfLife = 'miserable' | 'poor' | 'modest' | 'adequate' | 'prosperous' | 'rich'

// ── Identifiants compétences communes ────────────────────────────────────────
export type StrengthSkillId = 'awe' | 'athletics' | 'awareness' | 'hunting' | 'song' | 'craft'
export type HeartSkillId    = 'enhearten' | 'travel' | 'insight' | 'healing' | 'courtesy' | 'battle'
export type MindSkillId     = 'persuade' | 'stealth' | 'scan' | 'explore' | 'riddle' | 'lore'
export type CombatSkillId   = 'axes' | 'bows' | 'spears' | 'swords'
export type SkillId         = StrengthSkillId | HeartSkillId | MindSkillId | CombatSkillId

// ── Cible de récompense ───────────────────────────────────────────────────────
export type RewardTarget = 'armor' | 'helm' | 'shield' | 'weapon_0' | 'weapon_1' | 'weapon_2' | 'weapon_3'

// ── Stat modifiable par un modifier ──────────────────────────────────────────
export type StatIdentifier =
  | 'strength_sr' | 'heart_sr' | 'mind_sr'
  | 'endurance_max' | 'hope_max' | 'parade'
  | 'weapon_dmg' | 'weapon_injury_one_hand' | 'weapon_injury_two_hand'
  | 'armor_protection' | 'helm_protection' | 'shield_parade' | 'item_weight'

// ── Saison ────────────────────────────────────────────────────────────────────
export type Season = 'spring' | 'summer' | 'autumn' | 'winter'

// ── Rôle de voyage ────────────────────────────────────────────────────────────
export type JourneyRole = 'guide' | 'scout' | 'lookout' | 'hunter'

// ── Type d'événement de voyage ────────────────────────────────────────────────
export type JourneyEventType =
  | 'ill_health' | 'mishap' | 'foul_weather'
  | 'shadow_fell' | 'encounter' | 'loss_of_way'

// ── Type de conséquence voyage ────────────────────────────────────────────────
export type ConsequenceType = 'fatigue' | 'shadow' | 'endurance' | 'days_added' | 'rp_only'

// ── Statut session ────────────────────────────────────────────────────────────
// 'waiting' → Créée, pas encore lancée (joueurs peuvent rejoindre)
// 'active'  → En cours (MJ dans le panneau session)
// 'ended'   → Terminée via POST /api/session/[id]/end (archivée, plus modifiable)
export type SessionStatus = 'waiting' | 'active' | 'ended'

// ── Statut voyage ─────────────────────────────────────────────────────────────
export type JourneyStatus = 'active' | 'completed' | 'abandoned'

// ── Type overlay TV ──────────────────────────────────────────────────────────
export type OverlayType = 'character' | 'combatant' | 'item' | 'text' | 'image'

// ── Cible annonce MJ ─────────────────────────────────────────────────────────
export type AnnouncementTarget = 'players' | 'tv' | 'all'

// ── Action NFC ───────────────────────────────────────────────────────────────
export type NfcAction = 'spawn_entity' | 'drop_loot' | 'show_overlay' | 'highlight_entity'

// ── Catégorie média ───────────────────────────────────────────────────────────
export type MediaCategory = 'map' | 'battlemap' | 'background' | 'portrait' | 'artwork' | 'other'

// ── Type objet (loot/inventaire) ──────────────────────────────────────────────
export type ItemType = 'item' | 'weapon' | 'armor' | 'consumable' | 'currency' | 'crafting_component'

// ── Type armure ───────────────────────────────────────────────────────────────
export type ArmorType = 'armor' | 'helm' | 'shield'

// ── Type point d'intérêt ──────────────────────────────────────────────────────
export type PoiType = 'city' | 'ruin' | 'fort' | 'lair' | 'cave' | 'other'

// =============================================================================
// Date in-game TOR
// =============================================================================

// Format interne de la date dans l'univers TOR
// Affichage: "3e Âge, 2946 — 14 octobre"
export interface InGameDate {
  year: number    // Ex: 2946 (Troisième Âge)
  month: number   // 1–12 (mois du calendrier humain standard)
  day: number     // 1–30 (30 jours par mois, convention TOR simplifiée)
}

// =============================================================================
// Système de jeu global
// =============================================================================

export interface Haven {
  id: string
  name: string
  description: string | null
  hope_bonus: number
}

export interface Culture {
  id: string
  name: string
  description: string | null
  // 6 combinaisons proposées à la création (joueur en choisit une)
  // Règle TOR: somme = 14, valeurs individuelles 2–7
  starting_attributes: Array<{ strength: number, heart: number, mind: number }>
  endurance_bonus: number
  hope_bonus: number
  parade_bonus: number
  starting_favored_skills: SkillId[]
  starting_combat_skills: Partial<Record<CombatSkillId, number>>
}

// Modificateur appliqué sur une stat par une vertu ou récompense
export interface ModifierParam {
  target: StatIdentifier
  op: '+' | '*'
  value: number
}

// Une variante d'une vertu (le joueur choisit une variante à l'acquisition)
export interface VirtueVariant {
  name: string
  description: string
  modifiers: ModifierParam[]
}

export interface Virtue {
  id: string
  identifier: string     // Ex: "empowered_virtue"
  name: string
  description: string
  variants: VirtueVariant[]
}

export interface CulturalVirtue extends Virtue {
  culture_id: string
}

export interface Reward {
  id: string
  identifier: string     // Ex: "devastating_reward"
  name: string
  description: string
  // 'weapon' = applicable à n'importe quel slot arme (weapon_0 à weapon_3)
  // L'UI génère les options à partir des armes réellement équipées par le personnage
  // ChosenReward.apply_to utilise 'weapon_0'...'weapon_3' (slot spécifique choisi)
  valid_targets: Array<'armor' | 'helm' | 'shield' | 'weapon'>
  modifiers: ModifierParam[]
}

export interface CampaignWeapon {
  id: string
  campaign_id: string
  name: string
  dmg: number
  injury_one_hand: number
  injury_two_hand: number
  weight: number
  notes: string | null
}

export interface CampaignArmor {
  id: string
  campaign_id: string
  type: ArmorType
  name: string
  protection: number | null    // Dés de protection (armure/casque)
  parade_bonus: number | null  // Bonus parade (bouclier)
  weight: number
}

export interface CampaignItem {
  id: string
  campaign_id: string
  name: string
  description: string | null
  type: ItemType
  rarity: Rarity
  media_id: string | null
  unit: string | null
  craft_tags: string[] | null
}

export interface CampaignMedia {
  id: string
  campaign_id: string
  name: string
  category: MediaCategory
  storage_url: string
  file_size: number | null
}

export interface NfcImageMapping {
  id: string
  campaign_id: string
  family: string | null   // null = toutes les familles
  rarity: Rarity | null   // null = toutes les raretés
  media_id: string
}

// =============================================================================
// Campagne & session
// =============================================================================

export interface Campaign {
  id: string
  gm_user_id: string
  name: string
  description: string | null
  system: string              // 'the-one-ring'
  start_date: InGameDate | null
  current_date: InGameDate | null
  current_season: Season | null  // null = calculé automatiquement depuis current_date
  current_haven_id: string | null
  travel_rules: string | null    // Markdown
  wallpaper_url: string | null
  session_points_adventure: number
  session_points_progression: number
  created_at: string
  updated_at: string
}

export interface GameSession {
  id: string
  campaign_id: string
  name: string
  join_code: string
  status: SessionStatus
  active_scene_id: string | null
  display_mode: DisplayMode
  wallpaper_url: string | null
  combat_active: boolean
  combat_round: number
  created_at: string
  updated_at: string
}

export interface SessionParticipant {
  id: string
  session_id: string
  character_id: string | null
  player_name: string
  joined_at: string
}

export interface Scene {
  id: string
  session_id: string
  name: string
  description: string | null
  scene_type: SceneType
  battlemap_url: string | null
  wallpaper_url: string | null
  sort_order: number
  created_at: string
}

export interface SceneEntity {
  id: string
  scene_id: string
  type: EntityType
  name: string
  data: Record<string, unknown>   // Héritage — préférer les colonnes dédiées
  position: { x: number, y: number }   // % de la battlemap (0–100)
  visible_to_players: boolean
  // Références
  combatant_id: string | null
  character_id: string | null
  item_id: string | null
  // Stats de combat (ennemis/PNJ uniquement)
  endurance_current: number | null
  wounds_received: number | null
  hatred_current: number | null
  is_defeated: boolean
  // Initiative
  in_combat: boolean
  initiative_order: number | null
  is_current_turn: boolean
  created_at: string
  updated_at: string
}

export interface Overlay {
  id: string
  session_id: string
  type: OverlayType
  reference_id: string | null
  content: { text?: string, url?: string } | null
  is_featured: boolean
  position: number
  created_at: string
}

export interface SessionAnnouncement {
  id: string
  session_id: string
  type: 'gm_message' | 'app_event'  // gm_message = saisie MJ, app_event = généré par serveur
  message: string
  target: AnnouncementTarget         // Ignoré pour les app_event (diffusion globale)
  created_at: string
}

// =============================================================================
// Ennemis & PNJ
// =============================================================================

export interface Combatant {
  id: string
  campaign_id: string
  kind: CombatantKind
  name: string
  subname: string | null
  traits: string[] | null        // Max 2
  family: string | null          // Libre (ex: "Gobelin") — pour résolution image NFC
  rarity: Rarity
  artwork_url: string | null
  notes: string | null
  attribute_level: number
  endurance: number
  power: number
  hatred_type: HatredType
  hatred_value: number
  parry: number
  armor: number
  wound_threshold: 1 | 2
  created_at: string
}

export interface CombatantCombatSkill {
  id: string
  combatant_id: string
  name: string                   // Ex: "Lance", "Morsure"
  level: number
  damage: number
  piercing_threshold: number | null   // null = pas perforant
  sort_order: number
}

export interface CombatantFearsomeAbility {
  id: string
  combatant_id: string
  name: string
  description: string            // Markdown
  sort_order: number
}

export interface EnemyLootTableEntry {
  id: string
  combatant_id: string
  item_id: string
  probability: number            // 1–100
  quantity_min: number
  quantity_max: number
}

export interface NpcInventoryItem {
  id: string
  combatant_id: string
  item_id: string | null
  name: string
  quantity: number
  notes: string | null
}

// Combatant enrichi (pour affichage complet — join avec ses sous-tables)
export interface CombatantFull extends Combatant {
  combat_skills: CombatantCombatSkill[]
  fearsome_abilities: CombatantFearsomeAbility[]
  loot_table: EnemyLootTableEntry[]   // Vide pour les PNJ sans loot
  npc_inventory: NpcInventoryItem[]   // Vide pour les ennemis
}

// =============================================================================
// Fiche personnage joueur (TOR)
// =============================================================================

export interface SkillData {
  favored: boolean   // Compétence favorisée (bonus dé)
  rank: number       // 0–6
}

export interface CombatSkillData {
  rank: number       // 0–6 (pas de favored pour les compétences de combat)
}

export interface ChosenVirtue {
  virtue_id: string          // FK → virtues.id ou cultural_virtues.id
  chosen_variant: number     // Index de la variante choisie (0 = première)
  is_cultural: boolean       // true = vertu culturelle (rang 2+ de Sagesse seulement)
  rank_acquired: number      // Rang de Sagesse auquel cette vertu a été acquise
}

export interface ChosenReward {
  reward_id: string          // FK → rewards.id
  apply_to: RewardTarget     // 'armor' | 'helm' | 'shield' | 'weapon_0' | ...
}

export interface WeaponSlot {
  item_id: string | null     // FK → campaign_weapons.id (null si saisie manuelle)
  name: string               // Dénormalisé pour affichage sans join
  dmg: number
  injury_one_hand: number
  injury_two_hand: number
  weight: number
  notes: string | null
  reward_ids: string[]       // IDs des récompenses appliquées à cette arme
}

export interface ArmorSlot {
  item_id: string | null     // FK → campaign_armors.id
  name: string
  protection: number         // Nombre de dés (ex: 2 → 2d protection)
  weight: number
  reward_ids: string[]
}

export interface ShieldSlot {
  item_id: string | null
  name: string
  parade_bonus: number       // Ex: +1, +2, +3
  weight: number
  reward_ids: string[]
}

export interface InventoryItem {
  item_id: string | null     // FK → campaign_items.id (null si saisi manuellement)
  name: string               // Dénormalisé
  quantity: number
  skill_ref: SkillId | null  // Référence compétence (attirail de voyage)
  notes: string | null
  source: 'manual' | 'loot'
}

export interface CharacterStates {
  exhaust: boolean    // Auto: current_endurance < poids_total + fatigue
  melancholic: boolean // Auto: current_hope < shadows
  hurt: boolean        // Toggle manuel
  injury: { value: number; unit: 'hours' | 'days' } | null
}

// Structure complète stockée dans characters.data (JSONB)
export interface TORCharacterData {
  // ── En-tête ────────────────────────────────────────────────────────────────
  vocation: string                        // Ex: "Messager", "Érudit"
  age: number
  quality_of_life: QualityOfLife
  garant: string                          // Protecteur/patron narratif
  particularities: string[]               // Saisie libre
  faults: string[]

  // ── Attributs primaires ────────────────────────────────────────────────────
  attributes: {
    strength: number   // CORPS (2–7 à la création, max théorique 9) — somme des 3 ≤ 14 à la création
    heart: number      // CŒUR (2–7 à la création)
    mind: number       // ESPRIT (2–7 à la création)
  }

  // ── Compétences communes (18) ──────────────────────────────────────────────
  strength_skills: Record<StrengthSkillId, SkillData>
  heart_skills: Record<HeartSkillId, SkillData>
  mind_skills: Record<MindSkillId, SkillData>

  // ── Compétences de combat (4) ──────────────────────────────────────────────
  combat_skills: Record<CombatSkillId, CombatSkillData>

  // ── Sagesse & Vertus ───────────────────────────────────────────────────────
  sagesse: {
    rank: number            // = len(virtues) — incrémenté automatiquement
    virtues: ChosenVirtue[]
  }

  // ── Vaillance & Récompenses ────────────────────────────────────────────────
  vaillance: {
    rank: number            // = len(rewards) — incrémenté automatiquement
    rewards: ChosenReward[]
  }

  // ── Équipement de combat ───────────────────────────────────────────────────
  weapons: WeaponSlot[]    // max 4 éléments
  armor: ArmorSlot | null
  helm: ArmorSlot | null
  shield: ShieldSlot | null

  // ── Inventaire ─────────────────────────────────────────────────────────────
  // NOTE: Pas de table séparée — tout est dans ce JSONB
  // Updates ciblés via jsonb_set ou merge partiel
  inventory: InventoryItem[]
  treasure: number

  // ── État courant ───────────────────────────────────────────────────────────
  current_endurance: number
  current_hope: number
  fatigue: number            // Réduit l'endurance effective
  shadows: number            // Réduit l'espoir effectif
  sequels: number            // Séquelles cumulatives

  // ── Conditions ─────────────────────────────────────────────────────────────
  states: CharacterStates

  // ── Points de progression ──────────────────────────────────────────────────
  adventure_points: number    // → Sagesse & Vaillance
  progression_points: number  // → Compétences
  community_points: number    // Narratif uniquement (pas de mécanique)
}

// Barème de progression (même barème pour compétences ET sagesse/vaillance)
export const PROGRESSION_COSTS: Record<number, number> = {
  1: 4,   // 0 → 1
  2: 8,   // 1 → 2
  3: 12,
  4: 20,
  5: 26,
  6: 30,
}

// Coûts en jours par terrain (valeurs TOR standard)
export const TERRAIN_DAYS_COST: Record<TerrainType, number> = {
  road: 1, plain: 1, hills: 2, light_forest: 2,
  dense_forest: 3, marsh: 3, mountain: 4, hostile_mountain: 5,
}

// Niveau de risque par défaut par terrain
export const TERRAIN_DANGER_LEVEL: Record<TerrainType, DangerLevel> = {
  road: 'standard', plain: 'standard', hills: 'standard', light_forest: 'standard',
  dense_forest: 'risky', marsh: 'risky', mountain: 'dire', hostile_mountain: 'dire',
}

// =============================================================================
// NFC
// =============================================================================

export interface NfcEntityType {
  id: string
  name: string          // Ex: "ennemi", "drop"
  version: number       // Incrémenté si les champs changent
  fields: NfcFieldDef[]
  action: NfcAction
  created_at: string
}

export interface NfcFieldDef {
  name: string
  type: 'string' | 'int' | 'float' | 'boolean' | 'enum' | 'string[]' | 'int[]' | 'object[]'
  required: boolean
  values?: string[]     // Pour type='enum' uniquement
}

// Payload décodé depuis une puce NFC (après decode CBOR)
export interface NfcPayload {
  _t: string            // Nom du type (= nfc_entity_types.name)
  [field: string]: unknown
}

// =============================================================================
// Voyage
// =============================================================================

export interface JourneyMap {
  id: string
  name: string
  background_image_url: string | null   // URL directe — journey_maps est global (pas de FK campaign_media)
  grid_width: number
  grid_height: number
  hex_size: number
  grid_offset_x: number
  grid_offset_y: number
  default_start_hex: HexCoord
  created_at: string
}

export interface HexCoord {
  q: number   // Coordonnée axiale q (colonne)
  r: number   // Coordonnée axiale r (ligne)
}

export interface HexTile {
  id: string
  map_id: string
  q: number
  r: number
  terrain_type: TerrainType
  days_cost: number
  danger_level: DangerLevel
  passable: boolean
  label: string | null
  poi_type: PoiType | null
  poi_hidden: boolean
}

export interface Journey {
  id: string
  session_id: string
  campaign_id: string
  map_id: string
  start_hex: HexCoord
  destination_hex: HexCoord
  planned_path: HexCoord[]
  actual_path: HexCoord[]
  current_hex: HexCoord
  roles: JourneyRoles
  total_days: number
  days_elapsed: number
  start_date: InGameDate
  current_date: InGameDate
  estimated_end_date: InGameDate
  status: JourneyStatus
  created_at: string
}

export interface JourneyRoles {
  guide?: string           // character_id
  scout?: string[]         // character_ids (plusieurs possibles)
  lookout?: string         // character_id
  hunter?: string          // character_id
}

export interface JourneyStage {
  id: string
  journey_id: string
  stage_number: number
  day_start: number
  day_end: number
  hex_at_stage: HexCoord
  in_universe_date: InGameDate
  danger_level: DangerLevel
  rolls: JourneyRoll[]
  status: 'pending' | 'resolved'
}

export interface JourneyRoll {
  character_id: string
  role: JourneyRole
  skill_key: SkillId
  total: number
  feat_die: number           // 1–12 (résultat du dé-destin)
  eye_of_sauron: boolean     // true si feat_die = 11 (Œil de Sauron)
}

export interface JourneyEvent {
  id: string
  stage_id: string
  journey_id: string
  event_type: JourneyEventType
  triggered_by: string | null      // character_id
  affected_scope: 'individual' | 'full_party'
  affected_character_id: string | null
  consequence_type: ConsequenceType
  consequence_value: number
  applied: boolean
  notes: string | null
  created_at: string
}

// =============================================================================
// Composables — types de retour
// =============================================================================

export interface GMSessionState {
  session: import('vue').Ref<GameSession | null>
  campaign: import('vue').Ref<Campaign | null>
  participants: import('vue').Ref<SessionParticipant[]>
  activeScene: import('vue').Ref<Scene | null>
  loading: import('vue').Ref<boolean>
  error: import('vue').Ref<string | null>
}

export interface PlayerSessionState {
  session: import('vue').Ref<GameSession | null>
  campaign: import('vue').Ref<{
    id: string
    name: string
    current_date: InGameDate | null
    current_haven: { name: string, hope_bonus: number } | null
  } | null>
  activeScene: import('vue').Ref<Pick<Scene, 'id' | 'name' | 'scene_type' | 'battlemap_url' | 'wallpaper_url'> | null>
  entities: import('vue').Ref<SceneEntity[]>   // uniquement visible_to_players = true
  participant: import('vue').Ref<SessionParticipant | null>
  character: import('vue').Ref<Character | null>
  loading: import('vue').Ref<boolean>
  error: import('vue').Ref<string | null>
}

export interface UseCharacterState {
  character: import('vue').Ref<Character | null>
  derivedStats: import('vue').ComputedRef<DerivedStats | null>
  culture: import('vue').Ref<Culture | null>
  loading: import('vue').Ref<boolean>
}

export interface DerivedStats {
  strength_sr: number
  heart_sr: number
  mind_sr: number
  endurance_max: number
  hope_max: number
  parade: number
  weight_total: number
  exhaust: boolean
  melancholic: boolean
}

// =============================================================================
// Types utilitaires
// =============================================================================

// Entité enrichie pour affichage (join scene_entity + combatant)
export interface SceneEntityWithCombatant extends SceneEntity {
  combatant: CombatantFull | null
}

// Résultat de loot (avant confirmation MJ)
export interface LootResult {
  item_id: string
  item_name: string
  item_artwork_url: string | null
  quantity: number
  probability: number
}

// Personnage (table characters + data joinés)
export interface Character {
  id: string
  campaign_id: string
  culture_id: string | null
  name: string
  player_name: string
  portrait_url: string | null
  data: TORCharacterData
  culture: Pick<Culture, 'name' | 'endurance_bonus' | 'hope_bonus' | 'parade_bonus'> | null
  created_at: string
  updated_at: string
}
