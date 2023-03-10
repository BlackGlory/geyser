import { setRateLimiterConfiguration } from '@dao/set-rate-limiter-configuration.js'
import { initializeDatabases, clearDatabases } from '@test/utils.js'
import { getRawRateLimiter } from '@test/dao.js'

beforeEach(initializeDatabases)
afterEach(clearDatabases)

describe('setRateLimiterConfiguration', () => {
  test('rate limiter does not exist', () => {
    setRateLimiterConfiguration('id', {
      duration: 50
    , limit: 100
    })

    expect(getRawRateLimiter('id')).toStrictEqual({
      id: 'id'
    , duration: 50
    , total_tokens: 100
    , used_tokens: 0
    , last_cycle_started_at: null
    })
  })

  test('rate limiter exists', () => {
    setRateLimiterConfiguration('id', {
      duration: 50
    , limit: 100
    })

    setRateLimiterConfiguration('id', {
      duration: 100
    , limit: 200
    })

    expect(getRawRateLimiter('id')).toStrictEqual({
      id: 'id'
    , duration: 100
    , total_tokens: 200
    , used_tokens: 0
    , last_cycle_started_at: null
    })
  })
})
