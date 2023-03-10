import { startService, stopService, getAddress } from '@test/utils.js'
import { fetch } from 'extra-fetch'
import { del } from 'extra-request'
import { url, pathname } from 'extra-request/transformers'
import { setRateLimiter } from '@apis/set-rate-limiter.js'
import { getRateLimiter } from '@apis/get-rate-limiter.js'

beforeEach(startService)
afterEach(stopService)

describe('removeRateLimiter', () => {
  test('rate limiter does not exist', async () => {
    const id = 'id'

    const res = await fetch(del(
      url(getAddress())
    , pathname(`/rate-limiters/${id}`)
    ))

    expect(res.status).toBe(204)
    expect(getRateLimiter(id)).toBe(null)
  })

  test('rate limiter exists', async () => {
    const id = 'id'
    setRateLimiter(id, {
      duration: null
    , limit: null
    })

    const res = await fetch(del(
      url(getAddress())
    , pathname(`/rate-limiters/${id}`)
    ))

    expect(res.status).toBe(204)
    expect(getRateLimiter(id)).toBe(null)
  })
})
