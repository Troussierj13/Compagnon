// ─── Système de jeu ────────────────────────────────────────────────────────

export type RPGSystem = 'the-one-ring'

// ─── The One Ring : données de feuille de personnage ───────────────────────

export interface TORAttributes {
  strength: number
  heart: number
  mind: number
}

export interface TORSkill {
  name: string
  rank: number
  favoured: boolean
}

export interface TORWeapon {
  name: string
  damage: number
  injury: number
  load: number
  notes?: string
}

export interface TORArmor {
  name: string
  protection: number
  load: number
}

export interface TORVirtue {
  name: string
  description: string
}

export interface TORReward {
  name: string
  description: string
}

export interface TORCharacterData {
  // Identité
  culture: string
  vocation: string
  standard_of_living: string
  // Attributs principaux
  attributes: TORAttributes
  // Attributs secondaires
  endurance_max: number
  endurance_current: number
  hope_max: number
  hope_current: number
  shadow: number
  parry: number
  // Compétences
  skills_strength: TORSkill[]
  skills_heart: TORSkill[]
  skills_mind: TORSkill[]
  // Équipement
  weapons: TORWeapon[]
  armor?: TORArmor
  // Progression
  experience: number
  advancement: number
  // Vertus & Récompenses
  virtues: TORVirtue[]
  rewards: TORReward[]
  // Notes
  notes?: string
}

// ─── Entités de base (mapping tables Supabase) ────────────────────────────

export interface Campaign {
  id: string
  gm_user_id: string
  name: string
  description: string | null
  system: RPGSystem
  created_at: string
  updated_at: string
}

export interface Character {
  id: string
  campaign_id: string
  name: string
  player_name: string | null
  data: TORCharacterData
  created_at: string
  updated_at: string
}

export type SessionStatus = 'waiting' | 'active' | 'ended'

export interface GameSession {
  id: string
  campaign_id: string
  join_code: string
  status: SessionStatus
  active_scene_id: string | null
  created_at: string
  updated_at: string
  // Relations (jointes)
  campaign?: Campaign
  active_scene?: Scene
}

export interface Scene {
  id: string
  session_id: string
  name: string
  description: string | null
  battlemap_url: string | null
  created_at: string
}

export type EntityType = 'enemy' | 'npc' | 'item' | 'zone'

export interface EntityPosition {
  x: number
  y: number
}

export interface EnemyData {
  endurance: number
  endurance_max: number
  parry: number
  armor: number
  hate?: number
  hate_max?: number
  attribute_level?: number
  notes?: string
}

export interface ItemData {
  description: string
  quantity?: number
  is_magical?: boolean
}

export interface ZoneData {
  color: string
  opacity: number
  description?: string
}

export type EntityData = EnemyData | ItemData | ZoneData | Record<string, unknown>

export interface SceneEntity {
  id: string
  scene_id: string
  type: EntityType
  name: string
  data: EntityData
  position: EntityPosition
  visible_to_players: boolean
  created_at: string
  updated_at: string
}

export interface SessionParticipant {
  id: string
  session_id: string
  character_id: string | null
  player_name: string
  joined_at: string
  // Relations
  character?: Character
}

// ─── Payloads API ─────────────────────────────────────────────────────────

export interface CreateSessionPayload {
  campaign_id: string
}

export interface JoinSessionPayload {
  join_code: string
  player_name: string
  character_id?: string
}

export interface JoinSessionResponse {
  session: GameSession
  participant_id: string
}

// ─── État local session (composables) ─────────────────────────────────────

export interface PlayerSessionState {
  session: GameSession | null
  participant_id: string | null
  player_name: string | null
  selected_character: Character | null
}

export interface GMSessionState {
  session: GameSession | null
  participants: SessionParticipant[]
  scenes: Scene[]
  active_scene: Scene | null
  entities: SceneEntity[]
}
