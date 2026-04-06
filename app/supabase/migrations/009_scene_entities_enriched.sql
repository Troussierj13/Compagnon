-- ============================================================
-- Migration 009 — Entités de scène enrichies
-- ============================================================
-- Référence: app/docs/technical/schema.md § Migration 008

-- ─── Étendre l'enum type de scene_entities ───────────────────────────────────
ALTER TABLE scene_entities DROP CONSTRAINT scene_entities_type_check;
ALTER TABLE scene_entities ADD CONSTRAINT scene_entities_type_check
  CHECK (type IN ('enemy', 'npc', 'combatant', 'character', 'item', 'zone'));

-- ─── Références vers les fiches ──────────────────────────────────────────────
ALTER TABLE scene_entities
  ADD COLUMN combatant_id    UUID REFERENCES combatants(id) ON DELETE SET NULL,
  ADD COLUMN character_id    UUID REFERENCES characters(id) ON DELETE SET NULL,
  ADD COLUMN item_id         UUID REFERENCES campaign_items(id) ON DELETE SET NULL;

-- ─── Stats de combat ─────────────────────────────────────────────────────────
ALTER TABLE scene_entities
  ADD COLUMN endurance_current  INTEGER,
  ADD COLUMN wounds_received    INTEGER DEFAULT 0,
  ADD COLUMN hatred_current     INTEGER,
  ADD COLUMN is_defeated        BOOLEAN NOT NULL DEFAULT FALSE;

-- ─── Initiative ──────────────────────────────────────────────────────────────
ALTER TABLE scene_entities
  ADD COLUMN in_combat        BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN initiative_order INTEGER,
  ADD COLUMN is_current_turn  BOOLEAN NOT NULL DEFAULT FALSE;

-- ─── Indexes ─────────────────────────────────────────────────────────────────
CREATE INDEX ON scene_entities(combatant_id);
CREATE INDEX ON scene_entities(character_id);
CREATE INDEX ON scene_entities(scene_id, visible_to_players);
