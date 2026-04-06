-- ============================================================
-- Migration 003 — Système de jeu global
-- ============================================================
-- Référence: app/docs/technical/schema.md § Migration 002

-- ─── Havres (globaux) ────────────────────────────────────────────────────────
CREATE TABLE game_system_havens (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  description TEXT,
  hope_bonus  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Cultures ────────────────────────────────────────────────────────────────
CREATE TABLE cultures (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                    TEXT NOT NULL,
  description             TEXT,
  starting_attributes     JSONB NOT NULL DEFAULT '[]'::jsonb,
  endurance_bonus         INTEGER NOT NULL DEFAULT 20,
  hope_bonus              INTEGER NOT NULL DEFAULT 8,
  parade_bonus            INTEGER NOT NULL DEFAULT 12,
  starting_favored_skills TEXT[] NOT NULL DEFAULT '{}',
  starting_combat_skills  JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Vertus ordinaires ───────────────────────────────────────────────────────
CREATE TABLE virtues (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier  TEXT UNIQUE NOT NULL,
  name        TEXT NOT NULL,
  description TEXT NOT NULL,
  variants    JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Vertus culturelles ──────────────────────────────────────────────────────
CREATE TABLE cultural_virtues (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  culture_id  UUID NOT NULL REFERENCES cultures(id) ON DELETE CASCADE,
  identifier  TEXT NOT NULL,
  name        TEXT NOT NULL,
  description TEXT NOT NULL,
  variants    JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (culture_id, identifier)
);

-- ─── Récompenses ─────────────────────────────────────────────────────────────
CREATE TABLE rewards (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier     TEXT UNIQUE NOT NULL,
  name           TEXT NOT NULL,
  description    TEXT NOT NULL,
  valid_targets  TEXT[] NOT NULL DEFAULT '{}',
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

CREATE POLICY "havens_public_read"           ON game_system_havens FOR SELECT USING (true);
CREATE POLICY "cultures_public_read"         ON cultures           FOR SELECT USING (true);
CREATE POLICY "virtues_public_read"          ON virtues            FOR SELECT USING (true);
CREATE POLICY "cultural_virtues_public_read" ON cultural_virtues   FOR SELECT USING (true);
CREATE POLICY "rewards_public_read"          ON rewards            FOR SELECT USING (true);

CREATE POLICY "havens_gm_write"         ON game_system_havens FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "havens_gm_update"        ON game_system_havens FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "havens_gm_delete"        ON game_system_havens FOR DELETE USING (auth.role() = 'authenticated');
CREATE POLICY "cultures_gm_write"       ON cultures           FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "cultures_gm_update"      ON cultures           FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "cultures_gm_delete"      ON cultures           FOR DELETE USING (auth.role() = 'authenticated');
CREATE POLICY "virtues_gm_write"        ON virtues            FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "virtues_gm_update"       ON virtues            FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "virtues_gm_delete"       ON virtues            FOR DELETE USING (auth.role() = 'authenticated');
CREATE POLICY "cultural_virtues_gm_all" ON cultural_virtues   FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "rewards_gm_write"        ON rewards            FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "rewards_gm_update"       ON rewards            FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "rewards_gm_delete"       ON rewards            FOR DELETE USING (auth.role() = 'authenticated');
