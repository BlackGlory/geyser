import { getDatabase } from '@src/database.js'
import { withLazyStatic, lazyStatic } from 'extra-lazy'
import { IRateLimiterConfiguration } from '@src/contract.js'

export const setRateLimiterConfiguration = withLazyStatic((
  id: string
, config: IRateLimiterConfiguration
): void => {
  lazyStatic(() => getDatabase().prepare(`
    INSERT INTO geyser_rate_limiter (id, duration, total_tokens)
    VALUES ($id, $duration, $totalTokens)
        ON CONFLICT(id)
        DO UPDATE SET duration = $duration
                    , total_tokens = $totalTokens;
  `), [getDatabase()])
    .run({
      id
    , duration: config.duration
    , totalTokens: config.limit
    })
})
