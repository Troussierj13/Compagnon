# Schéma de base de données — Compagnon JdR

> **Source de vérité** : ce fichier est dérivé des specs `app/docs/vision/` et `app/docs/rules/`.
> En cas de contradiction, les fichiers vision ont priorité.
> Le schéma initial (`001_initial_schema.sql`) est la base existante — ce document décrit l'état cible complet.

---

## Vue d'ensemble des tables

### Tables existantes (001_initial_schema.sql)

| Table | État | Actions requises |
|---|---|---|
| `campaigns` | ✅ Existe | Ajouter 6 colonnes |
| `characters` | ✅ Existe | Ajouter `culture_id`, `portrait_url` |
| `sessions` | ✅ Existe | Ajouter `name`, `wallpaper_url`, `display_mode`, `combat_active`, `combat_round` |
| `scenes` | ✅ Existe | Ajouter `scene_type`, `wallpaper_url`, `sort_order` |
| `scene_entities` | ✅ Existe | Ajouter 8 colonnes (combat, initiative, refs) + étendre type CHECK |
| `session_participants` | ✅ Existe | `character_id` déjà présent ✅ |

### Tables à créer (par domaine)

| Domaine | Tables |
|---|---|
| **Système de jeu global** | `game_system_havens`, `cultures`, `virtues`, `cultural_virtues`, `rewards` |
| **Armurerie & objets** | `campaign_weapons`, `campaign_armors`, `campaign_items` |
| **Médias** | `campaign_media`, `nfc_image_mappings` |
| **Ennemis & PNJ** | `combatants`, `combatant_combat_skills`, `combatant_fearsome_abilities`, `enemy_loot_table`, `npc_inventory` |
| **NFC** | `nfc_entity_types` |
| **Session live** | `overlays`, `session_announcements` |
| **Voyages** | `journey_maps`, `hex_tiles`, `journeys`, `journey_stages`, `journey_events` |

---

## Migration 002 — Système de jeu global

```sql
-- ─── Havres (globaux) ────────────────────────────────────────────────────────
-- Lieux sanctifiés pour la Phase de Communauté (Dale, Fondcombe, La Comté…)
-- Référence: feature-game-system.md § 7
CREATE TABLE game_system_havens (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  description TEXT,
  hope_bonus  INTEGER NOT NULL DEFAULT 0,  -- Espoir supplémentaire récupérable au-delà de Cœur
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Données de base TOR à insérer lors de l'initialisation du système
-- INSERT INTO game_system_havens (name, hope_bonus) VALUES
--   ('La Comté', 2), ('Dale', 1), ('Fondcombe', 3), ('Edoras', 1);

-- ─── Cultures ────────────────────────────────────────────────────────────────
-- Cultures des personnages joueurs (Bardide, Nain, Elfe, Hobbit, Bree, Rôdeur)
-- Référence: feature-game-system.md § 1, rules/cultures.md
CREATE TABLE cultures (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                    TEXT NOT NULL,
  description             TEXT,
  -- Tableau des 6 combinaisons d'attributs proposées à la création (joueur en choisit une)
  -- Ex: [{"strength": 2, "heart": 7, "mind": 5}, {"strength": 3, "heart": 6, "mind": 5}, ...]
  -- Règle TOR: somme toujours = 14, valeurs individuelles entre 2 et 7
  starting_attributes     JSONB NOT NULL DEFAULT '[]'::jsonb,
  -- Bonus fixes ajoutés aux attributs pour les stats dérivées
  endurance_bonus         INTEGER NOT NULL DEFAULT 20, -- Endurance max = Corps + endurance_bonus
  hope_bonus              INTEGER NOT NULL DEFAULT 8,  -- Espoir max = Cœur + hope_bonus
  parade_bonus            INTEGER NOT NULL DEFAULT 12, -- Parade = Esprit + parade_bonus
  -- Compétences communes favorisées dès la création (IDs, ex: ["hunting", "lore"])
  starting_favored_skills TEXT[] NOT NULL DEFAULT '{}',
  -- Rangs de départ des compétences de combat: { "bows": 2, "axes": 1, ... }
  starting_combat_skills  JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Valeurs de référence TOR 2e (à pré-remplir):
-- Bardide: endurance_bonus=20, hope_bonus=8, parade_bonus=12
-- Nain de Durin: 22, 8, 10
-- Elfe de Lindon: 20, 8, 12
-- Hobbit de la Comté: 18, 10, 12
-- Homme de Bree: 20, 10, 10
-- Rôdeur du Nord: 20, 6, 14

-- ─── Vertus ordinaires ───────────────────────────────────────────────────────
-- Disponibles dès Sagesse rang 1, pour tous les personnages
-- Référence: feature-game-system.md § 2, rules/virtues-rewards.md
CREATE TABLE virtues (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier  TEXT UNIQUE NOT NULL,  -- ex: "assurance_virtue", "empowered_virtue"
  name        TEXT NOT NULL,
  description TEXT NOT NULL,
  -- Tableau de variantes: [{ name, description, modifiers: [{ target, op, value }] }]
  variants    JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Vertus culturelles ──────────────────────────────────────────────────────
-- Vertus liées à une culture, disponibles à partir de Sagesse rang 2
-- Référence: feature-game-system.md § 3
CREATE TABLE cultural_virtues (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  culture_id  UUID NOT NULL REFERENCES cultures(id) ON DELETE CASCADE,
  identifier  TEXT NOT NULL,  -- unique par culture
  name        TEXT NOT NULL,
  description TEXT NOT NULL,
  variants    JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (culture_id, identifier)
);

-- ─── Récompenses ─────────────────────────────────────────────────────────────
-- Acquises en montant Vaillance, s'appliquent à une pièce d'équipement
-- Référence: feature-game-system.md § 4, rules/virtues-rewards.md
CREATE TABLE rewards (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier     TEXT UNIQUE NOT NULL,  -- ex: "devastating_reward", "clever_reward"
  name           TEXT NOT NULL,
  description    TEXT NOT NULL,
  -- Cibles valides: subset de ["armor", "helm", "shield", "weapon"]
  valid_targets  TEXT[] NOT NULL DEFAULT '{}',
  -- Tableau de ModifierParam: [{ target: string, op: '+' | '*', value: number }]
  modifiers      JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Indexes ─────────────────────────────────────────────────────────────────
CREATE INDEX ON cultural_virtues(culture_id);

-- ─── RLS ─────────────────────────────────────────────────────────────────────
ALTER TABLE game_system_havens ENABLE ROW LEVEL SECURITY;
ALTER TABLE cultures           ENABLE ROW LEVEL SECURITY;
ALTER TABLE virtues            ENABLE ROW LEVEL SECURITY;
ALTER TABLE cultural_virtues   ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards            ENABLE ROW LEVEL SECURITY;

-- Lecture publique (utilisées par les server endpoints joueur et MJ)
CREATE POLICY "havens_public_read"          ON game_system_havens FOR SELECT USING (true);
CREATE POLICY "cultures_public_read"        ON cultures           FOR SELECT USING (true);
CREATE POLICY "virtues_public_read"         ON virtues            FOR SELECT USING (true);
CREATE POLICY "cultural_virtues_public_read" ON cultural_virtues  FOR SELECT USING (true);
CREATE POLICY "rewards_public_read"         ON rewards            FOR SELECT USING (true);

-- Écriture réservée au MJ authentifié
CREATE POLICY "havens_gm_write"          ON game_system_havens FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "havens_gm_update"         ON game_system_havens FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "havens_gm_delete"         ON game_system_havens FOR DELETE USING (auth.role() = 'authenticated');
CREATE POLICY "cultures_gm_write"        ON cultures           FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "cultures_gm_update"       ON cultures           FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "cultures_gm_delete"       ON cultures           FOR DELETE USING (auth.role() = 'authenticated');
CREATE POLICY "virtues_gm_write"         ON virtues            FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "virtues_gm_update"        ON virtues            FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "virtues_gm_delete"        ON virtues            FOR DELETE USING (auth.role() = 'authenticated');
CREATE POLICY "cultural_virtues_gm_all"  ON cultural_virtues   FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "rewards_gm_write"         ON rewards            FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "rewards_gm_update"        ON rewards            FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "rewards_gm_delete"        ON rewards            FOR DELETE USING (auth.role() = 'authenticated');

-- NOTE: auth.role() = 'authenticated' autorise tout MJ authentifié à éditer le système de jeu global.
-- C'est intentionnel : les tables game_system_havens, virtues, rewards sont partagées entre tous les MJ.
-- Si ownership par MJ requis : ajouter created_by UUID et filtrer par auth.uid().
```

