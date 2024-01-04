--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

ALTER TABLE geyser_rate_limiter
RENAME COLUMN last_cycle_started_at TO window_started_at;

ALTER TABLE geyser_rate_limiter
RENAME COLUMN duration TO window_duration;

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

ALTER TABLE geyser_rate_limiter
RENAME COLUMN window_started_at TO last_cycle_started_at;

ALTER TABLE geyser_rate_limiter
RENAME COLUMN window_duration TO duration;
