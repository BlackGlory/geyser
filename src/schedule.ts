import { nextTick } from '@core/geyser'
import { AbortError, withAbortSignal } from 'extra-promise'
import { setDynamicTimeoutLoop } from 'extra-timers'
import ms = require('ms')

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
