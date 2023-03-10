import { startService, stopService, getAddress } from '@test/utils.js'
import { fetch } from 'extra-fetch'
import { get } from 'extra-request'
import { url, pathname } from 'extra-request/transformers'
import { toJSON } from 'extra-response'
import { setRateLimiter } from '@apis/set-rate-limiter.js'

beforeEach(startService)
afterEach(stopService)

describe('getRateLimiter', () => {
  test('rate limiter does not exist', async () => {
    const id = 'id'

    const res = await fetch(get(
      url(getAddress())
    , pathname(`/rate-limiters/${id}`)
    ))

    expect(res.status).toBe(404)
  })

  test('rate limiter exists', async () => {
    const id = 'id'
    setRateLimiter(id, {
      duration: null
    , limit: null
    })

    const res = await fetch(get(
      url(getAddress())
    , pathname(`/rate-limiters/${id}`)
    ))

    expect(res.status).toBe(200)
    expect(await toJSON(res)).toStrictEqual({
      duration: null
    , limit: null
    })
  })
})