---

## Migration 003 — Colonnes campagnes & personnages

```sql
-- ─── Colonnes à ajouter sur campaigns ────────────────────────────────────────
-- Référence: feature-player-view.md, feature-display-tv.md (feature-campaign-management.md non existant — see SPECS-RESTANTES.md)

ALTER TABLE campaigns
  ADD COLUMN start_date         JSONB,          -- { year: int, month: 1-12, day: 1-30 }
  ADD COLUMN current_date       JSONB,          -- date in-game courante
  ADD COLUMN current_season     TEXT            -- 'spring'|'summer'|'autumn'|'winter'|null (null=auto depuis current_date)
    CHECK (current_season IN ('spring', 'summer', 'autumn', 'winter')),
  ADD COLUMN current_haven_id   UUID REFERENCES game_system_havens(id) ON DELETE SET NULL,
  ADD COLUMN travel_rules       TEXT,           -- Markdown libre, affiché sur TV en mode Voyage
  ADD COLUMN wallpaper_url      TEXT;           -- Fond d'écran fallback (si aucun voyage terminé)

-- NOTE: world_map_url supprimé — la carte est générée dynamiquement depuis journey_maps + journeys
-- NOTE: session_points_adventure et session_points_progression (optionnel, pour distribution auto)
ALTER TABLE campaigns
  ADD COLUMN session_points_adventure  INTEGER NOT NULL DEFAULT 2,
  ADD COLUMN session_points_progression INTEGER NOT NULL DEFAULT 3;

-- ─── Colonnes à ajouter sur characters ───────────────────────────────────────
-- Référence: feature-characters.md § 1.1

ALTER TABLE characters
  ADD COLUMN culture_id   UUID REFERENCES cultures(id) ON DELETE SET NULL,
  ADD COLUMN portrait_url TEXT;

CREATE INDEX ON characters(culture_id);

-- ─── Colonnes à ajouter sur sessions ─────────────────────────────────────────
-- Référence: feature-initiative.md § Modèle, feature-display-tv.md § Données

ALTER TABLE sessions
  ADD COLUMN name          TEXT NOT NULL DEFAULT 'Session',
  ADD COLUMN wallpaper_url TEXT,
  ADD COLUMN display_mode  TEXT NOT NULL DEFAULT 'waiting'
    CHECK (display_mode IN ('waiting', 'battlemap', 'travel', 'end_screen')),
    -- 'waiting'    → Pas de scène active (wallpaper ou carte cumulative)
    -- 'battlemap'  → Scène combat ou exploration (tokens sur carte)
    -- 'travel'     → Scène journey (grille hexagonale)
    -- 'end_screen' → Session terminée (overlay fin de session)
  ADD COLUMN combat_active BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN combat_round  INTEGER NOT NULL DEFAULT 0;

-- ─── Colonnes à ajouter sur scenes ───────────────────────────────────────────
-- Référence: feature-display-tv.md, feature-journey.md, feature-characters.md

ALTER TABLE scenes
  ADD COLUMN scene_type    TEXT NOT NULL DEFAULT 'combat'
    CHECK (scene_type IN ('combat', 'exploration', 'journey', 'community')),
    -- 'combat'      → Battlemap + tokens + initiative possible (display_mode → 'battlemap')
    -- 'exploration' → Battlemap + tokens, pas de combat (display_mode → 'battlemap')
    -- 'journey'     → Panel voyage hex (display_mode → 'travel')
    -- 'community'   → Phase de communauté (display_mode → 'battlemap')
    -- Note: 'normal' était l'ancienne valeur — remplacé par 'combat' | 'exploration'
  ADD COLUMN wallpaper_url TEXT,
  ADD COLUMN sort_order    INTEGER NOT NULL DEFAULT 0;

-- NOTE: battlemap_url existe déjà dans le schéma initial ✅
```

---

## Migration 004 — Armurerie & catalogue d'objets

