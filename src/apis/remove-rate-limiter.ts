import { removeRateLimiter as _removeRateLimiter } from '@dao/remove-rate-limiter.js'
import { eventHub, Event } from '@src/event-hub.js'

export function removeRateLimiter(rateLimiterId: string): void {
  _removeRateLimiter(rateLimiterId)
  eventHub.emit(rateLimiterId, Event.Removed)
}
