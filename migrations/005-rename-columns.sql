--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

ALTER TABLE geyser_rate_limiter
RENAME COLUMN namespace TO id;

ALTER TABLE geyser_rate_limiter
RENAME COLUMN "limit" TO total_tokens;

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

ALTER TABLE geyser_rate_limiter
RENAME COLUMN id TO namespace;

ALTER TABLE geyser_rate_limiter
RENAME COLUMN total_tokens TO "limit";
