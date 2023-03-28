import { getDatabase } from '../database.js'
import { withLazyStatic, lazyStatic } from 'extra-lazy'
import { IRateLimiterConfig } from '@src/contract.js'

export const getRateLimiterConfiguration = withLazyStatic((
  id: string
): IRateLimiterConfig | null => {
  const row = lazyStatic(() => getDatabase().prepare(`
    SELECT duration
         , total_tokens
      FROM geyser_rate_limiter
     WHERE id = $id;
  `), [getDatabase()])
    .get({ id }) as {
      duration: number | null
      total_tokens: number | null
    } | undefined

  if (!row) return null

  return {
    duration: row.duration
  , limit: row.total_tokens
  }
})
