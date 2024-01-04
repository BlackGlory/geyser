import { getDatabase } from '@src/database.js'
import { withLazyStatic, lazyStatic } from 'extra-lazy'
import { IRateLimiterConfig } from '@src/contract.js'

export const setRateLimiterConfiguration = withLazyStatic((
  id: string
, config: IRateLimiterConfig
): void => {
  lazyStatic(() => getDatabase().prepare(`
    INSERT INTO geyser_rate_limiter (id, window_duration, total_tokens)
    VALUES ($id, $windowDuration, $totalTokens)
        ON CONFLICT(id)
        DO UPDATE SET window_duration = $windowDuration
                    , total_tokens = $totalTokens;
  `), [getDatabase()])
    .run({
      id
    , windowDuration: config.duration
    , totalTokens: config.limit
    })
})
