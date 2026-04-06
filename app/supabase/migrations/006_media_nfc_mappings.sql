-- ============================================================
-- Migration 006 — Bibliothèque média & mappings NFC
-- ============================================================
-- Référence: app/docs/technical/schema.md § Migration 005

-- ─── Bibliothèque d'images (par campagne) ────────────────────────────────────
CREATE TABLE campaign_media (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id  UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  category     TEXT NOT NULL DEFAULT 'other'
    CHECK (category IN ('map', 'battlemap', 'background', 'portrait', 'artwork', 'other')),
  storage_url  TEXT NOT NULL,
  file_size    INTEGER,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ajouter la FK campaign_items.media_id après création de campaign_media
ALTER TABLE campaign_items
  ADD CONSTRAINT campaign_items_media_fkey
  FOREIGN KEY (media_id) REFERENCES campaign_media(id) ON DELETE SET NULL;

-- ─── Mappings images NFC ──────────────────────────────────────────────────────
CREATE TABLE nfc_image_mappings (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  family      TEXT,
  rarity      TEXT
    CHECK (rarity IN ('common', 'uncommon', 'rare', 'legendary')),
  media_id    UUID NOT NULL REFERENCES campaign_media(id) ON DELETE CASCADE,
  -- NOTE : colonnes family et rarity sont NULLables. En PG < 15, NULL != NULL dans UNIQUE
  -- → deux lignes avec family=NULL, rarity=NULL pour la même campagne sont considérées distinctes.
  -- PG 15+ : utiliser UNIQUE NULLS NOT DISTINCT si comportement strict souhaité.
  UNIQUE (campaign_id, family, rarity)
);

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

-- NOTE SÉCURITÉ : toutes les images de campagne sont publiquement lisibles (anon).
-- Décision intentionnelle : les images sont des assets visuels non sensibles.
-- Si une campagne nécessite des images privées, retirer cette policy et distribuer via signed URLs Supabase Storage.
CREATE POLICY "campaign_media_public_read" ON campaign_media FOR SELECT USING (true);
-- NOTE SÉCURITÉ : les mappings NFC image sont publiquement lisibles (anon).
-- Nécessaire pour l'affichage TV (surface non authentifiée).
CREATE POLICY "nfc_mappings_public_read"   ON nfc_image_mappings FOR SELECT USING (true);
