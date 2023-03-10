import { getAllRateLimiterIds as _getAllRateLimiterIds } from '@dao/get-all-rate-limiter-ids.js'

export function getAllRateLimiterIds(): string[] {
  return _getAllRateLimiterIds()
}
