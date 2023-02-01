import { FastifyPluginAsync } from 'fastify'
import { routes as acquireRoutes } from './acquire.js'
import { IAPI } from '@api/contract.js'

export const routes: FastifyPluginAsync<{ api: IAPI }> = async (server, { api }) => {
  server.register(acquireRoutes, { api: api })
}