```sql
-- ─── Armes (par campagne) ─────────────────────────────────────────────────────
-- Catalogue des armes disponibles dans une campagne
-- Référence: feature-game-system.md § 5
CREATE TABLE campaign_weapons (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id      UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  name             TEXT NOT NULL,
  dmg              INTEGER NOT NULL DEFAULT 0,
  injury_one_hand  INTEGER NOT NULL DEFAULT 20,  -- Seuil blessure 1 main (ex: 16 = blessure sur 16+)
  injury_two_hand  INTEGER NOT NULL DEFAULT 20,  -- Seuil blessure 2 mains
  weight           INTEGER NOT NULL DEFAULT 0,
  notes            TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Armures, casques, boucliers (par campagne) ───────────────────────────────
-- Référence: feature-game-system.md § 6
CREATE TABLE campaign_armors (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id  UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  type         TEXT NOT NULL CHECK (type IN ('armor', 'helm', 'shield')),
  name         TEXT NOT NULL,
  protection   INTEGER,      -- Nombre de dés de protection (armure/casque). NULL pour bouclier.
  parade_bonus INTEGER,      -- Bonus de parade (bouclier uniquement). NULL pour armure/casque.
  weight       INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Données TOR de base (à insérer à la création d'une campagne):
-- armor: Chemise de cuir (1d, poids 3), Corselet à manches longues (2d, 6), Cotte courte (3d, 9), Cotte longue (4d, 12)
-- helm: Heaume (1d, 4)
-- shield: Petit (+1, 2), Bouclier (+2, 4), Grand (+3, 6)

-- ─── Catalogue d'objets (par campagne) ───────────────────────────────────────
-- Objets génériques: attirail, loot, consommables, composants de craft, monnaies
-- Référence: feature-loot.md § 1
CREATE TABLE campaign_items (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id  UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  description  TEXT,
  type         TEXT NOT NULL DEFAULT 'item'
    CHECK (type IN ('item', 'weapon', 'armor', 'consumable', 'currency', 'crafting_component')),
  rarity       TEXT NOT NULL DEFAULT 'common'
    CHECK (rarity IN ('common', 'uncommon', 'rare', 'legendary')),
  media_id     UUID,          -- FK → campaign_media (ajouté après création de campaign_media)
  unit         TEXT,          -- Unité d'affichage pour monnaies (ex: "pièces d'or")
  craft_tags   TEXT[],        -- Tags pour le système de craft (ex: ["métal", "forgeron"])
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Indexes ─────────────────────────────────────────────────────────────────
CREATE INDEX ON campaign_weapons(campaign_id);
CREATE INDEX ON campaign_armors(campaign_id);
CREATE INDEX ON campaign_items(campaign_id);

-- ─── RLS ─────────────────────────────────────────────────────────────────────
ALTER TABLE campaign_weapons ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_armors  ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_items   ENABLE ROW LEVEL SECURITY;

CREATE POLICY "campaign_weapons_gm_all" ON campaign_weapons FOR ALL
  USING (campaign_id IN (SELECT id FROM campaigns WHERE gm_user_id = auth.uid()));
CREATE POLICY "campaign_armors_gm_all"  ON campaign_armors  FOR ALL
  USING (campaign_id IN (SELECT id FROM campaigns WHERE gm_user_id = auth.uid()));
CREATE POLICY "campaign_items_gm_all"   ON campaign_items   FOR ALL
  USING (campaign_id IN (SELECT id FROM campaigns WHERE gm_user_id = auth.uid()));
```

---

## Migration 005 — Bibliothèque média & mappings NFC

```sql
-- ─── Bibliothèque d'images (par campagne) ────────────────────────────────────
-- Référence: feature-media-library.md
CREATE TABLE campaign_media (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id  UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  category     TEXT NOT NULL DEFAULT 'other'
    CHECK (category IN ('map', 'battlemap', 'background', 'portrait', 'artwork', 'other')),
  storage_url  TEXT NOT NULL,   -- URL publique Supabase Storage (bucket: campaign-media/{campaign_id}/)
  file_size    INTEGER,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ajouter la FK campaign_items.media_id après création de campaign_media
ALTER TABLE campaign_items
  ADD CONSTRAINT campaign_items_media_fkey
  FOREIGN KEY (media_id) REFERENCES campaign_media(id) ON DELETE SET NULL;

-- ─── Mappings images NFC ──────────────────────────────────────────────────────
-- Résolution d'image pour les entités spawned via NFC (famille × rareté → image)
-- Référence: feature-media-library.md § Résolution NFC, feature-nfc.md
CREATE TABLE nfc_image_mappings (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  family      TEXT,      -- Famille de l'entité (null = toutes). Correspond à combatants.family
  rarity      TEXT       -- Rareté (null = toutes)
    CHECK (rarity IN ('common', 'uncommon', 'rare', 'legendary')),
  media_id    UUID NOT NULL REFERENCES campaign_media(id) ON DELETE CASCADE,
  UNIQUE (campaign_id, family, rarity)  -- Évite les doublons de mapping
);
-- ⚠️ UNIQUE avec colonnes NULLables: en PostgreSQL, NULL ≠ NULL pour les index UNIQUE.
-- Deux lignes avec family=NULL, rarity=NULL pour la même campagne seront considérées comme distinctes.
-- Solution PostgreSQL 15+: UNIQUE NULLS NOT DISTINCT (campaign_id, family, rarity)
-- Solution compatible: index conditionnel ou validation côté serveur.
-- Si la version PG de Supabase < 15, valider l'unicité dans l'endpoint POST /nfc/trigger.

-- ─── Indexes ─────────────────────────────────────────────────────────────────
CREATE INDEX ON campaign_media(campaign_id);
CREATE INDEX ON nfc_image_mappings(campaign_id);

-- ─── RLS ─────────────────────────────────────────────────────────────────────
ALTER TABLE campaign_media       ENABLE ROW LEVEL SECURITY;
ALTER TABLE nfc_image_mappings   ENABLE ROW LEVEL SECURITY;

CREATE POLICY "campaign_media_gm_all" ON campaign_media FOR ALL
  USING (campaign_id IN (SELECT id FROM campaigns WHERE gm_user_id = auth.uid()));
CREATE POLICY "nfc_mappings_gm_all" ON nfc_image_mappings FOR ALL
  USING (campaign_id IN (SELECT id FROM campaigns WHERE gm_user_id = auth.uid()));

-- Lecture publique pour la résolution d'images côté TV et joueur
CREATE POLICY "campaign_media_public_read" ON campaign_media FOR SELECT USING (true);
CREATE POLICY "nfc_mappings_public_read"   ON nfc_image_mappings FOR SELECT USING (true);

-- ─── Storage bucket ───────────────────────────────────────────────────────────
-- Créer manuellement dans Supabase Storage > New bucket: "campaign-media" (public: true)
-- Organisation: campaign-media/{campaign_id}/{image_id}.{ext}
```

---

## Migration 006 — Ennemis & PNJ

