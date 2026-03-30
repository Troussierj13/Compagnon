-- ============================================================
-- Compagnon JdR - Schéma initial
-- ============================================================
-- À exécuter dans l'éditeur SQL de Supabase (Database > SQL Editor)
-- ou via la CLI Supabase : supabase db push
-- ============================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── Campagnes ──────────────────────────────────────────────────────────────
CREATE TABLE campaigns (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gm_user_id  UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  description TEXT,
  system      TEXT NOT NULL DEFAULT 'the-one-ring',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Personnages ─────────────────────────────────────────────────────────────
-- Le champ "data" contient la feuille de perso au format JSONB.
-- Cela permet de changer de système sans toucher au schéma.
CREATE TABLE characters (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id  UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  player_name  TEXT,
  data         JSONB NOT NULL DEFAULT '{}',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Sessions de jeu ─────────────────────────────────────────────────────────
-- Une session = une partie en cours. Le MJ crée une session depuis une campagne,
-- ce qui génère un join_code unique à 6 caractères pour les joueurs.
CREATE TABLE sessions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id     UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  join_code       TEXT UNIQUE NOT NULL,
  status          TEXT NOT NULL DEFAULT 'waiting'
                    CHECK (status IN ('waiting', 'active', 'ended')),
  active_scene_id UUID,  -- FK ajouté plus bas (après scenes)
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Scènes ──────────────────────────────────────────────────────────────────
CREATE TABLE scenes (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id   UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  description  TEXT,
  battlemap_url TEXT,  -- URL vers Supabase Storage
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- FK différée pour éviter la dépendance circulaire sessions <-> scenes
ALTER TABLE sessions
  ADD CONSTRAINT sessions_active_scene_id_fkey
  FOREIGN KEY (active_scene_id) REFERENCES scenes(id) ON DELETE SET NULL;

-- ─── Entités de scène ─────────────────────────────────────────────────────────
-- Ennemis, PNJ, objets lootés, zones de danger, etc.
CREATE TABLE scene_entities (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scene_id            UUID NOT NULL REFERENCES scenes(id) ON DELETE CASCADE,
  type                TEXT NOT NULL CHECK (type IN ('enemy', 'npc', 'item', 'zone')),
  name                TEXT NOT NULL,
  data                JSONB NOT NULL DEFAULT '{}',
  position            JSONB NOT NULL DEFAULT '{"x": 0, "y": 0}',
  visible_to_players  BOOLEAN NOT NULL DEFAULT TRUE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Participants à la session ────────────────────────────────────────────────
-- Un joueur anonyme qui rejoint avec le join_code.
-- Il peut (ou non) être lié à un personnage de la campagne.
CREATE TABLE session_participants (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id   UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  character_id UUID REFERENCES characters(id) ON DELETE SET NULL,
  player_name  TEXT NOT NULL,
  joined_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Indexes ─────────────────────────────────────────────────────────────────
CREATE INDEX idx_campaigns_gm ON campaigns(gm_user_id);
CREATE INDEX idx_characters_campaign ON characters(campaign_id);
CREATE INDEX idx_sessions_campaign ON sessions(campaign_id);
CREATE INDEX idx_sessions_join_code ON sessions(join_code);
CREATE INDEX idx_scenes_session ON scenes(session_id);
CREATE INDEX idx_scene_entities_scene ON scene_entities(scene_id);
CREATE INDEX idx_participants_session ON session_participants(session_id);

-- ─── Updated_at automatique ───────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER campaigns_updated_at
  BEFORE UPDATE ON campaigns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER characters_updated_at
  BEFORE UPDATE ON characters
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER sessions_updated_at
  BEFORE UPDATE ON sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER scene_entities_updated_at
  BEFORE UPDATE ON scene_entities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── Row Level Security (RLS) ─────────────────────────────────────────────────

ALTER TABLE campaigns          ENABLE ROW LEVEL SECURITY;
ALTER TABLE characters         ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions           ENABLE ROW LEVEL SECURITY;
ALTER TABLE scenes             ENABLE ROW LEVEL SECURITY;
ALTER TABLE scene_entities     ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_participants ENABLE ROW LEVEL SECURITY;

-- Campaigns : uniquement le MJ propriétaire
CREATE POLICY "campaigns_gm_all"
  ON campaigns FOR ALL
  USING (auth.uid() = gm_user_id);

-- Characters : le MJ de la campagne peut tout faire
CREATE POLICY "characters_gm_all"
  ON characters FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE campaigns.id = characters.campaign_id
        AND campaigns.gm_user_id = auth.uid()
    )
  );

-- Characters : lecture anonyme via session active (pour les joueurs)
CREATE POLICY "characters_player_read"
  ON characters FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM sessions s
      JOIN session_participants sp ON sp.session_id = s.id
      WHERE s.campaign_id = characters.campaign_id
        AND s.status = 'active'
        AND sp.character_id = characters.id
    )
  );

-- Sessions : le MJ peut tout faire
CREATE POLICY "sessions_gm_all"
  ON sessions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE campaigns.id = sessions.campaign_id
        AND campaigns.gm_user_id = auth.uid()
    )
  );

-- Sessions : lecture anonyme par join_code (vérifiée côté API serveur)
-- On utilise une fonction RPC pour rejoindre, donc pas de policy SELECT public ici.

-- Scenes : le MJ peut tout faire
CREATE POLICY "scenes_gm_all"
  ON scenes FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM sessions s
      JOIN campaigns c ON c.id = s.campaign_id
      WHERE s.id = scenes.session_id
        AND c.gm_user_id = auth.uid()
    )
  );

-- Scene entities : le MJ peut tout faire
CREATE POLICY "scene_entities_gm_all"
  ON scene_entities FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM scenes sc
      JOIN sessions s ON s.id = sc.session_id
      JOIN campaigns c ON c.id = s.campaign_id
      WHERE sc.id = scene_entities.scene_id
        AND c.gm_user_id = auth.uid()
    )
  );

-- Session participants : le MJ peut lire
CREATE POLICY "participants_gm_read"
  ON session_participants FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM sessions s
      JOIN campaigns c ON c.id = s.campaign_id
      WHERE s.id = session_participants.session_id
        AND c.gm_user_id = auth.uid()
    )
  );

-- ─── Storage bucket pour les battlemaps ───────────────────────────────────────
-- À créer manuellement dans Storage > New bucket : "battlemaps" (public)
-- Ou via API :
-- INSERT INTO storage.buckets (id, name, public) VALUES ('battlemaps', 'battlemaps', true);

-- ─── Realtime ─────────────────────────────────────────────────────────────────
-- Activer la réplication pour les tables qui nécessitent du temps réel.
-- À faire dans Supabase Dashboard > Database > Replication, ou via :
ALTER PUBLICATION supabase_realtime ADD TABLE sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE scenes;
ALTER PUBLICATION supabase_realtime ADD TABLE scene_entities;
ALTER PUBLICATION supabase_realtime ADD TABLE session_participants;
