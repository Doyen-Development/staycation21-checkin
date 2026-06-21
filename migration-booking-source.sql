-- ================================================================
-- MIGRATION: Add booking_source + rename airbnb_booking_id
-- Run this in Neon SQL Editor on your EXISTING database
-- Safe to run once — does not delete any existing data
-- ================================================================

-- 1. Create the new enum for booking platforms
CREATE TYPE booking_source AS ENUM (
  'airbnb', 'booking_com', 'makemytrip', 'goibibo', 'oyo', 'direct', 'other'
);

-- 2. Add the new column with a default so existing rows don't break
ALTER TABLE checkins
  ADD COLUMN booking_source booking_source NOT NULL DEFAULT 'airbnb';

-- 3. Rename the old column to the new generic name
ALTER TABLE checkins
  RENAME COLUMN airbnb_booking_id TO booking_id;

-- 4. (Optional) re-index if you had an index on the old column name
DROP INDEX IF EXISTS idx_checkins_booking_id;
CREATE INDEX idx_checkins_booking_id ON checkins(booking_id);

-- Done. All existing rows are now marked booking_source = 'airbnb'
-- since that's all you had before this change.
