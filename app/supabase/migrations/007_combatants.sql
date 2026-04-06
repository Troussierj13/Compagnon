-- ============================================================
-- Migration 007 — Ennemis & PNJ
-- ============================================================
-- Référence: app/docs/technical/schema.md § Migration 006

-- ─── Combatants (ennemis + PNJ unifiés) ──────────────────────────────────────
CREATE TABLE combatants (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id      UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  kind             TEXT NOT NULL CHECK (kind IN ('enemy', 'npc')),
  name             TEXT NOT NULL,
  subname          TEXT,
  traits           TEXT[],
  family           TEXT,
  rarity           TEXT NOT NULL DEFAULT 'common'
    CHECK (rarity IN ('common', 'uncommon', 'rare', 'legendary')),
  artwork_url      TEXT,
  notes            TEXT,
  attribute_level  INTEGER NOT NULL DEFAULT 3,
  endurance        INTEGER NOT NULL CHECK (endurance > 0),
  power            INTEGER NOT NULL DEFAULT 1 CHECK (power > 0),
  hatred_type      TEXT NOT NULL DEFAULT 'détermination'
    CHECK (hatred_type IN ('haine', 'détermination')),
  hatred_value     INTEGER NOT NULL DEFAULT 0 CHECK (hatred_value >= 0),
  parry            INTEGER NOT NULL DEFAULT 0 CHECK (parry >= 0),
  armor            INTEGER NOT NULL DEFAULT 0 CHECK (armor >= 0),
  wound_threshold  INTEGER NOT NULL DEFAULT 1 CHECK (wound_threshold IN (1, 2)),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_updated_at_combatants
  BEFORE UPDATE ON combatants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── Compétences de combat ────────────────────────────────────────────────────
CREATE TABLE combatant_combat_skills (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  combatant_id       UUID NOT NULL REFERENCES combatants(id) ON DELETE CASCADE,
  name               TEXT NOT NULL,
  level              INTEGER NOT NULL,
  damage             INTEGER NOT NULL,
  piercing_threshold INTEGER,
  sort_order         INTEGER NOT NULL DEFAULT 0
);

-- ─── Capacités redoutables ────────────────────────────────────────────────────
CREATE TABLE combatant_fearsome_abilities (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  combatant_id UUID NOT NULL REFERENCES combatants(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  description  TEXT NOT NULL,
  sort_order   INTEGER NOT NULL DEFAULT 0
);

-- ─── Table de loot des ennemis ────────────────────────────────────────────────
CREATE TABLE enemy_loot_table (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  combatant_id  UUID NOT NULL REFERENCES combatants(id) ON DELETE CASCADE,
  item_id       UUID NOT NULL REFERENCES campaign_items(id) ON DELETE CASCADE,
  probability   INTEGER NOT NULL DEFAULT 100 CHECK (probability BETWEEN 1 AND 100),
  quantity_min  INTEGER NOT NULL DEFAULT 1 CHECK (quantity_min >= 1),
  quantity_max  INTEGER NOT NULL DEFAULT 1 CHECK (quantity_max >= quantity_min)
);

-- ─── Inventaire PNJ ──────────────────────────────────────────────────────────
CREATE TABLE npc_inventory (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  combatant_id UUID NOT NULL REFERENCES combatants(id) ON DELETE CASCADE,
  item_id      UUID REFERENCES campaign_items(id) ON DELETE SET NULL,
  name         TEXT NOT NULL,
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
ALTER TABLE combatants                   ENABLE ROW LEVEL SECURITY;
ALTER TABLE combatant_combat_skills      ENABLE ROW LEVEL SECURITY;
ALTER TABLE combatant_fearsome_abilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE enemy_loot_table             ENABLE ROW LEVEL SECURITY;
ALTER TABLE npc_inventory                ENABLE ROW LEVEL SECURITY;

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
