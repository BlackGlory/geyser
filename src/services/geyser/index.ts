import { FastifyPluginAsync } from 'fastify'
import { routes as getAllRateLimiterIdsRoutes } from './get-all-rate-limiter-ids.js'
import { routes as getRateLimiterRoutes } from './get-rate-limiter.js'
import { routes as setRateLimiterRoutes } from './set-rate-limiter.js'
import { routes as removeRateLimiterRoutes } from './remove-rate-limiter.js'
import { routes as resetRateLimiterRoutes } from './reset-rate-limiter.js'
import { routes as acquireTokenRoutes } from './acquire-token.js'
import { IAPI } from '@src/contract.js'

export const routes: FastifyPluginAsync<{ API: IAPI }> = async (server, { API }) => {
  await server.register(getAllRateLimiterIdsRoutes, { API })
  await server.register(getRateLimiterRoutes, { API })
  await server.register(setRateLimiterRoutes, { API })
  await server.register(removeRateLimiterRoutes, { API })
  await server.register(resetRateLimiterRoutes, { API })
  await server.register(acquireTokenRoutes, { API })
}
