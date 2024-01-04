import { getDatabase } from '@src/database.js'

interface IRawRateLimiter {
  id: string
  window_duration: number | null
  total_tokens: number | null
  used_tokens: number
  window_started_at: number | null
}

export function setRawRateLimiter<T extends IRawRateLimiter>(item: T): T {
  getDatabase().prepare(`
    INSERT INTO geyser_rate_limiter (
      id
    , window_duration
    , total_tokens
    , used_tokens
    , window_started_at
    )
    VALUES (
      $id
    , $window_duration
    , $total_tokens
    , $used_tokens
    , $window_started_at
    );
  `).run(item)

  return item
}

export function hasRawRateLimiter(id: string): boolean {
  return !!getRawRateLimiter(id)
}

export function getRawRateLimiter(id: string): IRawRateLimiter | undefined {
  const row = getDatabase().prepare(`
    SELECT *
      FROM geyser_rate_limiter
     WHERE id = $id;
  `).get({ id }) as IRawRateLimiter | undefined

  if (row) {
    return { ...row }
  } else {
    return row
  }
}
