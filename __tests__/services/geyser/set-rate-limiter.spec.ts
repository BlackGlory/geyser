import { startService, stopService, getAddress } from '@test/utils.js'
import { fetch } from 'extra-fetch'
import { put } from 'extra-request'
import { url, pathname, json } from 'extra-request/transformers'
import { AbortController } from 'extra-abort'
import { setRateLimiter } from '@apis/set-rate-limiter.js'
import { acquireToken } from '@apis/acquire-token.js'
import { getRawRateLimiter } from '@test/dao.js'
import { IRateLimiterConfig } from '@src/contract.js'

beforeEach(startService)
afterEach(stopService)

describe('setRateLimiter', () => {
  test('rate limiter does not exist', async () => {
    const id = 'id'

    const res = await fetch(put(
      url(getAddress())
    , pathname(`/rate-limiters/${id}`)
    , json<IRateLimiterConfig>({
        duration: null
      , limit: null
      })
    ))

    expect(res.status).toBe(204)
    expect(getRawRateLimiter(id)).toStrictEqual({
      id
    , duration: null
    , total_tokens: null
    , used_tokens: 0
    , last_cycle_started_at: null
    })
  })

  test('rate limiter exists', async () => {
    const id = 'id'
    setRateLimiter(id, {
      duration: null
    , limit: null
    })
    const controller = new AbortController()
    await acquireToken(id, controller.signal)

    const res = await fetch(put(
      url(getAddress())
    , pathname(`/rate-limiters/${id}`)
    , json<IRateLimiterConfig>({
        duration: 50
      , limit: 100
      })
    ))

    expect(res.status).toBe(204)
    expect(getRawRateLimiter(id)).toStrictEqual({
      id
    , duration: 50
    , total_tokens: 100
    , used_tokens: 0
    , last_cycle_started_at: null
    })
  })
})
