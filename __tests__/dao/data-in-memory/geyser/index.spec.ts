import { GeyserDAO } from '@src/dao/data-in-memory/geyser'
import { resetGeyserMap } from '@src/dao/data-in-memory/geyser/geyser-map'
import { AbortController } from 'abort-controller'
import { setTimeout, setImmediate } from 'extra-timers'
import { getErrorPromise } from 'return-style'
import 'jest-extended'

const ERROR = 1

afterEach(resetGeyserMap)

describe('GeyserDAO', () => {
  test('acquire blocks when geyser is full', async () => {
    const namespace = 'namespace'
    const duration = 1000
    const limit = 1
    await GeyserDAO.create(namespace, { duration, limit })

    const time1 = getTimestamp()
    await GeyserDAO.acquire(namespace, new AbortController().signal)
    const time2 = getTimestamp()

    setImmediate(GeyserDAO.nextTick)
    setTimeout(1000 + ERROR, GeyserDAO.nextTick)
    await GeyserDAO.acquire(namespace, new AbortController().signal)
    const time3 = getTimestamp()

    expect(time2 - time1).toBeLessThanOrEqual(100)
    expect(time3 - time1).toBeGreaterThanOrEqual(1000)
  })

  test('update config', async () => {
    const namespace = 'namespace'
    const duration = 1000
    const limit = 1
    await GeyserDAO.create(namespace, { duration, limit })

    const time1 = getTimestamp()
    await GeyserDAO.acquire(namespace, new AbortController().signal)
    const time2 = getTimestamp()

    setImmediate(GeyserDAO.nextTick)
    setTimeout(500 + ERROR, async () => {
      await GeyserDAO.updateConfig(namespace, {
        duration
      , limit: limit + 1
      })
      await GeyserDAO.nextTick()
    })
    await GeyserDAO.acquire(namespace, new AbortController().signal)
    const time3 = getTimestamp()

    expect(time2 - time1).toBeLessThanOrEqual(100)
    expect(time3 - time1).toBeWithin(500, 1000)
  })

  test('reset cycle', async () => {
    const namespace = 'namespace'
    const duration = 1000
    const limit = 1
    await GeyserDAO.create(namespace, { duration, limit })

    const time1 = getTimestamp()
    await GeyserDAO.acquire(namespace, new AbortController().signal)
    GeyserDAO.resetCycle(namespace)
    await GeyserDAO.acquire(namespace, new AbortController().signal)
    const time2 = getTimestamp()
    setImmediate(GeyserDAO.nextTick)
    setTimeout(1000 + ERROR, GeyserDAO.nextTick)
    await GeyserDAO.acquire(namespace, new AbortController().signal)
    const time3 = getTimestamp()

    expect(time2 - time1).toBeLessThan(100)
    expect(time3 - time1).toBeGreaterThanOrEqual(1000)
  })

  test('abort acquire', async () => {
    const namespace = 'namespace'
    const duration = 1000
    const limit = 1
    await GeyserDAO.create(namespace, { duration, limit })

    const time1 = getTimestamp()
    await GeyserDAO.acquire(namespace, new AbortController().signal)

    const controller = new AbortController()
    setImmediate(async () => {
      controller.abort()
      await GeyserDAO.nextTick()
    })
    const err = await getErrorPromise(GeyserDAO.acquire(namespace, controller.signal))

    setImmediate(GeyserDAO.nextTick)
    setTimeout(1000 + ERROR, GeyserDAO.nextTick)
    await GeyserDAO.acquire(namespace, new AbortController().signal)
    const time2 = getTimestamp()

    expect(err).toBeInstanceOf(GeyserDAO.AbortError)
    expect(time2 - time1).toBeGreaterThanOrEqual(1000)
  })
})

function getTimestamp(): number {
  return Date.now()
}
