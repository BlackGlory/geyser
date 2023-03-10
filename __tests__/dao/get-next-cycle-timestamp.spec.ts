import { getNextCycleTimestamp } from '@dao/get-next-cycle-timestamp.js'
import { initializeDatabases, clearDatabases } from '@test/utils.js'
import { RateLimiterNotFound } from '@src/errors.js'
import { setRawRateLimiter } from '@test/dao.js'
import { getError } from 'return-style'

beforeEach(initializeDatabases)
afterEach(clearDatabases)

describe('getNextCycleTimestamp', () => {
  test('rate limiter does not exist', () => {
    const err = getError(() => getNextCycleTimestamp('id'))

    expect(err).toBeInstanceOf(RateLimiterNotFound)
  })

  describe('rate limiter exists', () => {
    test('returns null', () => {
      setRawRateLimiter({
        id: 'id'
      , duration: null
      , last_cycle_started_at: null
      , total_tokens: null
      , used_tokens: 0
      })

      const result = getNextCycleTimestamp('id')

      expect(result).toBe(null)
    })

    test('returns a finite timestamp', () => {
      setRawRateLimiter({
        id: 'id'
      , duration: 50
      , last_cycle_started_at: 100
      , total_tokens: null
      , used_tokens: 0
      })

      const result = getNextCycleTimestamp('id')

      expect(result).toBe(150)
    })

    test('returns a infinity timestamp', () => {
      setRawRateLimiter({
        id: 'id'
      , duration: null
      , last_cycle_started_at: 100
      , total_tokens: null
      , used_tokens: 0
      })

      const result = getNextCycleTimestamp('id')

      expect(result).toBe(Infinity)
    })
  })
})
