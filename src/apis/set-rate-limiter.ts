import { IRateLimiterConfig } from '@src/contract.js'
import { setRateLimiterConfiguration } from '@dao/set-rate-limiter-configuration.js'
import { resetRateLimiter } from '@dao/reset-rate-limiter.js'
import { eventHub, Event } from '@src/event-hub.js'
import { getDatabase } from '@src/database.js'

export function setRateLimiter(
  rateLimiterId: string
, config: IRateLimiterConfig
): null {
  getDatabase().transaction(() => {
    setRateLimiterConfiguration(rateLimiterId, config)
    resetRateLimiter(rateLimiterId)
  })()

  eventHub.emit(rateLimiterId, Event.RateLimiterSet)

  return null
}
