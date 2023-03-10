import { resetRateLimiter } from '@dao/reset-rate-limiter.js'
import { initializeDatabases, clearDatabases } from '@test/utils.js'
import { setRawRateLimiter, getRawRateLimiter } from '@test/dao.js'

beforeEach(initializeDatabases)
afterEach(clearDatabases)

describe('resetRateLimiter', () => {
  test('rate limiter does not exist', () => {
    const result = resetRateLimiter('id')

    expect(result).toBe(false)
  })

  test('rate limiter exists', () => {
    setRawRateLimiter({
      id: 'id'
    , duration: null
    , last_cycle_started_at: 50
    , total_tokens: null
    , used_tokens: 100
    })

    const result = resetRateLimiter('id')

    expect(result).toBe(true)
    expect(getRawRateLimiter('id')).toStrictEqual({
      id: 'id'
    , duration: null
    , last_cycle_started_at: null
    , total_tokens: null
    , used_tokens: 0
    })
  })
})
