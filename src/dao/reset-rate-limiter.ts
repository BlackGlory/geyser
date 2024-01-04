import { getDatabase } from '@src/database.js'
import { withLazyStatic, lazyStatic } from 'extra-lazy'

export const resetRateLimiter = withLazyStatic((id: string): boolean => {
  const { changes } = lazyStatic(() => getDatabase().prepare(`
    UPDATE geyser_rate_limiter
       SET used_tokens = 0
         , window_started_at = NULL
     WHERE id = $id;
  `), [getDatabase()])
    .run({ id })

  return changes !== 0
})
