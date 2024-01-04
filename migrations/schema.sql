-- 在WAL模式下, better-sqlite3可充分发挥性能
PRAGMA journal_mode = WAL;

CREATE TABLE geyser_rate_limiter (
  id                VARCHAR(255) NOT NULL UNIQUE
, window_duration   INTEGER -- 一个时间窗口的毫秒数
, total_tokens      INTEGER
, used_tokens       INTEGER      NOT NULL DEFAULT 0
, window_started_at INTEGER -- 时间窗口开始时的毫秒时间戳
);
