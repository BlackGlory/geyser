import { IRateLimiterConfig } from '@src/contract.js'
import { setRateLimiterConfiguration } from '@dao/set-rate-limiter-configuration.js'
import { resetRateLimiter } from '@dao/reset-rate-limiter.js'
import { eventHub, Event } from '@src/event-hub.js'
import { getDatabase } from '@src/database.js'
import { lazyStatic, withLazyStatic } from 'extra-lazy'

const _setRateLimiter = withLazyStatic((
  rateLimiterId: string
, config: IRateLimiterConfig
): void => {
  lazyStatic(() => getDatabase().transaction((
    rateLimiterId: string
  , config: IRateLimiterConfig
  ): void => {
    setRateLimiterConfiguration(rateLimiterId, config)
    resetRateLimiter(rateLimiterId)
  }), [getDatabase()])(rateLimiterId, config)
})

export function setRateLimiter(
  rateLimiterId: string
, config: IRateLimiterConfig
) {
  _setRateLimiter(rateLimiterId, config)

  eventHub.emit(rateLimiterId, Event.RateLimiterSet)

  return null
}
