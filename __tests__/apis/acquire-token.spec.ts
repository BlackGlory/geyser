import { startService, stopService, buildClient } from '@test/utils.js'
import { delay, StatefulPromise, StatefulPromiseState } from 'extra-promise'
import { setRateLimiter } from '@apis/set-rate-limiter.js'
import { removeRateLimiter } from '@apis/remove-rate-limiter.js'
import { getRawRateLimiter, hasRawRateLimiter } from '@test/dao.js'
import { acquireToken } from '@apis/acquire-token.js'
import { resetRateLimiter } from '@apis/reset-rate-limiter.js'
import { AbortController, AbortError } from 'extra-abort'
import { jest } from '@jest/globals'
import { getErrorPromise } from 'return-style'
import { pass } from '@blackglory/prelude'
import { RateLimiterNotFound } from '@src/contract.js'

const TIME_ERROR = 1

beforeEach(startService)
afterEach(stopService)

describe('acquireToken', () => {
  test('rate limiter does not exist', async () => {
    const client = await buildClient()
    const id = 'id'

    const err = await getErrorPromise(client.acquireToken(id))

    expect(err).toBeInstanceOf(RateLimiterNotFound)
  })

  describe('rate limiter exists', () => {
    test('acquired', async () => {
      jest.useFakeTimers({ now: 100 })
      try {
        const client = await buildClient()
        const id = 'id'
        setRateLimiter(id, {
          duration: null
        , limit: null
        })

        await client.acquireToken(id)

        expect(getRawRateLimiter(id)).toStrictEqual({
          id
        , window_duration: null
        , total_tokens: null
        , used_tokens: 1
        , window_started_at: 100
        })
      } finally {
        jest.useRealTimers()
      }
    })

    describe('acquiring', () => {
      test('cancel request', async () => {
        const client = await buildClient()
        const id = 'id'
        setRateLimiter(id, {
          duration: null
        , limit: 0
        })

        const controller = new AbortController()
        const promise = client.acquireToken(id, controller.signal)
        promise.catch(pass)
        await delay(1000)
        controller.abort()
        await delay(1000)
        setRateLimiter(id, {
          duration: null
        , limit: null
        })
        const res = await getErrorPromise(promise)

        expect(res).toBeInstanceOf(AbortError)
        expect(getRawRateLimiter(id)).toStrictEqual({
          id
        , window_duration: null
        , total_tokens: null
        , used_tokens: 0
        , window_started_at: null
        })
      })

      test('enter the next window', async () => {
        const client = await buildClient()
        const id = 'id'
        setRateLimiter(id, {
          duration: 1000
        , limit: 1
        })
        await acquireToken(id, new AbortController().signal)
        const oldWindowStartedAt = getRawRateLimiter(id)!.window_started_at!

        const startTime = Date.now()
        await client.acquireToken(id)
        const endTime = Date.now()

        expect(endTime - startTime).toBeGreaterThanOrEqual(1000 - TIME_ERROR)
        expect(endTime - startTime).toBeLessThan(1500)
        const rawRateLimiter = getRawRateLimiter(id)!
        expect(rawRateLimiter).toStrictEqual({
          id
        , window_duration: 1000
        , total_tokens: 1
        , used_tokens: 1
          // eslint-disable-next-line
        , window_started_at: expect.any(Number)
        })
        const newWindowStartedAt = rawRateLimiter.window_started_at!
        expect(newWindowStartedAt).toBeGreaterThan(oldWindowStartedAt)
        expect(newWindowStartedAt - oldWindowStartedAt).toBeGreaterThanOrEqual(1000 - TIME_ERROR)
        expect(newWindowStartedAt - oldWindowStartedAt).toBeLessThan(1500)
      })

      test('set rate limiter', async () => {
        const client = await buildClient()
        const id = 'id'
        setRateLimiter(id, {
          duration: null
        , limit: 0
        })

        const promise = new StatefulPromise<null>((resolve, reject) => {
          client.acquireToken(id)
            .then(resolve, reject)
        })
        await delay(1000)
        const state = promise.state
        jest.useFakeTimers({ now: 1000 })
        try {
          setRateLimiter(id, {
            duration: null
          , limit: 1
          })
          await promise

          expect(state).toBe(StatefulPromiseState.Pending)
          expect(getRawRateLimiter(id)).toStrictEqual({
            id
          , window_duration: null
          , total_tokens: 1
          , used_tokens: 1
          , window_started_at: 1000
          })
        } finally {
          jest.useRealTimers()
        }
      })

      test('reset rate limiter', async () => {
        const client = await buildClient()
        const id = 'id'
        setRateLimiter(id, {
          duration: null
        , limit: 1
        })
        const controller = new AbortController()
        await acquireToken(id, controller.signal)

        const promise = new StatefulPromise<null>((resolve, reject) => {
          client.acquireToken(id)
            .then(resolve, reject)
        })
        await delay(1000)
        const state = promise.state
        jest.useFakeTimers({ now: 1000 })
        try {
          resetRateLimiter(id)
          await promise

          expect(state).toBe(StatefulPromiseState.Pending)
          expect(getRawRateLimiter(id)).toStrictEqual({
            id
          , window_duration: null
          , total_tokens: 1
          , used_tokens: 1
          , window_started_at: 1000
          })
        } finally {
          jest.useRealTimers()
        }
      })

      test('remove rate limiter', async () => {
        const client = await buildClient()
        const id = 'id'
        setRateLimiter(id, {
          duration: null
        , limit: 0
        })

        const promise = client.acquireToken(id)
        await delay(1000)
        removeRateLimiter(id)
        const err = await getErrorPromise(promise)

        expect(err).toBeInstanceOf(RateLimiterNotFound)
        expect(hasRawRateLimiter(id)).toBe(false)
      })
    })
  })
})
