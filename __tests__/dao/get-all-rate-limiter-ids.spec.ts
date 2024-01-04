import { getAllRateLimiterIds } from '@dao/get-all-rate-limiter-ids.js'
import { initializeDatabases, clearDatabases } from '@test/utils.js'
import { setRawRateLimiter } from '@test/dao.js'

beforeEach(initializeDatabases)
afterEach(clearDatabases)

describe('getAllRateLimiterIds', () => {
  test('empty', () => {
    const result = getAllRateLimiterIds()

    expect(result).toStrictEqual([])
  })

  test('non-empty', () => {
    setRawRateLimiter({
      id: 'id'
    , window_duration: null
    , total_tokens: null
    , used_tokens: 0
    , window_started_at: null
    })

    const result = getAllRateLimiterIds()

    expect(result).toStrictEqual(['id'])
  })
})
