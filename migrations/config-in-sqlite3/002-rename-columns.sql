--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

ALTER TABLE geyser_blacklist
RENAME COLUMN geyser_id TO namespace;

ALTER TABLE geyser_whitelist
RENAME COLUMN geyser_id TO namespace;

ALTER TABLE geyser_token_policy
RENAME COLUMN geyser_id TO namespace;

ALTER TABLE geyser_token
RENAME COLUMN geyser_id TO namespace;

ALTER TABLE geyser_configuration
RENAME COLUMN geyser_id TO namespace;

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

ALTER TABLE geyser_blacklist
RENAME COLUMN namespace TO geyser_id;

ALTER TABLE geyser_whitelist
RENAME COLUMN namespace TO geyser_id;

ALTER TABLE geyser_token_policy
RENAME COLUMN namespace TO geyser_id;

ALTER TABLE geyser_token
RENAME COLUMN namespace TO geyser_id;

ALTER TABLE geyser_configuration
RENAME COLUMN namespace TO geyser_id;
