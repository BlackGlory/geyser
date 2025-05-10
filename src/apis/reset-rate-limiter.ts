import { resetRateLimiter as _resetRateLimiter } from '@dao/reset-rate-limiter.js'
import { RateLimiterNotFound } from '@src/contract.js'
import { eventHub, Event } from '@src/event-hub.js'

/**
 * @throws {RateLimiterNotFound}
 */
export function resetRateLimiter(rateLimiterId: string): null {
  if (_resetRateLimiter(rateLimiterId)) {
    eventHub.emit(rateLimiterId, Event.RateLimiterReset)
    return null
  } else {
    throw new RateLimiterNotFound()
  }
}
