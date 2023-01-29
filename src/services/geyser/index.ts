import { FastifyPluginAsync } from 'fastify'
import { routes as acquireRoutes } from './acquire.js'

export const routes: FastifyPluginAsync<{ Core: ICore }> = async function routes(server, { Core }) {
  server.register(acquireRoutes, { Core })
}
