--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

ALTER TABLE geyser_rate_limiter
ADD COLUMN used_tokens INTEGER NOT NULL DEFAULT 0;

ALTER TABLE geyser_rate_limiter
ADD COLUMN last_cycle_started_at INTEGER;

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

ALTER TABLE geyser_rate_limiter
DROP COLUMN used_tokens;

ALTER TABLE geyser_rate_limiter
DROP COLUMN last_cycle_started_at;
