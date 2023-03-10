import { getDatabase } from '../database.js'
import { withLazyStatic, lazyStatic } from 'extra-lazy'

export const getAllRateLimiterIds = withLazyStatic((): string[] => {
  const result = lazyStatic(() => getDatabase().prepare(`
    SELECT id
      FROM geyser_rate_limiter;
  `), [getDatabase()])
    .all() as Array<{ id: string }>

  return result.map(x => x['id'])
})
