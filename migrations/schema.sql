-- 在WAL模式下, better-sqlite3可充分发挥性能
PRAGMA journal_mode = WAL;

CREATE TABLE geyser_rate_limiter (
  id                    VARCHAR(255) NOT NULL UNIQUE
, duration              INTEGER -- 一个周期的毫秒数
, total_tokens          INTEGER
, used_tokens           INTEGER      NOT NULL DEFAULT 0
, last_cycle_started_at INTEGER -- 毫秒时间戳
);
