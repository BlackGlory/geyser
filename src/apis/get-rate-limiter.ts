import { IRateLimiterConfiguration } from '@src/contract.js'
import { getRateLimiterConfiguration } from '@dao/get-rate-limiter-configuration.js'

export function getRateLimiter(
  rateLimiterId: string
): IRateLimiterConfiguration | null {
  return getRateLimiterConfiguration(rateLimiterId)
}
