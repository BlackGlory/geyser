import { ImplementationOf } from 'delight-rpc'
import { IAPI } from '@src/contract.js'
import { getAllRateLimiterIds } from './get-all-rate-limiter-ids.js'
import { getRateLimiter } from './get-rate-limiter.js'
import { setRateLimiter } from './set-rate-limiter.js'
import { removeRateLimiter } from './remove-rate-limiter.js'
import { resetRateLimiter } from './reset-rate-limiter.js'
import { acquireToken } from './acquire-token.js'

export const API: ImplementationOf<IAPI> = {
  getAllRateLimiterIds
, getRateLimiter
, setRateLimiter
, removeRateLimiter
, resetRateLimiter
, acquireToken
}
