import { startService, stopService, getAddress } from '@test/utils.js'
import { fetch } from 'extra-fetch'
import { get } from 'extra-request'
import { url, pathname } from 'extra-request/transformers'
import { toJSON } from 'extra-response'
import { setRateLimiter } from '@apis/set-rate-limiter.js'

beforeEach(startService)
afterEach(stopService)

describe('getAllRateLimiterIds', () => {
  test('empty', async () => {
    const res = await fetch(get(
      url(getAddress())
    , pathname('/rate-limiters')
    ))

    expect(res.status).toBe(200)
    expect(await toJSON(res)).toStrictEqual([])
  })

  test('non-empty', async () => {
    setRateLimiter('id', {
      duration: null
    , limit: null
    })

    const res = await fetch(get(
      url(getAddress())
    , pathname('/rate-limiters')
    ))

    expect(res.status).toBe(200)
    expect(await toJSON(res)).toStrictEqual(['id'])
  })
})