```sql
-- ─── Combatants (ennemis + PNJ unifiés) ──────────────────────────────────────
-- Référence: feature-enemies.md
CREATE TABLE combatants (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id      UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  kind             TEXT NOT NULL CHECK (kind IN ('enemy', 'npc')),
  name             TEXT NOT NULL,
  subname          TEXT,          -- Sous-titre / titre (ex: "fils des premiers hommes")
  traits           TEXT[],        -- 1-2 particularités descriptives (ex: ["Cruel et endurci"])
  family           TEXT,          -- Race/famille (ex: "Gobelin") — libre, pour résolution NFC image
  rarity           TEXT NOT NULL DEFAULT 'common'
    CHECK (rarity IN ('common', 'uncommon', 'rare', 'legendary')),
  artwork_url      TEXT,          -- URL artwork (via Media Library)
  notes            TEXT,          -- Notes libres MJ (Markdown)
  -- Stats de combat TOR
  attribute_level  INTEGER NOT NULL DEFAULT 3,  -- Dangerosité globale
  endurance        INTEGER NOT NULL CHECK (endurance > 0),
  power            INTEGER NOT NULL DEFAULT 1 CHECK (power > 0),  -- Nombre d'attaques/tour
  hatred_type      TEXT NOT NULL DEFAULT 'détermination'
    CHECK (hatred_type IN ('haine', 'détermination')),
    -- Règle: kind='npc' → hatred_type forcé à 'détermination' (validé côté serveur)
  hatred_value     INTEGER NOT NULL DEFAULT 0 CHECK (hatred_value >= 0),
  parry            INTEGER NOT NULL DEFAULT 0 CHECK (parry >= 0),
  armor            INTEGER NOT NULL DEFAULT 0 CHECK (armor >= 0),
  wound_threshold  INTEGER NOT NULL DEFAULT 1 CHECK (wound_threshold IN (1, 2)),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger updated_at pour combatants
CREATE TRIGGER set_updated_at_combatants
  BEFORE UPDATE ON combatants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
-- NOTE: update_updated_at() est définie dans 001_initial_schema.sql

-- ─── Compétences de combat ────────────────────────────────────────────────────
CREATE TABLE combatant_combat_skills (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  combatant_id       UUID NOT NULL REFERENCES combatants(id) ON DELETE CASCADE,
  name               TEXT NOT NULL,    -- Ex: "Lance", "Morsure", "Cimeterre"
  level              INTEGER NOT NULL, -- Niveau de compétence (dé de combat)
  damage             INTEGER NOT NULL,
  piercing_threshold INTEGER,          -- Seuil coup perforant. NULL = pas perforant
  sort_order         INTEGER NOT NULL DEFAULT 0
);

-- ─── Capacités redoutables ────────────────────────────────────────────────────
CREATE TABLE combatant_fearsome_abilities (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  combatant_id UUID NOT NULL REFERENCES combatants(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  description  TEXT NOT NULL,   -- Markdown supporté
  sort_order   INTEGER NOT NULL DEFAULT 0
);

-- ─── Table de loot des ennemis ────────────────────────────────────────────────
-- Référence: feature-loot.md § 3, feature-enemies.md § 2.1
CREATE TABLE enemy_loot_table (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  combatant_id  UUID NOT NULL REFERENCES combatants(id) ON DELETE CASCADE,
  item_id       UUID NOT NULL REFERENCES campaign_items(id) ON DELETE CASCADE,
  probability   INTEGER NOT NULL DEFAULT 100 CHECK (probability BETWEEN 1 AND 100),
  quantity_min  INTEGER NOT NULL DEFAULT 1 CHECK (quantity_min >= 1),
  quantity_max  INTEGER NOT NULL DEFAULT 1 CHECK (quantity_max >= quantity_min)
);

-- ─── Inventaire PNJ ──────────────────────────────────────────────────────────
-- Référence: feature-loot.md, feature-enemies.md § 2.2
-- Uniquement pour combatants.kind = 'npc'
CREATE TABLE npc_inventory (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  combatant_id UUID NOT NULL REFERENCES combatants(id) ON DELETE CASCADE,
  item_id      UUID REFERENCES campaign_items(id) ON DELETE SET NULL,  -- null si saisi manuellement
  name         TEXT NOT NULL,    -- Dénormalisé pour affichage rapide
  quantity     INTEGER NOT NULL DEFAULT 1 CHECK (quantity >= 0),
  notes        TEXT
);

-- ─── Indexes ─────────────────────────────────────────────────────────────────
CREATE INDEX ON combatants(campaign_id);
CREATE INDEX ON combatants(kind);
CREATE INDEX ON combatant_combat_skills(combatant_id);
CREATE INDEX ON combatant_fearsome_abilities(combatant_id);
CREATE INDEX ON enemy_loot_table(combatant_id);
CREATE INDEX ON npc_inventory(combatant_id);

-- ─── RLS ─────────────────────────────────────────────────────────────────────
ALTER TABLE combatants                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE combatant_combat_skills     ENABLE ROW LEVEL SECURITY;
ALTER TABLE combatant_fearsome_abilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE enemy_loot_table            ENABLE ROW LEVEL SECURITY;
ALTER TABLE npc_inventory               ENABLE ROW LEVEL SECURITY;

CREATE POLICY "combatants_gm_all" ON combatants FOR ALL
  USING (campaign_id IN (SELECT id FROM campaigns WHERE gm_user_id = auth.uid()));

CREATE POLICY "combat_skills_gm_all" ON combatant_combat_skills FOR ALL
  USING (combatant_id IN (
    SELECT c.id FROM combatants c
    JOIN campaigns camp ON camp.id = c.campaign_id
    WHERE camp.gm_user_id = auth.uid()
  ));

CREATE POLICY "fearsome_abilities_gm_all" ON combatant_fearsome_abilities FOR ALL
  USING (combatant_id IN (
    SELECT c.id FROM combatants c
    JOIN campaigns camp ON camp.id = c.campaign_id
    WHERE camp.gm_user_id = auth.uid()
  ));

CREATE POLICY "loot_table_gm_all" ON enemy_loot_table FOR ALL
  USING (combatant_id IN (
    SELECT c.id FROM combatants c
    JOIN campaigns camp ON camp.id = c.campaign_id
    WHERE camp.gm_user_id = auth.uid()
  ));

CREATE POLICY "npc_inventory_gm_all" ON npc_inventory FOR ALL
  USING (combatant_id IN (
    SELECT c.id FROM combatants c
    JOIN campaigns camp ON camp.id = c.campaign_id
    WHERE camp.gm_user_id = auth.uid()
  ));
```

---

## Migration 007 — NFC

