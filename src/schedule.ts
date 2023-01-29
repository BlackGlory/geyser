import { nextTick } from '@core/geyser.js'
import { AbortError, withAbortSignal } from 'extra-abort'
import { setDynamicTimeoutLoop } from 'extra-timers'
import ms from 'ms'

export function callNextTickEverySecond(abortSignal: AbortSignal): void {
  const cancel = setDynamicTimeoutLoop(ms('1s'), async () => {
    try {
      await withAbortSignal(abortSignal, nextTick)
    } catch (e) {
      if (e instanceof AbortError) return cancel()
      throw e
    }
  })
}
