import { startService, stopService, buildClient } from '@test/utils.js'
import { setRateLimiter } from '@apis/set-rate-limiter.js'

beforeEach(startService)
afterEach(stopService)

describe('getAllRateLimiterIds', () => {
  test('empty', async () => {
    const client = await buildClient()

    const result = await client.getAllRateLimiterIds()

    expect(result).toStrictEqual([])
  })

  test('non-empty', async () => {
    const client = await buildClient()
    setRateLimiter('id', {
      duration: null
    , limit: null
    })

    const result = await client.getAllRateLimiterIds()

    expect(result).toStrictEqual(['id'])
  })
})