```sql
-- ─── Types d'entités NFC ─────────────────────────────────────────────────────
-- Schémas de données pilotés par la BDD — aucun type codé en dur
-- Référence: feature-nfc.md
CREATE TABLE nfc_entity_types (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,     -- Ex: "ennemi", "drop", "personnage"
  version    INTEGER NOT NULL DEFAULT 1,  -- Incrémenté si les champs changent
  -- Tableau de champs: [{ name, type, required, values? }]
  -- Types supportés: string, int, float, boolean, enum, string[], int[], object[]
  fields     JSONB NOT NULL DEFAULT '[]'::jsonb,
  action     TEXT NOT NULL
    CHECK (action IN ('spawn_entity', 'drop_loot', 'show_overlay', 'highlight_entity')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Configuration de la connexion Pico ──────────────────────────────────────
-- Stocke l'URL du Raspberry Pi Pico utilisé pour écrire sur les puces NFC
-- Une seule ligne par installation (upsert sur id = 'singleton')
-- Référence: feature-nfc.md § /gm/nfc/pico
CREATE TABLE nfc_pico_config (
  id            TEXT PRIMARY KEY DEFAULT 'singleton',  -- Une seule entrée (singleton pattern)
  endpoint_url  TEXT,           -- URL du Pico (ex: "http://192.168.1.42/write")
  last_tested_at TIMESTAMPTZ,   -- Dernière vérification de connexion réussie
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE nfc_pico_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pico_config_gm_all" ON nfc_pico_config
  FOR ALL USING (auth.role() = 'authenticated');
-- Note: NFC_SECRET est une variable d'environnement serveur (jamais stockée en BDD)

ALTER TABLE nfc_entity_types ENABLE ROW LEVEL SECURITY;
CREATE POLICY "nfc_types_public_read" ON nfc_entity_types FOR SELECT USING (true);
CREATE POLICY "nfc_types_gm_write" ON nfc_entity_types
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "nfc_types_gm_update" ON nfc_entity_types
  FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "nfc_types_gm_delete" ON nfc_entity_types
  FOR DELETE USING (auth.role() = 'authenticated');
```

---

## Migration 008 — Entités de scène enrichies

```sql
-- ─── Étendre scene_entities ──────────────────────────────────────────────────
-- Référence: feature-enemies.md § 4, feature-initiative.md, feature-live-stats-dragdrop.md

-- Étendre l'enum type pour inclure les personnages joueurs
-- (DROP + re-ADD car PostgreSQL ne supporte pas ALTER CHECK directement)
ALTER TABLE scene_entities DROP CONSTRAINT scene_entities_type_check;
ALTER TABLE scene_entities ADD CONSTRAINT scene_entities_type_check
  CHECK (type IN ('enemy', 'npc', 'combatant', 'character', 'item', 'zone'));
-- Note: 'enemy' et 'npc' maintenus pour compatibilité avec données existantes.
-- Les nouvelles entités utilisent 'combatant' (enemies+npcs) ou 'character' (PJ)

-- Référence vers la fiche ennemi/PNJ (null pour items et zones)
ALTER TABLE scene_entities
  ADD COLUMN combatant_id    UUID REFERENCES combatants(id) ON DELETE SET NULL,
  -- Référence vers le personnage joueur (null pour ennemis/items/zones)
  ADD COLUMN character_id    UUID REFERENCES characters(id) ON DELETE SET NULL,
  -- Référence vers un objet du catalogue (null pour ennemis/personnages/zones)
  ADD COLUMN item_id         UUID REFERENCES campaign_items(id) ON DELETE SET NULL;

-- Stats de combat (colonnes dédiées pour les ennemis/PNJ — pas de JSONB)
ALTER TABLE scene_entities
  ADD COLUMN endurance_current  INTEGER,   -- HP courants (initialisé à combatants.endurance)
  ADD COLUMN wounds_received    INTEGER DEFAULT 0, -- Blessures reçues
  ADD COLUMN hatred_current     INTEGER,   -- Points haine/détermination restants
  ADD COLUMN is_defeated        BOOLEAN NOT NULL DEFAULT FALSE;

-- Initiative (fil de combat)
ALTER TABLE scene_entities
  ADD COLUMN in_combat        BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN initiative_order INTEGER,          -- Position dans le fil (1 = premier, null = hors combat)
  ADD COLUMN is_current_turn  BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX ON scene_entities(combatant_id);
CREATE INDEX ON scene_entities(character_id);
-- Index composite pour les queries Realtime filtrées sur (scene_id, visible_to_players)
CREATE INDEX ON scene_entities(scene_id, visible_to_players);
```

---

## Migration 009 — Overlays & Annonces session

```sql
-- ─── Overlays TV ─────────────────────────────────────────────────────────────
-- Référence: feature-display-tv.md § Overlay
CREATE TABLE overlays (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id   UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  type         TEXT NOT NULL
    CHECK (type IN ('character', 'combatant', 'item', 'text', 'image')),
  -- ID de l'entité référencée selon le type:
  -- character → characters.id, combatant → combatants.id, item → campaign_items.id
  reference_id UUID,
  -- reference_id est un UUID générique sans FK déclarée (pas de table de dispatch possible).
  -- L'intégrité référentielle est validée côté serveur dans POST /api/session/[id]/overlays :
  -- type='character' → vérifier characters.id, type='combatant' → combatants.id, type='item' → campaign_items.id
  -- Contenu libre (texte ou URL image) pour types 'text' et 'image'
  content      JSONB,  -- Ex: { "text": "...", "url": "..." }
  is_featured  BOOLEAN NOT NULL DEFAULT FALSE,  -- Au premier plan (mis en évidence)
  position     INTEGER NOT NULL DEFAULT 0,       -- Ordre dans la pile
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Annonces & Messages session ─────────────────────────────────────────────
-- Référence: feature-player-view.md § 7, feature-display-tv.md § Annonces,
--            feature-session-panel.md § Chat & Annonces
CREATE TABLE session_announcements (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  -- 'gm_message' = saisie manuelle MJ (visible joueurs/TV selon target)
  -- 'app_event'  = généré automatiquement par le serveur (combat démarré, loot, etc.)
  type       TEXT NOT NULL DEFAULT 'gm_message'
    CHECK (type IN ('gm_message', 'app_event')),
  message    TEXT NOT NULL,
  target     TEXT NOT NULL DEFAULT 'all'
    CHECK (target IN ('players', 'tv', 'all')),
    -- Pour app_event : toujours 'all' (diffusion globale)
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX ON overlays(session_id);
CREATE INDEX ON session_announcements(session_id, created_at DESC);

ALTER TABLE overlays              ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "overlays_gm_all" ON overlays FOR ALL
  USING (session_id IN (
    SELECT s.id FROM sessions s
    JOIN campaigns c ON c.id = s.campaign_id
    WHERE c.gm_user_id = auth.uid()
  ));

CREATE POLICY "announcements_gm_all" ON session_announcements FOR ALL
  USING (session_id IN (
    SELECT s.id FROM sessions s
    JOIN campaigns c ON c.id = s.campaign_id
    WHERE c.gm_user_id = auth.uid()
  ));

-- Realtime activé pour la TV et les joueurs
ALTER PUBLICATION supabase_realtime ADD TABLE overlays;
ALTER PUBLICATION supabase_realtime ADD TABLE session_announcements;
ALTER PUBLICATION supabase_realtime ADD TABLE characters;
-- ⚠️ IMPORTANT (Supabase Realtime v2): Le RLS s'applique aussi aux événements Realtime.
-- Les joueurs anonymes (rôle 'anon') ne reçoivent des events characters que si
-- une policy SELECT leur autorise la lecture. Deux options:
-- Option A (recommandée): le joueur souscrit via le server endpoint (pas directement anon)
-- Option B: ajouter une policy "characters_public_read" limitée aux colonnes non-sensibles
--   → Non supporté par Supabase RLS (colonne-level policies inexistantes)
-- Conclusion: la souscription characters doit passer par un channel authentifié
-- ou les données sensibles doivent être filtrées côté serveur. Voir architecture.md.
```

