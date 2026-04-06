-- ============================================================
-- Migration 011 — Système de voyage
-- ============================================================
-- Référence: app/docs/technical/schema.md § Migration 010

-- ─── Cartes hexagonales (globales) ───────────────────────────────────────────
CREATE TABLE journey_maps (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                 TEXT NOT NULL,
  background_image_url TEXT,
  grid_width           INTEGER NOT NULL DEFAULT 20,
  grid_height          INTEGER NOT NULL DEFAULT 15,
  hex_size             INTEGER NOT NULL DEFAULT 50,
  grid_offset_x        FLOAT NOT NULL DEFAULT 0,
  grid_offset_y        FLOAT NOT NULL DEFAULT 0,
  default_start_hex    JSONB NOT NULL DEFAULT '{"q": 0, "r": 0}'::jsonb,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Cases de la grille (hexes) ──────────────────────────────────────────────
CREATE TABLE hex_tiles (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  map_id       UUID NOT NULL REFERENCES journey_maps(id) ON DELETE CASCADE,
  q            INTEGER NOT NULL,
  r            INTEGER NOT NULL,
  terrain_type TEXT NOT NULL DEFAULT 'plain'
    CHECK (terrain_type IN ('road', 'plain', 'hills', 'light_forest', 'dense_forest', 'marsh', 'mountain', 'hostile_mountain')),
  days_cost    INTEGER NOT NULL DEFAULT 1 CHECK (days_cost > 0),
  danger_level TEXT NOT NULL DEFAULT 'standard'
    CHECK (danger_level IN ('standard', 'risky', 'dire')),
  passable     BOOLEAN NOT NULL DEFAULT TRUE,
  label        TEXT,
  poi_type     TEXT
    CHECK (poi_type IN ('city', 'ruin', 'fort', 'lair', 'cave', 'other')),
  poi_hidden   BOOLEAN NOT NULL DEFAULT FALSE,
  UNIQUE (map_id, q, r)
);

-- ─── Voyages ─────────────────────────────────────────────────────────────────
CREATE TABLE journeys (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id         UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  campaign_id        UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  map_id             UUID NOT NULL REFERENCES journey_maps(id),
  start_hex          JSONB NOT NULL,
  destination_hex    JSONB NOT NULL,
  planned_path       JSONB NOT NULL DEFAULT '[]'::jsonb,
  actual_path        JSONB NOT NULL DEFAULT '[]'::jsonb,
  current_hex        JSONB NOT NULL,
  roles              JSONB NOT NULL DEFAULT '{}'::jsonb,
  total_days         INTEGER NOT NULL DEFAULT 0,
  days_elapsed       INTEGER NOT NULL DEFAULT 0,
  start_date         JSONB NOT NULL,
  in_universe_date   JSONB NOT NULL,
  estimated_end_date JSONB NOT NULL,
  status             TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'completed', 'abandoned')),
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_updated_at_journeys
  BEFORE UPDATE ON journeys
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── Étapes de voyage ─────────────────────────────────────────────────────────
CREATE TABLE journey_stages (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  journey_id       UUID NOT NULL REFERENCES journeys(id) ON DELETE CASCADE,
  stage_number     INTEGER NOT NULL,
  day_start        INTEGER NOT NULL,
  day_end          INTEGER NOT NULL,
  hex_at_stage     JSONB NOT NULL,
  in_universe_date JSONB NOT NULL,
  danger_level     TEXT NOT NULL DEFAULT 'standard'
    CHECK (danger_level IN ('standard', 'risky', 'dire')),
  rolls            JSONB NOT NULL DEFAULT '[]'::jsonb,
  status           TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'resolved')),
  UNIQUE (journey_id, stage_number)
);

-- ─── Événements de voyage ─────────────────────────────────────────────────────
CREATE TABLE journey_events (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stage_id              UUID NOT NULL REFERENCES journey_stages(id) ON DELETE CASCADE,
  journey_id            UUID NOT NULL REFERENCES journeys(id) ON DELETE CASCADE,
  event_type            TEXT NOT NULL
    CHECK (event_type IN ('ill_health', 'mishap', 'foul_weather', 'shadow_fell', 'encounter', 'loss_of_way')),
  triggered_by          UUID REFERENCES characters(id) ON DELETE SET NULL,
  affected_scope        TEXT NOT NULL
    CHECK (affected_scope IN ('individual', 'full_party')),
  affected_character_id UUID REFERENCES characters(id) ON DELETE SET NULL,
  consequence_type      TEXT NOT NULL
    CHECK (consequence_type IN ('fatigue', 'shadow', 'endurance', 'days_added', 'rp_only')),
  consequence_value     INTEGER NOT NULL DEFAULT 0,
  applied               BOOLEAN NOT NULL DEFAULT FALSE,
  notes                 TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Indexes ─────────────────────────────────────────────────────────────────
CREATE INDEX ON journey_maps(name);
CREATE INDEX ON hex_tiles(map_id, q, r);
CREATE INDEX ON journeys(session_id);
CREATE INDEX ON journeys(campaign_id);
CREATE INDEX ON journeys(status);
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

CREATE POLICY "journey_maps_public_read" ON journey_maps FOR SELECT USING (true);
CREATE POLICY "journey_maps_gm_write"    ON journey_maps
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "journey_maps_gm_update"   ON journey_maps
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "hex_tiles_public_read" ON hex_tiles FOR SELECT USING (true);
-- NOTE SÉCURITÉ : journey_maps est un espace partagé entre tous les MJ authentifiés
-- sur cette installation Supabase. Un MJ peut modifier les cartes d'un autre MJ.
-- Acceptable pour installation mono-MJ. Pour multi-MJ : ajouter created_by UUID
-- REFERENCES auth.users(id) sur journey_maps et filtrer les policies par created_by = auth.uid().
CREATE POLICY "hex_tiles_gm_all"      ON hex_tiles FOR ALL USING (auth.role() = 'authenticated');

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

-- ─── Realtime ─────────────────────────────────────────────────────────────────
ALTER PUBLICATION supabase_realtime ADD TABLE journeys;
ALTER PUBLICATION supabase_realtime ADD TABLE journey_stages;
ALTER PUBLICATION supabase_realtime ADD TABLE journey_events;
