import { getRateLimiterConfiguration } from '@dao/get-rate-limiter-configuration.js'
import { initializeDatabases, clearDatabases } from '@test/utils.js'
import { setRawRateLimiter } from '@test/dao.js'

beforeEach(initializeDatabases)
afterEach(clearDatabases)

describe('getRateLimiterConfiguration', () => {
  test('rate limiter does not exist', () => {
    const result = getRateLimiterConfiguration('id')

    expect(result).toBe(null)
  })

  test('rate limiter exists', () => {
    setRawRateLimiter({
      id: 'id'
    , window_duration: 50
    , window_started_at: null
    , total_tokens: 100
    , used_tokens: 0
    })

    const result = getRateLimiterConfiguration('id')

    expect(result).toStrictEqual({
      duration: 50
    , limit: 100
    })
  })
})