---

## Migration 010 — Système de voyage

```sql
-- ─── Cartes hexagonales (globales) ───────────────────────────────────────────
-- Référence: feature-journey.md § Modèle de données
-- NOTE: journey_maps est une table GLOBALE (pas par campagne).
-- On utilise background_image_url (TEXT) plutôt qu'une FK vers campaign_media
-- pour éviter de coupler une table globale à une table campaign-scoped.
CREATE TABLE journey_maps (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                 TEXT NOT NULL,      -- Ex: "Les Terres Sauvages de Rhovanion"
  background_image_url TEXT,               -- URL directe (Supabase Storage ou externe)
  -- Dimensions de la grille (calculées depuis taille image + hex_size)
  grid_width          INTEGER NOT NULL DEFAULT 20,
  grid_height         INTEGER NOT NULL DEFAULT 15,
  hex_size            INTEGER NOT NULL DEFAULT 50,    -- Taille d'un hex en pixels
  grid_offset_x       FLOAT NOT NULL DEFAULT 0,       -- Décalage horizontal sur l'image
  grid_offset_y       FLOAT NOT NULL DEFAULT 0,       -- Décalage vertical sur l'image
  default_start_hex   JSONB NOT NULL DEFAULT '{"q": 0, "r": 0}'::jsonb,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Cases de la grille (hexes) ──────────────────────────────────────────────
CREATE TABLE hex_tiles (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  map_id       UUID NOT NULL REFERENCES journey_maps(id) ON DELETE CASCADE,
  q            INTEGER NOT NULL,   -- Coordonnée axiale q (colonne)
  r            INTEGER NOT NULL,   -- Coordonnée axiale r (ligne)
  terrain_type TEXT NOT NULL DEFAULT 'plain'
    CHECK (terrain_type IN ('road', 'plain', 'hills', 'light_forest', 'dense_forest', 'marsh', 'mountain', 'hostile_mountain')),
  -- Jours pour traverser (défaut depuis terrain_type, overridable par hex)
  -- Valeurs par défaut: road=1, plain=1, hills=2, light_forest=2, dense_forest=3, marsh=3, mountain=4, hostile_mountain=5
  days_cost    INTEGER NOT NULL DEFAULT 1 CHECK (days_cost > 0),
  danger_level TEXT NOT NULL DEFAULT 'standard'
    CHECK (danger_level IN ('standard', 'risky', 'dire')),
  passable     BOOLEAN NOT NULL DEFAULT TRUE,   -- false = infranchissable (ignoré par pathfinding)
  label        TEXT,           -- Nom affiché sur la TV (ex: "Fond de la Forêt Noire")
  poi_type     TEXT            -- Point d'intérêt: 'city'|'ruin'|'fort'|'lair'|'cave'|'other'
    CHECK (poi_type IN ('city', 'ruin', 'fort', 'lair', 'cave', 'other')),
  poi_hidden   BOOLEAN NOT NULL DEFAULT FALSE,  -- true = POI non visible sur TV jusqu'à révélation MJ
  UNIQUE (map_id, q, r)
);

-- ─── Voyages (une instance = une scène de type voyage) ────────────────────────
CREATE TABLE journeys (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id         UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  campaign_id        UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  map_id             UUID NOT NULL REFERENCES journey_maps(id),
  -- Positions (coordonnées axiales)
  start_hex          JSONB NOT NULL,              -- { q, r }
  destination_hex    JSONB NOT NULL,              -- { q, r }
  planned_path       JSONB NOT NULL DEFAULT '[]'::jsonb,  -- [{ q, r }, ...]
  actual_path        JSONB NOT NULL DEFAULT '[]'::jsonb,  -- [{ q, r }, ...] (chemin réellement parcouru)
  current_hex        JSONB NOT NULL,              -- { q, r } position actuelle
  -- Rôles assignés aux personnages
  roles              JSONB NOT NULL DEFAULT '{}'::jsonb,
  -- Ex: { "guide": "char-uuid", "scout": ["char-uuid"], "lookout": "char-uuid", "hunter": "char-uuid" }
  -- Calcul du voyage
  total_days         INTEGER NOT NULL DEFAULT 0,
  days_elapsed       INTEGER NOT NULL DEFAULT 0,
  -- Dates in-game
  start_date         JSONB NOT NULL,              -- { year, month, day }
  current_date       JSONB NOT NULL,              -- { year, month, day }
  estimated_end_date JSONB NOT NULL,              -- { year, month, day } (recalculé si "Perdus")
  status             TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'completed', 'abandoned')),
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_updated_at_journeys
  BEFORE UPDATE ON journeys
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── Étapes de voyage (1 étape = 7 jours de voyage) ──────────────────────────
CREATE TABLE journey_stages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  journey_id      UUID NOT NULL REFERENCES journeys(id) ON DELETE CASCADE,
  stage_number    INTEGER NOT NULL,      -- 1, 2, 3...
  day_start       INTEGER NOT NULL,      -- Jour de début (ex: 8)
  day_end         INTEGER NOT NULL,      -- Jour de fin (ex: 14)
  hex_at_stage    JSONB NOT NULL,        -- { q, r } position à la fin de cette étape
  in_universe_date JSONB NOT NULL,       -- { year, month, day } à cette étape
  danger_level    TEXT NOT NULL DEFAULT 'standard'
    CHECK (danger_level IN ('standard', 'risky', 'dire')),
  -- Jets de dés des personnages avec rôle
  -- [{ character_id, role, skill_key, total, feat_die, eye_of_sauron }]
  rolls           JSONB NOT NULL DEFAULT '[]'::jsonb,
  status          TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'resolved')),
  UNIQUE (journey_id, stage_number)
);

-- ─── Événements de voyage ─────────────────────────────────────────────────────
-- Déclenchés par un Œil de Sauron sur le dé-destin
CREATE TABLE journey_events (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stage_id              UUID NOT NULL REFERENCES journey_stages(id) ON DELETE CASCADE,
  journey_id            UUID NOT NULL REFERENCES journeys(id) ON DELETE CASCADE,
  event_type            TEXT NOT NULL
    CHECK (event_type IN ('ill_health', 'mishap', 'foul_weather', 'shadow_fell', 'encounter', 'loss_of_way')),
  triggered_by          UUID REFERENCES characters(id) ON DELETE SET NULL,  -- Personnage qui a roulé l'Œil
  affected_scope        TEXT NOT NULL
    CHECK (affected_scope IN ('individual', 'full_party')),
  affected_character_id UUID REFERENCES characters(id) ON DELETE SET NULL,  -- null si full_party
  consequence_type      TEXT NOT NULL
    CHECK (consequence_type IN ('fatigue', 'shadow', 'endurance', 'days_added', 'rp_only')),
  consequence_value     INTEGER NOT NULL DEFAULT 0,  -- Ex: 2 pour +2 Fatigue
  applied               BOOLEAN NOT NULL DEFAULT FALSE,  -- Conséquence appliquée sur la fiche ?
  notes                 TEXT,  -- Surtout pour les rencontres (événement RP)
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Indexes ─────────────────────────────────────────────────────────────────
CREATE INDEX ON journey_maps(name);
CREATE INDEX ON hex_tiles(map_id);
CREATE INDEX ON hex_tiles(map_id, q, r);
CREATE INDEX ON journeys(session_id);
CREATE INDEX ON journeys(campaign_id);
CREATE INDEX ON journeys(status);
-- Index composite pour les queries TV (session en cours + voyage actif)
CREATE INDEX ON journeys(session_id, status);
CREATE INDEX ON journey_stages(journey_id, status);
CREATE INDEX ON journey_stages(journey_id);
CREATE INDEX ON journey_events(journey_id);
CREATE INDEX ON journey_events(stage_id);

-- ─── RLS ─────────────────────────────────────────────────────────────────────
ALTER TABLE journey_maps    ENABLE ROW LEVEL SECURITY;
ALTER TABLE hex_tiles       ENABLE ROW LEVEL SECURITY;
ALTER TABLE journeys        ENABLE ROW LEVEL SECURITY;
ALTER TABLE journey_stages  ENABLE ROW LEVEL SECURITY;
ALTER TABLE journey_events  ENABLE ROW LEVEL SECURITY;

-- Cartes hex: globales, lecture publique, écriture MJ authentifié
CREATE POLICY "journey_maps_public_read" ON journey_maps FOR SELECT USING (true);
CREATE POLICY "journey_maps_gm_write" ON journey_maps
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "journey_maps_gm_update" ON journey_maps
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "hex_tiles_public_read" ON hex_tiles FOR SELECT USING (true);
CREATE POLICY "hex_tiles_gm_all" ON hex_tiles FOR ALL USING (auth.role() = 'authenticated');

-- NOTE SÉCURITÉ: journey_maps est une table globale — tout MJ authentifié peut modifier
-- les tiles de n'importe quelle carte, y compris celles créées par d'autres MJ.
-- Acceptable en contexte mono-usage (chaque installation = un seul MJ ou groupe).
-- Si multi-tenant strict requis : ajouter created_by UUID REFERENCES auth.users(id).

-- Voyages: liés à une session/campagne du MJ
CREATE POLICY "journeys_gm_all" ON journeys FOR ALL
  USING (campaign_id IN (SELECT id FROM campaigns WHERE gm_user_id = auth.uid()));
CREATE POLICY "journey_stages_gm_all" ON journey_stages FOR ALL
  USING (journey_id IN (
    SELECT j.id FROM journeys j
    JOIN campaigns c ON c.id = j.campaign_id
    WHERE c.gm_user_id = auth.uid()
  ));
CREATE POLICY "journey_events_gm_all" ON journey_events FOR ALL
  USING (journey_id IN (
    SELECT j.id FROM journeys j
    JOIN campaigns c ON c.id = j.campaign_id
    WHERE c.gm_user_id = auth.uid()
  ));

-- Realtime pour le mode Voyage TV
ALTER PUBLICATION supabase_realtime ADD TABLE journeys;
ALTER PUBLICATION supabase_realtime ADD TABLE journey_stages;
ALTER PUBLICATION supabase_realtime ADD TABLE journey_events;
```

