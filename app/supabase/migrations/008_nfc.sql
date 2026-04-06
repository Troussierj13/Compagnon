-- ============================================================
-- Migration 008 — NFC
-- ============================================================
-- Référence: app/docs/technical/schema.md § Migration 007

-- ─── Types d'entités NFC ─────────────────────────────────────────────────────
CREATE TABLE nfc_entity_types (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  version    INTEGER NOT NULL DEFAULT 1,
  fields     JSONB NOT NULL DEFAULT '[]'::jsonb,
  action     TEXT NOT NULL
    CHECK (action IN ('spawn_entity', 'drop_loot', 'show_overlay', 'highlight_entity')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Configuration de la connexion Pico ──────────────────────────────────────
CREATE TABLE nfc_pico_config (
  id             TEXT PRIMARY KEY DEFAULT 'singleton',
  endpoint_url   TEXT,
  last_tested_at TIMESTAMPTZ,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE nfc_pico_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pico_config_gm_all" ON nfc_pico_config
  FOR ALL USING (auth.role() = 'authenticated');

ALTER TABLE nfc_entity_types ENABLE ROW LEVEL SECURITY;
CREATE POLICY "nfc_types_public_read" ON nfc_entity_types FOR SELECT USING (true);
CREATE POLICY "nfc_types_gm_write"    ON nfc_entity_types
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "nfc_types_gm_update"   ON nfc_entity_types
  FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "nfc_types_gm_delete"   ON nfc_entity_types
  FOR DELETE USING (auth.role() = 'authenticated');
