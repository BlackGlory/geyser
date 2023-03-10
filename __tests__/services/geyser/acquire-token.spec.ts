import { startService, stopService, getAddress } from '@test/utils.js'
import { fetch } from 'extra-fetch'
import { post } from 'extra-request'
import { url, pathname, signal } from 'extra-request/transformers'
import { delay, StatefulPromise, StatefulPromiseState } from 'extra-promise'
import { setRateLimiter } from '@apis/set-rate-limiter.js'
import { removeRateLimiter } from '@apis/remove-rate-limiter.js'
import { getRawRateLimiter, hasRawRateLimiter } from '@test/dao.js'
import { acquireToken } from '@apis/acquire-token.js'
import { resetRateLimiter } from '@apis/reset-rate-limiter.js'
import { AbortController, AbortError } from 'extra-abort'
import { jest } from '@jest/globals'
import { getErrorAsync } from 'return-style'
import { pass } from '@blackglory/prelude'

const TIME_ERROR = 1

beforeEach(startService)
afterEach(stopService)

describe('acquireToken', () => {
  test('rate limiter does not exist', async () => {
    const id = 'id'

    const res = await fetch(post(
      url(getAddress())
    , pathname(`/rate-limiters/${id}/acquire`)
    ))

    expect(res.status).toBe(404)
  })

  describe('rate limiter exists', () => {
    test('acquired', async () => {
      jest.useFakeTimers({ now: 100 })
      try {
        const id = 'id'
        setRateLimiter(id, {
          duration: null
        , limit: null
        })

        const res = await fetch(post(
          url(getAddress())
        , pathname(`/rate-limiters/${id}/acquire`)
        ))

        expect(res.status).toBe(204)
        expect(getRawRateLimiter(id)).toStrictEqual({
          id
        , duration: null
        , total_tokens: null
        , used_tokens: 1
        , last_cycle_started_at: 100
        })
      } finally {
        jest.useRealTimers()
      }
    })

    describe('acquiring', () => {
      test('cancel request', async () => {
        const id = 'id'
        setRateLimiter(id, {
          duration: null
        , limit: 0
        })

        const controller = new AbortController()
        const promise = fetch(post(
          url(getAddress())
        , pathname(`/rate-limiters/${id}/acquire`)
        , signal(controller.signal)
        ))
        promise.catch(pass)
        await delay(1000)
        controller.abort()
        await delay(1000)
        setRateLimiter(id, {
          duration: null
        , limit: null
        })
        const res = await getErrorAsync(() => promise)

        expect(res).toBeInstanceOf(AbortError)
        expect(getRawRateLimiter(id)).toStrictEqual({
          id
        , duration: null
        , total_tokens: null
        , used_tokens: 0
        , last_cycle_started_at: null
        })
      })

      test('enter the next cycle', async () => {
        const id = 'id'
        setRateLimiter(id, {
          duration: 1000
        , limit: 1
        })
        await acquireToken(id, new AbortController().signal)
        const oldCycleStartedAt = getRawRateLimiter(id)!.last_cycle_started_at!

        const startTime = Date.now()
        const res = await fetch(post(
          url(getAddress())
        , pathname(`/rate-limiters/${id}/acquire`)
        ))
        const endTime = Date.now()

        expect(res.status).toBe(204)
        expect(endTime - startTime).toBeGreaterThanOrEqual(1000 - TIME_ERROR)
        expect(endTime - startTime).toBeLessThan(1500)
        const rawRateLimiter = getRawRateLimiter(id)!
        expect(rawRateLimiter).toStrictEqual({
          id
        , duration: 1000
        , total_tokens: 1
        , used_tokens: 1
          // eslint-disable-next-line
        , last_cycle_started_at: expect.any(Number)
        })
        const newCycleStartedAt = rawRateLimiter.last_cycle_started_at!
        expect(newCycleStartedAt).toBeGreaterThan(oldCycleStartedAt)
        expect(newCycleStartedAt - oldCycleStartedAt).toBeGreaterThanOrEqual(1000 - TIME_ERROR)
        expect(newCycleStartedAt - oldCycleStartedAt).toBeLessThan(1500)
      })

      test('set rate limiter', async () => {
        const id = 'id'
        setRateLimiter(id, {
          duration: null
        , limit: 0
        })

        const promise = new StatefulPromise<Response>((resolve, reject) => {
          fetch(post(
            url(getAddress())
          , pathname(`/rate-limiters/${id}/acquire`)
          ))
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
          const res = await promise

          expect(state).toBe(StatefulPromiseState.Pending)
          expect(res.status).toBe(204)
          expect(getRawRateLimiter(id)).toStrictEqual({
            id
          , duration: null
          , total_tokens: 1
          , used_tokens: 1
          , last_cycle_started_at: 1000
          })
        } finally {
          jest.useRealTimers()
        }
      })

      test('reset rate limiter', async () => {
        const id = 'id'
        setRateLimiter(id, {
          duration: null
        , limit: 1
        })
        const controller = new AbortController()
        await acquireToken(id, controller.signal)

        const promise = new StatefulPromise<Response>((resolve, reject) => {
          fetch(post(
            url(getAddress())
          , pathname(`/rate-limiters/${id}/acquire`)
          ))
            .then(resolve, reject)
        })
        await delay(1000)
        const state = promise.state
        jest.useFakeTimers({ now: 1000 })
        try {
          resetRateLimiter(id)
          const res = await promise

          expect(state).toBe(StatefulPromiseState.Pending)
          expect(res.status).toBe(204)
          expect(getRawRateLimiter(id)).toStrictEqual({
            id
          , duration: null
          , total_tokens: 1
          , used_tokens: 1
          , last_cycle_started_at: 1000
          })
        } finally {
          jest.useRealTimers()
        }
      })

      test('remove rate limiter', async () => {
        const id = 'id'
        setRateLimiter(id, {
          duration: null
        , limit: 0
        })

        const promise = fetch(post(
          url(getAddress())
        , pathname(`/rate-limiters/${id}/acquire`)
        ))
        await delay(1000)
        removeRateLimiter(id)
        const res = await promise

        expect(res.status).toBe(404)
        expect(hasRawRateLimiter(id)).toBe(false)
      })
    })
  })
})
