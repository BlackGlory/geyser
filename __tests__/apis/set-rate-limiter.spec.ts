import { startService, stopService, buildClient } from '@test/utils.js'
import { AbortController } from 'extra-abort'
import { setRateLimiter } from '@apis/set-rate-limiter.js'
import { acquireToken } from '@apis/acquire-token.js'
import { getRawRateLimiter } from '@test/dao.js'
import { IRateLimiterConfig } from '@src/contract.js'

beforeEach(startService)
afterEach(stopService)

describe('setRateLimiter', () => {
  test('rate limiter does not exist', async () => {
    const client = await buildClient()
    const id = 'id'

    await client.setRateLimiter(id, {
      duration: null
    , limit: null
    })

    expect(getRawRateLimiter(id)).toStrictEqual({
      id
    , duration: null
    , total_tokens: null
    , used_tokens: 0
    , last_cycle_started_at: null
    })
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

    await client.setRateLimiter(id, {
      duration: 50
    , limit: 100
    })

    expect(getRawRateLimiter(id)).toStrictEqual({
      id
    , duration: 50
    , total_tokens: 100
    , used_tokens: 0
    , last_cycle_started_at: null
    })
  })
})
