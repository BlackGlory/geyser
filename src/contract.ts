import { JSONObject } from 'justypes'
import { CustomError } from '@blackglory/errors'

export interface IRateLimiterConfig extends JSONObject {
  duration: number | null
  limit: number | null
}

export interface IAPI {
  getAllRateLimiterIds(): string[]

  getRateLimiter(rateLimiterId: string): IRateLimiterConfig | null
  setRateLimiter(rateLimiterId: string, config: IRateLimiterConfig): void
  removeRateLimiter(rateLimiterId: string): void

  /**
   * 重置速率限制器的状态.
   * 
   * @throws {RateLimiterNotFound}
   */
  resetRateLimiter(rateLimiterId: string): void

  /**
   * @throws {RateLimiterNotFound}
   */
  acquireToken(rateLimiterId: string, signal: AbortSignal): Promise<void>
}

/**
 * 速率限制器在未经配置的情况下, 相当于不存在.
 */
export class RateLimiterNotFound extends CustomError {}
