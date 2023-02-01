--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

-- 在WAL模式下, better-sqlite3可充分发挥性能
PRAGMA journal_mode = WAL;

-- SQLite 会将VARCHAR(255)转换为TEXT, 将BOOLEAN转换为NUMERIC, 使用这些数据类型是出于可读性考虑
-- geyser资源本身是松散的, 没有自己的表

CREATE TABLE geyser_blacklist (
  geyser_id VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE geyser_whitelist (
  geyser_id VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE geyser_token_policy (
  geyser_id              VARCHAR(255) NOT NULL UNIQUE
, acquire_token_required BOOLEAN
);

CREATE TABLE geyser_token (
  geyser_id          VARCHAR(255) NOT NULL
, token              VARCHAR(255) NOT NULL
, acquire_permission BOOLEAN      NOT NULL DEFAULT 0 CHECK(acquire_permission IN (0,1))
, UNIQUE (token, geyser_id)
);

CREATE TABLE geyser_configuration (
  geyser_id VARCHAR(255) NOT NULL UNIQUE
, duration  INTEGER
, "limit"   INTEGER
);

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

PRAGMA journal_mode = DELETE;

DROP TABLE geyser_blacklist;
DROP TABLE geyser_whitelist;
DROP TABLE geyser_token_policy;
DROP TABLE geyser_token;
DROP TABLE geyser_configuration;
