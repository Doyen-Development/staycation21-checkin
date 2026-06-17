-- ================================================================
-- STAYCATION21 — Neon PostgreSQL Schema
-- Run this ONCE in Neon SQL Editor: console.neon.tech
-- ================================================================

CREATE TYPE checkin_status AS ENUM ('pending','verified','checked_in','checked_out');
CREATE TYPE id_type AS ENUM ('aadhaar','passport','driving_licence','voter_id','pan');

-- Main check-in table
CREATE TABLE checkins (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name        TEXT NOT NULL,
  last_name         TEXT NOT NULL,
  email             TEXT NOT NULL,
  phone             TEXT NOT NULL,
  city              TEXT,
  state             TEXT,
  checkin_date      DATE NOT NULL,
  checkout_date     DATE NOT NULL,
  airbnb_booking_id TEXT NOT NULL,
  purpose_of_visit  TEXT,
  guest_count       INTEGER NOT NULL DEFAULT 1,
  special_requests  TEXT,
  status            checkin_status NOT NULL DEFAULT 'pending',
  submitted_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Per-guest identity table (one row per guest per booking)
CREATE TABLE guest_ids (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  checkin_id   UUID NOT NULL REFERENCES checkins(id) ON DELETE CASCADE,
  guest_index  INTEGER NOT NULL,
  is_primary   BOOLEAN NOT NULL DEFAULT FALSE,
  guest_name   TEXT NOT NULL,
  id_type      id_type NOT NULL,
  id_number    TEXT NOT NULL,
  id_front_url TEXT,
  id_back_url  TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for fast admin queries
CREATE INDEX idx_checkins_status       ON checkins(status);
CREATE INDEX idx_checkins_submitted_at ON checkins(submitted_at DESC);
CREATE INDEX idx_checkins_checkin_date ON checkins(checkin_date);
CREATE INDEX idx_checkins_email        ON checkins(email);
CREATE INDEX idx_checkins_booking_id   ON checkins(airbnb_booking_id);
CREATE INDEX idx_guest_ids_checkin     ON guest_ids(checkin_id);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER checkins_updated_at
  BEFORE UPDATE ON checkins
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
