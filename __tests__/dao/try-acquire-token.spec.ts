import { tryAcquireToken, Success, Unreachable, WaitForNextWindow } from '@dao/try-acquire-token.js'
import { initializeDatabases, clearDatabases } from '@test/utils.js'
import { setRawRateLimiter, getRawRateLimiter } from '@test/dao.js'

beforeEach(initializeDatabases)
afterEach(clearDatabases)

describe('tryAcquireToken', () => {
  describe('window initialized', () => {
    test('acquired (first acquire)', () => {
      setRawRateLimiter({
        id: 'id'
      , window_duration: 50
      , window_started_at: null
      , total_tokens: 100
      , used_tokens: 0
      })

      const result = tryAcquireToken('id', 200)

      expect(result).toStrictEqual(new Success(true))
      expect(getRawRateLimiter('id')).toStrictEqual({
        id: 'id'
      , window_duration: 50
      , window_started_at: 200
      , total_tokens: 100
      , used_tokens: 1
      })
    })

    test('acquired (not first acquire)', () => {
      setRawRateLimiter({
        id: 'id'
      , window_duration: 50
      , window_started_at: 0
      , total_tokens: 100
      , used_tokens: 0
      })

      const result = tryAcquireToken('id', 200)

      expect(result).toStrictEqual(new Success(false))
      expect(getRawRateLimiter('id')).toStrictEqual({
        id: 'id'
      , window_duration: 50
      , window_started_at: 200
      , total_tokens: 100
      , used_tokens: 1
      })
    })

    test('cannot acquire because total tokens is 0', () => {
      setRawRateLimiter({
        id: 'id'
      , window_duration: 50
      , window_started_at: null
      , total_tokens: 0
      , used_tokens: 0
      })

      const result = tryAcquireToken('id', 200)

      expect(result).toStrictEqual(new Unreachable())
      expect(getRawRateLimiter('id')).toStrictEqual({
        id: 'id'
      , window_duration: 50
      , window_started_at: 200
      , total_tokens: 0
      , used_tokens: 0
      })
    })
  })

  describe('in window', () => {
    test('acquired beccause used tokens < total tokens', () => {
      setRawRateLimiter({
        id: 'id'
      , window_duration: 50
      , window_started_at: 200
      , total_tokens: 100
      , used_tokens: 0
      })

      const result = tryAcquireToken('id', 250)

      expect(result).toStrictEqual(new Success(false))
      expect(getRawRateLimiter('id')).toStrictEqual({
        id: 'id'
      , window_duration: 50
      , window_started_at: 200
      , total_tokens: 100
      , used_tokens: 1
      })
    })

    test('cannot acquire because used tokens = total tokens', () => {
      setRawRateLimiter({
        id: 'id'
      , window_duration: 50
      , window_started_at: 200
      , total_tokens: 100
      , used_tokens: 100
      })

      const result = tryAcquireToken('id', 250)

      expect(result).toStrictEqual(new WaitForNextWindow(0))
      expect(getRawRateLimiter('id')).toStrictEqual({
        id: 'id'
      , window_duration: 50
      , window_started_at: 200
      , total_tokens: 100
      , used_tokens: 100
      })
    })

    test('cannot acquire because total tokens is 0', () => {
      setRawRateLimiter({
        id: 'id'
      , window_duration: 50
      , window_started_at: 200
      , total_tokens: 0
      , used_tokens: 0
      })

      const result = tryAcquireToken('id', 250)

      expect(result).toStrictEqual(new Unreachable())
      expect(getRawRateLimiter('id')).toStrictEqual({
        id: 'id'
      , window_duration: 50
      , window_started_at: 200
      , total_tokens: 0
      , used_tokens: 0
      })
    })
  })

  describe('window ended', () => {
    test('acquired', () => {
      setRawRateLimiter({
        id: 'id'
      , window_duration: 50
      , window_started_at: 200
      , total_tokens: 100
      , used_tokens: 0
      })

      const result = tryAcquireToken('id', 251)

      expect(result).toStrictEqual(new Success(false))
      expect(getRawRateLimiter('id')).toStrictEqual({
        id: 'id'
      , window_duration: 50
      , window_started_at: 251
      , total_tokens: 100
      , used_tokens: 1
      })
    })

    test('cannot acquire because total tokens is 0', () => {
      setRawRateLimiter({
        id: 'id'
      , window_duration: 50
      , window_started_at: 100
      , total_tokens: 0
      , used_tokens: 0
      })

      const result = tryAcquireToken('id', 151)

      expect(result).toStrictEqual(new Unreachable())
      expect(getRawRateLimiter('id')).toStrictEqual({
        id: 'id'
      , window_duration: 50
      , window_started_at: 151
      , total_tokens: 0
      , used_tokens: 0
      })
    })
  })
})
