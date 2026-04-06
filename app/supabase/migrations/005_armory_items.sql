-- ============================================================
-- Migration 005 — Armurerie & catalogue d'objets
-- ============================================================
-- Référence: app/docs/technical/schema.md § Migration 004

-- ─── Armes (par campagne) ─────────────────────────────────────────────────────
CREATE TABLE campaign_weapons (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id      UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  name             TEXT NOT NULL,
  dmg              INTEGER NOT NULL DEFAULT 0,
  injury_one_hand  INTEGER NOT NULL DEFAULT 20,
  injury_two_hand  INTEGER NOT NULL DEFAULT 20,
  weight           INTEGER NOT NULL DEFAULT 0,
  notes            TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Armures, casques, boucliers (par campagne) ───────────────────────────────
CREATE TABLE campaign_armors (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id  UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  type         TEXT NOT NULL CHECK (type IN ('armor', 'helm', 'shield')),
  name         TEXT NOT NULL,
  protection   INTEGER,
  parade_bonus INTEGER,
  weight       INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Catalogue d'objets (par campagne) ───────────────────────────────────────
CREATE TABLE campaign_items (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id  UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  description  TEXT,
  type         TEXT NOT NULL DEFAULT 'item'
    CHECK (type IN ('item', 'weapon', 'armor', 'consumable', 'currency', 'crafting_component')),
  rarity       TEXT NOT NULL DEFAULT 'common'
    CHECK (rarity IN ('common', 'uncommon', 'rare', 'legendary')),
  media_id     UUID,
  unit         TEXT,
  craft_tags   TEXT[],
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