---

## Tableau de référence complet des tables

### Tables globales (système de jeu)

| Table | Clé | Description |
|---|---|---|
| `game_system_havens` | `id` | Havres TOR (Dale, Fondcombe…) |
| `cultures` | `id` | Cultures joueurs (Bardide, Nain…) |
| `virtues` | `id` | Vertus ordinaires (Sagesse rang 1+) |
| `cultural_virtues` | `id`, `culture_id` | Vertus culturelles (Sagesse rang 2+) |
| `rewards` | `id` | Récompenses (Vaillance) |
| `nfc_entity_types` | `id` | Schémas d'entités NFC |
| `journey_maps` | `id` | Cartes hexagonales globales |
| `hex_tiles` | `id`, `map_id` | Cases de la grille |

### Tables par campagne

| Table | Clé | FK | Description |
|---|---|---|---|
| `campaigns` | `id` | `gm_user_id` → auth.users | Campagnes du MJ |
| `campaign_weapons` | `id` | `campaign_id` | Catalogue armes |
| `campaign_armors` | `id` | `campaign_id` | Catalogue armures/casques/boucliers |
| `campaign_items` | `id` | `campaign_id`, `media_id` | Catalogue objets (loot, attirail) |
| `campaign_media` | `id` | `campaign_id` | Bibliothèque d'images |
| `nfc_image_mappings` | `id` | `campaign_id`, `media_id` | Mappings famille×rareté → image |
| `combatants` | `id` | `campaign_id` | Fiches ennemis & PNJ |
| `combatant_combat_skills` | `id` | `combatant_id` | Compétences de combat |
| `combatant_fearsome_abilities` | `id` | `combatant_id` | Capacités redoutables |
| `enemy_loot_table` | `id` | `combatant_id`, `item_id` | Table de loot par ennemi |
| `npc_inventory` | `id` | `combatant_id`, `item_id` | Inventaire des PNJ |
| `characters` | `id` | `campaign_id`, `culture_id` | Fiches personnages joueurs |

