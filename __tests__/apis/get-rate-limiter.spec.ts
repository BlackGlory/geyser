import { startService, stopService, buildClient } from '@test/utils.js'
import { setRateLimiter } from '@apis/set-rate-limiter.js'

beforeEach(startService)
afterEach(stopService)

describe('getRateLimiter', () => {
  test('rate limiter does not exist', async () => {
    const client = await buildClient()
    const id = 'id'

    const result = await client.getRateLimiter(id)

    expect(result).toBe(null)
  })

  test('rate limiter exists', async () => {
    const client = await buildClient()
    const id = 'id'
    setRateLimiter(id, {
      duration: null
    , limit: null
    })

    const result = await client.getRateLimiter(id)

    expect(result).toStrictEqual({
      duration: null
    , limit: null
    })
  })
})
