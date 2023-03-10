import { getDatabase } from '@src/database.js'
import { withLazyStatic, lazyStatic } from 'extra-lazy'

export const removeRateLimiter = withLazyStatic((id: string): void => {
  lazyStatic(() => getDatabase().prepare(`
    DELETE FROM geyser_rate_limiter
     WHERE id = $id;
  `), [getDatabase()])
    .run({ id })
})
