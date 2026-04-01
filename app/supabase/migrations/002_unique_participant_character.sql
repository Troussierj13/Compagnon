-- ============================================================
-- Migration 002 — Contrainte UNIQUE sur session_participants
-- ============================================================
-- Empêche deux participants de se lier au même personnage
-- dans la même session.

ALTER TABLE session_participants
  ADD CONSTRAINT session_participants_session_character_unique
  UNIQUE NULLS NOT DISTINCT (session_id, character_id);
