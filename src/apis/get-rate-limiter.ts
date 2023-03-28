import { IRateLimiterConfig } from '@src/contract.js'
import { getRateLimiterConfiguration } from '@dao/get-rate-limiter-configuration.js'

export function getRateLimiter(
  rateLimiterId: string
): IRateLimiterConfig | null {
  return getRateLimiterConfiguration(rateLimiterId)
}
