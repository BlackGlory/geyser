import { startService, stopService, buildClient } from '@test/utils.js'
import { setRateLimiter } from '@apis/set-rate-limiter.js'
import { acquireToken } from '@apis/acquire-token.js'
import { AbortController } from 'extra-abort'
import { getRawRateLimiter } from '@test/dao.js'
import { getErrorPromise } from 'return-style'
import { RateLimiterNotFound } from '@src/contract.js'

beforeEach(startService)
afterEach(stopService)

describe('resetRateLimiter', () => {
  test('rate limiter does not exist', async () => {
    const client = await buildClient()
    const id = 'id'

    const err = await getErrorPromise(client.resetRateLimiter(id))

    expect(err).toBeInstanceOf(RateLimiterNotFound)
  })

  test('rate limiter exists', async () => {
    const client = await buildClient()
    const id = 'id'
    setRateLimiter(id, {
      duration: null
    , limit: null
    })
    const controller = new AbortController()
    await acquireToken(id, controller.signal)

    await client.resetRateLimiter(id)

    expect(getRawRateLimiter(id)).toStrictEqual({
      id
    , window_duration: null
    , total_tokens: null
    , used_tokens: 0
    , window_started_at: null
    })
  })
})
