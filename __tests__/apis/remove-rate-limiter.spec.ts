import { startService, stopService, buildClient } from '@test/utils.js'
import { setRateLimiter } from '@apis/set-rate-limiter.js'
import { getRateLimiter } from '@apis/get-rate-limiter.js'

beforeEach(startService)
afterEach(stopService)

describe('removeRateLimiter', () => {
  test('rate limiter does not exist', async () => {
    const client = await buildClient()
    const id = 'id'

    await client.removeRateLimiter(id)

    expect(getRateLimiter(id)).toBe(null)
  })

  test('rate limiter exists', async () => {
    const client = await buildClient()
    const id = 'id'
    setRateLimiter(id, {
      duration: null
    , limit: null
    })

    await client.removeRateLimiter(id)

    expect(getRateLimiter(id)).toBe(null)
  })
})
