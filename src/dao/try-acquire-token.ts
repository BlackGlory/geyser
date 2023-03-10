import { getDatabase } from '@src/database.js'
import { withLazyStatic, lazyStatic } from 'extra-lazy'
import { RateLimiterNotFound } from '@src/errors.js'
import { isNull, isPositiveInfinity } from '@blackglory/prelude'

export class Success {
  constructor(public readonly isFirstAcquireOfRateLimiter: boolean) {}
}
export class Unreachable {}
export class WaitForNextCycle {
  constructor(public readonly timeout: number) {}
}

/**
 * @throws {RateLimiterNotFound}
 * @returns
 * 返回Success的情况:
 * 表示获取令牌成功.
 * 
 * 返回Impossible的情况:
 * 表示获取令牌失败, 且在当前设置下不可能获取到令牌.
 * 
 * 返回Timestamp的情况:
 * 表示令牌获取失败, 但仍有可能在下个周期获取令牌, 返回的是本周期结束的时间戳.
 * 注意, 时间戳可能是`Infinity`, 这意味着本周期永远不会结束, 其含义相当于`false`.
 */
export const tryAcquireToken = withLazyStatic((
  id: string
, timestamp: number
): Success | Unreachable | WaitForNextCycle => {
  return lazyStatic(() => getDatabase().transaction((
    id: string
  , timestamp: number
  ): Success | Unreachable | WaitForNextCycle => {
    const startNewCycleStatement = lazyStatic(() => getDatabase().prepare(`
      UPDATE geyser_rate_limiter
         SET last_cycle_started_at = $timestamp
           , used_tokens = 0
       WHERE id = $id;
    `), [getDatabase()])

    const acquireStatement = lazyStatic(() => getDatabase().prepare(`
      UPDATE geyser_rate_limiter
         SET used_tokens = used_tokens + 1
       WHERE id = $id;
    `), [getDatabase()])

    const row = lazyStatic(() => getDatabase().prepare(`
      SELECT last_cycle_started_at
           , total_tokens
           , used_tokens
           , duration
        FROM geyser_rate_limiter
       WHERE id = $id;
    `), [getDatabase()])
      .get({ id }) as {
        last_cycle_started_at: number | null
        total_tokens: number | null
        used_tokens: number
        duration: number | null
      } | undefined
    if (!row) throw new RateLimiterNotFound()

    const lastCycleStartedAt: number | null = row.last_cycle_started_at
    const totalTokens: number = row.total_tokens ?? Infinity
    const usedTokens: number = row.used_tokens
    const duration: number = row.duration ?? Infinity

    if (isNull(lastCycleStartedAt)) {
      startNewCycleStatement.run({ id, timestamp })

      if (totalTokens > 0) {
        acquireStatement.run({ id })
        return new Success(true)
      } else {
        // totalTokens为0, 不可能获取令牌
        return new Unreachable()
      }
    } else {
      if (timestamp > lastCycleStartedAt + duration) {
        startNewCycleStatement.run({ id, timestamp })

        if (totalTokens > 0) {
          acquireStatement.run({ id })
          return new Success(false)
        } else {
          // totalTokens为0, 不可能获取令牌
          return new Unreachable()
        }
      } else {
        if (usedTokens < totalTokens) {
          acquireStatement.run({ id })
          return new Success(false)
        } else {
          if (totalTokens > 0) {
            if (isPositiveInfinity(duration)) {
              return new Unreachable()
            } else {
              return new WaitForNextCycle(lastCycleStartedAt + duration - timestamp)
            }
          } else {
            return new Unreachable()
          }
        }
      }
    }
  }), [getDatabase()])(id, timestamp)
})
