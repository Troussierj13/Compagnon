-- ============================================================
-- Migration 004 — Colonnes campagnes, personnages, sessions, scènes
-- ============================================================
-- Référence: app/docs/technical/schema.md § Migration 003

-- ─── Colonnes à ajouter sur campaigns ────────────────────────────────────────
ALTER TABLE campaigns
  ADD COLUMN start_date         JSONB,
  ADD COLUMN in_universe_date   JSONB,
  ADD COLUMN current_season     TEXT
    CHECK (current_season IN ('spring', 'summer', 'autumn', 'winter')),
  ADD COLUMN current_haven_id   UUID REFERENCES game_system_havens(id) ON DELETE SET NULL,
  ADD COLUMN travel_rules       TEXT,
  ADD COLUMN wallpaper_url      TEXT,
  ADD COLUMN session_points_adventure  INTEGER NOT NULL DEFAULT 2,
  ADD COLUMN session_points_progression INTEGER NOT NULL DEFAULT 3;

-- ─── Colonnes à ajouter sur characters ───────────────────────────────────────
ALTER TABLE characters
  ADD COLUMN culture_id   UUID REFERENCES cultures(id) ON DELETE SET NULL,
  ADD COLUMN portrait_url TEXT;

CREATE INDEX ON characters(culture_id);

-- ─── Colonnes à ajouter sur sessions ─────────────────────────────────────────
ALTER TABLE sessions
  ADD COLUMN name          TEXT NOT NULL DEFAULT 'Session',
  ADD COLUMN wallpaper_url TEXT,
  ADD COLUMN display_mode  TEXT NOT NULL DEFAULT 'waiting'
    CHECK (display_mode IN ('waiting', 'battlemap', 'travel', 'end_screen')),
  ADD COLUMN combat_active BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN combat_round  INTEGER NOT NULL DEFAULT 0;

-- ─── Colonnes à ajouter sur scenes ───────────────────────────────────────────
ALTER TABLE scenes
  ADD COLUMN scene_type    TEXT NOT NULL DEFAULT 'combat'
    CHECK (scene_type IN ('combat', 'exploration', 'journey', 'community')),
  ADD COLUMN wallpaper_url TEXT,
  ADD COLUMN sort_order    INTEGER NOT NULL DEFAULT 0;
