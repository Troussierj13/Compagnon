-- ============================================================
-- Migration 010 — Overlays & Annonces session
-- ============================================================
-- Référence: app/docs/technical/schema.md § Migration 009

-- ─── Overlays TV ─────────────────────────────────────────────────────────────
CREATE TABLE overlays (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id   UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  type         TEXT NOT NULL
    CHECK (type IN ('character', 'combatant', 'item', 'text', 'image')),
  reference_id UUID,
  content      JSONB,
  is_featured  BOOLEAN NOT NULL DEFAULT FALSE,
  position     INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Annonces & Messages session ─────────────────────────────────────────────
CREATE TABLE session_announcements (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  type       TEXT NOT NULL DEFAULT 'gm_message'
    CHECK (type IN ('gm_message', 'app_event')),
  message    TEXT NOT NULL,
  target     TEXT NOT NULL DEFAULT 'all'
    CHECK (target IN ('players', 'tv', 'all')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Indexes ─────────────────────────────────────────────────────────────────
CREATE INDEX ON overlays(session_id);
CREATE INDEX ON session_announcements(session_id, created_at DESC);

-- ─── RLS ─────────────────────────────────────────────────────────────────────
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

-- ─── Realtime ─────────────────────────────────────────────────────────────────
ALTER PUBLICATION supabase_realtime ADD TABLE overlays;
ALTER PUBLICATION supabase_realtime ADD TABLE session_announcements;
ALTER PUBLICATION supabase_realtime ADD TABLE characters;
