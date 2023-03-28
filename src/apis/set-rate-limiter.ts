import { IRateLimiterConfig } from '@src/contract.js'
import { setRateLimiterConfiguration } from '@dao/set-rate-limiter-configuration.js'
import { resetRateLimiter } from '@dao/reset-rate-limiter.js'
import { eventHub, Event } from '@src/event-hub.js'

export function setRateLimiter(
  rateLimiterId: string
, config: IRateLimiterConfig
): void {
  setRateLimiterConfiguration(rateLimiterId, config)
  resetRateLimiter(rateLimiterId)
  eventHub.emit(rateLimiterId, Event.Set)
}
