import { startService, stopService, getAddress } from '@test/utils.js'
import { fetch } from 'extra-fetch'
import { post } from 'extra-request'
import { url, pathname } from 'extra-request/transformers'
import { setRateLimiter } from '@apis/set-rate-limiter.js'
import { acquireToken } from '@apis/acquire-token.js'
import { AbortController } from 'extra-abort'
import { getRawRateLimiter } from '@test/dao.js'

beforeEach(startService)
afterEach(stopService)

describe('resetRateLimiter', () => {
  test('rate limiter does not exist', async () => {
    const id = 'id'

    const res = await fetch(post(
      url(getAddress())
    , pathname(`/rate-limiters/${id}/reset`)
    ))

    expect(res.status).toBe(404)
  })

  test('rate limiter exists', async () => {
    const id = 'id'
    setRateLimiter(id, {
      duration: null
    , limit: null
    })
    const controller = new AbortController()
    await acquireToken(id, controller.signal)

    const res = await fetch(post(
      url(getAddress())
    , pathname(`/rate-limiters/${id}/reset`)
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
})
