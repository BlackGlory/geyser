import { getDatabase } from '@src/database.js'
import { withLazyStatic, lazyStatic } from 'extra-lazy'
import { RateLimiterNotFound } from '@src/contract.js'
import { isNull, isPositiveInfinity } from '@blackglory/prelude'

/**
 * 表示获取令牌成功.
 */
export class Success {
  constructor(public readonly isFirstAcquireOfRateLimiter: boolean) {}
}

/**
 * 表示在当前设置下不可能获取到令牌.
 */
export class Unreachable {}

/**
 * 表示可能在下个时间窗口获取到令牌.
 */
export class WaitForNextWindow {
  /**
   * @param timeout 距离下一个时间窗口的毫秒数.
   */
  constructor(public readonly timeout: number) {}
}

/**
 * @throws {RateLimiterNotFound}
 */
export const tryAcquireToken = withLazyStatic((
  id: string
, timestamp: number
): Success | Unreachable | WaitForNextWindow => {
  return lazyStatic(() => getDatabase().transaction((
    id: string
  , timestamp: number
  ): Success | Unreachable | WaitForNextWindow => {
    const startNewWindowStatement = lazyStatic(() => getDatabase().prepare(`
      UPDATE geyser_rate_limiter
         SET window_started_at = $timestamp
           , used_tokens = 0
       WHERE id = $id;
    `), [getDatabase()])

    const acquireStatement = lazyStatic(() => getDatabase().prepare(`
      UPDATE geyser_rate_limiter
         SET used_tokens = used_tokens + 1
       WHERE id = $id;
    `), [getDatabase()])

    const row = lazyStatic(() => getDatabase().prepare(`
      SELECT window_started_at
           , total_tokens
           , used_tokens
           , window_duration
        FROM geyser_rate_limiter
       WHERE id = $id;
    `), [getDatabase()])
      .get({ id }) as {
        window_started_at: number | null
        total_tokens: number | null
        used_tokens: number
        window_duration: number | null
      } | undefined
    if (!row) throw new RateLimiterNotFound()

    const windowStartedAt: number | null = row.window_started_at
    const totalTokens: number = row.total_tokens ?? Infinity
    const usedTokens: number = row.used_tokens
    const windowDuration: number = row.window_duration ?? Infinity

    if (isNull(windowStartedAt)) {
      startNewWindowStatement.run({ id, timestamp })

      if (totalTokens > 0) {
        acquireStatement.run({ id })
        return new Success(true)
      } else {
        // totalTokens为0, 不可能获取令牌
        return new Unreachable()
      }
    } else {
      if (windowStartedAt + windowDuration <= timestamp) {
        startNewWindowStatement.run({ id, timestamp })

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
            if (isPositiveInfinity(windowDuration)) {
              return new Unreachable()
            } else {
              return new WaitForNextWindow(
                windowStartedAt + windowDuration - timestamp
              )
            }
          } else {
            return new Unreachable()
          }
        }
      }
    }
  }), [getDatabase()])(id, timestamp)
})
