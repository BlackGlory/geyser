import { GeyserDAO } from '@src/dao/data-in-memory/geyser'
import { resetGeyserMap } from '@src/dao/data-in-memory/geyser/geyser-map'
import { AbortController } from 'abort-controller'
import { setTimeout, setImmediate } from 'extra-timers'
import { getErrorPromise } from 'return-style'
import 'jest-extended'

afterEach(resetGeyserMap)

describe('GeyserDAO', () => {
  test('acquire blocks when geyser is full', async () => {
    const namespace = 'namespace'
    const duration = 1000
    const limit = 1
    await GeyserDAO.create(namespace, { duration, limit })

    const time1 = getTimestamp()
    const controller1 = new AbortController()
    await GeyserDAO.acquire(namespace, controller1.signal)
    const time2 = getTimestamp()

    const controller2 = new AbortController()
    setImmediate(GeyserDAO.nextTick)
    setTimeout(1000, GeyserDAO.nextTick)
    await GeyserDAO.acquire(namespace, controller2.signal)
    const time3 = getTimestamp()

    expect(time2 - time1).toBeLessThanOrEqual(100)
    expect(time3 - time1).toBeGreaterThanOrEqual(1000)
  }, 30000) // for CI

  test('update config', async () => {
    const namespace = 'namespace'
    const duration = 1000
    const limit = 1
    await GeyserDAO.create(namespace, { duration, limit })

    const time1 = getTimestamp()
    const controller1 = new AbortController()
    await GeyserDAO.acquire(namespace, controller1.signal)
    const time2 = getTimestamp()

    const controller2 = new AbortController()
    setImmediate(GeyserDAO.nextTick)
    setTimeout(500, async () => {
      await GeyserDAO.update(namespace, {
        duration
      , limit: limit + 1
      })
      await GeyserDAO.nextTick()
    })
    await GeyserDAO.acquire(namespace, controller2.signal)
    const time3 = getTimestamp()

    expect(time2 - time1).toBeLessThanOrEqual(100)
    expect(time3 - time1).toBeWithin(500, 1000)
  })

  test('abort acquire', async () => {
    const namespace = 'namespace'
    const duration = 1000
    const limit = 1
    await GeyserDAO.create(namespace, { duration, limit })

    const time1 = getTimestamp()
    const controller1 = new AbortController()
    await GeyserDAO.acquire(namespace, controller1.signal)

    const controller2 = new AbortController()
    setImmediate(async () => {
      controller2.abort()
      await GeyserDAO.nextTick()
    })
    const err = await getErrorPromise(GeyserDAO.acquire(namespace, controller2.signal))

    const controller3 = new AbortController()
    setImmediate(GeyserDAO.nextTick)
    setTimeout(1000, GeyserDAO.nextTick)
    await GeyserDAO.acquire(namespace, controller3.signal)
    const time2 = getTimestamp()

    expect(err).toBeInstanceOf(GeyserDAO.AbortError)
    expect(time2 - time1).toBeGreaterThanOrEqual(1000)
  })
})

function getTimestamp(): number {
  return Date.now()
}
