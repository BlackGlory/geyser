import { tryAcquireToken, Success, Unreachable, WaitForNextWindow } from '@dao/try-acquire-token.js'
import { eventHub, Event } from '@src/event-hub.js'
import { LinkedAbortController, raceAbortSignals } from 'extra-abort'
import { waitForTimeout } from '@blackglory/wait-for'

/**
 * @throws {RateLimiterNotFound}
 */
export async function acquireToken(
  rateLimiterId: string
, signal?: AbortSignal
): Promise<null> {
  while (true) {
    const result = tryAcquireToken(rateLimiterId, Date.now())

    if (result instanceof WaitForNextWindow) {
      const controller = new LinkedAbortController(raceAbortSignals([signal]))
      try {
        const signal = controller.signal
        await Promise.race([
          eventHub.waitFor(rateLimiterId, Event.Set, signal)
        , eventHub.waitFor(rateLimiterId, Event.Reset, signal)
        , eventHub.waitFor(rateLimiterId, Event.Removed, signal)
        , waitForTimeout(result.timeout, signal)
        ])
      } finally {
        controller.abort()
      }
    } else if (result instanceof Success) {
      return null
    } else if (result instanceof Unreachable) {
      const controller = new LinkedAbortController(raceAbortSignals([signal]))
      try {
        const signal = controller.signal
        await Promise.race([
          eventHub.waitFor(rateLimiterId, Event.Set, signal)
        , eventHub.waitFor(rateLimiterId, Event.Reset, signal)
        , eventHub.waitFor(rateLimiterId, Event.Removed, signal)
        ])
      } finally {
        controller.abort()
      }
    } else {
      throw new Error('Unexpected route')
    }
  }
}
