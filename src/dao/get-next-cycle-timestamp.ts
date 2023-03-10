import { getDatabase } from '@src/database.js'
import { withLazyStatic, lazyStatic } from 'extra-lazy'
import { RateLimiterNotFound } from '@src/errors.js'
import { isNull } from '@blackglory/prelude'

/**
 * @throws {RateLimiterNotFound}
 * @returns
 * 返回null的情况:
 * 该速率限制器没有开始过或被重置初始状态, 因此不存在下一个周期的开始时间戳.
 * 
 * 返回时间戳的情况:
 * - 时间戳可能是一个早于当前时间的值, 意味着该速率限制器在上一个周期结束后就没有再被使用过.
 * - 时间戳可能是一个晚于或等于当前时间的值.
 *   时间戳可能是`Infinity`, 这意味着本周期永远不会结束.
 */
export const getNextCycleTimestamp = withLazyStatic((id: string): number | null => {
  const row = lazyStatic(() => getDatabase().prepare(`
    SELECT last_cycle_started_at
         , duration
      FROM geyser_rate_limiter
     WHERE id = $id;
  `), [getDatabase()])
    .get({ id }) as {
      last_cycle_started_at: number | null
    , duration: number | null
    } | undefined

  if (row) {
    if (isNull(row.last_cycle_started_at)) {
      return null
    } else {
      const duration = row.duration ?? Infinity
      const lastCycleStartedAt = row.last_cycle_started_at ?? Infinity
      return lastCycleStartedAt + duration
    }
  } else {
    throw new RateLimiterNotFound()
  }
})
