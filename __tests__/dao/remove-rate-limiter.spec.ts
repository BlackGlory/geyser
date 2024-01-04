import { removeRateLimiter } from '@dao/remove-rate-limiter.js'
import { initializeDatabases, clearDatabases } from '@test/utils.js'
import { setRawRateLimiter, hasRawRateLimiter } from '@test/dao.js'

beforeEach(initializeDatabases)
afterEach(clearDatabases)

describe('removeRateLimiter', () => {
  test('rate limiter does not exist', () => {
    removeRateLimiter('id')

    expect(hasRawRateLimiter('id')).toBe(false)
  })

  test('rate limiter exists', () => {
    setRawRateLimiter({
      id: 'id'
    , window_duration: null
    , window_started_at: null
    , total_tokens: null
    , used_tokens: 0
    })

    removeRateLimiter('id')

    expect(hasRawRateLimiter('id')).toBe(false)
  })
})
