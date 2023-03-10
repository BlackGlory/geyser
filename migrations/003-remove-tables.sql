--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

DROP TABLE geyser_blacklist;
DROP TABLE geyser_whitelist;
DROP TABLE geyser_token_policy;
DROP TABLE geyser_token;

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

CREATE TABLE geyser_blacklist (
  namespace VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE geyser_whitelist (
  namespace VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE geyser_token_policy (
  namespace              VARCHAR(255) NOT NULL UNIQUE
, acquire_token_required BOOLEAN
);

CREATE TABLE geyser_token (
  namespace          VARCHAR(255) NOT NULL
, token              VARCHAR(255) NOT NULL
, acquire_permission BOOLEAN      NOT NULL DEFAULT 0 CHECK(acquire_permission IN (0,1))
, UNIQUE (token, namespace)
);
