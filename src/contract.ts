import { JSONObject } from 'justypes'

export interface IRateLimiterConfiguration extends JSONObject {
  duration: number | null
  limit: number | null
}

export interface IAPI {
  getAllRateLimiterIds(): string[]

  getRateLimiter(rateLimiterId: string): IRateLimiterConfiguration | null
  setRateLimiter(rateLimiterId: string, config: IRateLimiterConfiguration): void
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