### Tables par session

| Table | Clé | FK | Description |
|---|---|---|---|
| `sessions` | `id` | `campaign_id` | Sessions de jeu |
| `session_participants` | `id` | `session_id`, `character_id` | Joueurs anonymes |
| `scenes` | `id` | `session_id` | Scènes d'une session |
| `scene_entities` | `id` | `scene_id`, `combatant_id`, `character_id`, `item_id` | Tokens sur la battlemap |
| `overlays` | `id` | `session_id` | Overlays actifs sur TV |
| `session_announcements` | `id` | `session_id` | Annonces MJ |
| `journeys` | `id` | `session_id`, `campaign_id`, `map_id` | Voyages en cours |
| `journey_stages` | `id` | `journey_id` | Étapes de voyage |
| `journey_events` | `id` | `stage_id`, `journey_id` | Événements voyage |

---

## Règles importantes

### Invariants applicatifs (validés côté serveur, pas SQL)

| Règle | Explication |
|---|---|
| `combatants.kind = 'npc'` → `hatred_type = 'détermination'` | Forcé par le server endpoint de création |
| Un seul `scene_entities.is_current_turn = true` par scène | Géré par les endpoints combat |
| `characters.data.sagesse.rank = len(sagesse.virtues)` | Maintenu par les endpoints level-up |
| `characters.data.vaillance.rank = len(vaillance.rewards)` | Maintenu par les endpoints level-up |
| Rang Sagesse 1 → vertu ordinaire uniquement | Validé par `/api/characters/[id]/level-up` |

### Données JSONB vs colonnes dédiées

| Table | Champ | Approche | Pourquoi |
|---|---|---|---|
| `characters` | Toutes les stats TOR | JSONB (`data`) | Structure riche, évolutive |
| `scene_entities` | Stats de combat (endurance, wounds, hatred) | Colonnes dédiées | Realtime updates ciblés, moins de réécriture |
| `scene_entities` | Position | JSONB (`position: {x, y}`) | Converti en % pour indépendance résolution |
| `campaigns` | Dates in-game | JSONB (`{year, month, day}`) | Calendrier TOR simplifié |
| `journeys` | Chemins, rôles | JSONB | Tableaux dynamiques |

### Realtime — tables publiées

```sql
-- Déjà publiées (001_initial_schema.sql):
-- sessions, scenes, scene_entities, session_participants

-- Ajoutées par les migrations suivantes:
-- characters, overlays, session_announcements, journeys, journey_stages, journey_events
```

### Policies RLS requises pour Realtime v2 (joueurs anonymes)

En Supabase Realtime v2, le RLS s'applique aux événements Realtime. Les policies suivantes
sont requises pour que les clients anon reçoivent les mises à jour en temps réel :

```sql
-- ⚠️ À ajouter dans une migration dédiée (011_realtime_policies.sql)

-- sessions: lecture publique requise pour Realtime joueur + TV
-- (à vérifier : si 001_initial_schema.sql ne la crée pas déjà)
CREATE POLICY "sessions_public_read" ON sessions FOR SELECT USING (true);

-- scene_entities: les joueurs et la TV voient seulement les entités visibles
CREATE POLICY "scene_entities_player_read" ON scene_entities
  FOR SELECT USING (visible_to_players = true);

-- session_announcements: lecture publique (filtrée par session_id dans le canal Realtime)
CREATE POLICY "announcements_public_read" ON session_announcements
  FOR SELECT USING (true);

-- journeys + journey_stages: lecture publique pour la TV en mode voyage
CREATE POLICY "journeys_public_read" ON journeys FOR SELECT USING (true);
CREATE POLICY "journey_stages_public_read" ON journey_stages FOR SELECT USING (true);

-- characters: NE PAS créer de policy public SELECT (données sensibles : data JSONB complet).
-- Le joueur souscrit à Realtime pour recevoir l'event "character updated",
-- puis appelle GET /api/characters/[id] (server endpoint avec validateParticipant).
-- La souscription Realtime sur characters ne recevra pas de données sans policy —
-- c'est intentionnel : l'event sert de trigger, pas de payload.
```

### Mises à jour JSONB ciblées

Pour éviter de réécrire tout le JSONB `characters.data` à chaque changement de stat :

```sql
-- Mise à jour ciblée d'un champ JSONB
UPDATE characters
SET data = jsonb_set(data, '{current_endurance}', '14'::jsonb)
WHERE id = $1;

-- Mise à jour multiple
UPDATE characters
SET data = data || '{"current_endurance": 14, "current_hope": 8}'::jsonb
WHERE id = $1;
```

---

## Colonnes de référence rapide

### `scene_entities` — colonnes complètes

| Colonne | Type | Description |
|---|---|---|
| `id` | uuid PK | — |
| `scene_id` | uuid FK → scenes | — |
| `type` | text | `enemy`/`npc` (legacy) / `combatant`/`character`/`item`/`zone` |
| `name` | text | Nom affiché |
| `data` | jsonb | Données génériques (héritage) |
| `position` | jsonb | `{x: 0-100, y: 0-100}` en % de la battlemap |
| `visible_to_players` | boolean | Visible sur TV et téléphones joueurs |
| `combatant_id` | uuid FK\|null | → combatants |
| `character_id` | uuid FK\|null | → characters (pour tokens PJ) |
| `item_id` | uuid FK\|null | → campaign_items |
| `endurance_current` | integer\|null | HP courants (ennemis/PNJ) |
| `wounds_received` | integer\|null | Blessures reçues |
| `hatred_current` | integer\|null | Points haine/détermination restants |
| `is_defeated` | boolean | Vaincu → déclenche résolution loot |
| `in_combat` | boolean | Participe au fil d'initiative |
| `initiative_order` | integer\|null | Position dans le fil (1=premier) |
| `is_current_turn` | boolean | C'est son tour |
| `created_at` | timestamptz | — |
| `updated_at` | timestamptz | Auto-updated |

### `characters` — colonnes complètes

| Colonne | Type | Description |
|---|---|---|
| `id` | uuid PK | — |
| `campaign_id` | uuid FK → campaigns | — |
| `culture_id` | uuid FK\|null → cultures | — |
| `name` | text | Nom du personnage |
| `player_name` | text | Nom du joueur |
| `portrait_url` | text\|null | URL image (Media Library) |
| `data` | jsonb | TORCharacterData complet (voir types.md) |
| `created_at` | timestamptz | — |
| `updated_at` | timestamptz | Auto-updated |
