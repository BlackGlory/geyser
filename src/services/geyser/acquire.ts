import { FastifyPluginAsync } from 'fastify'
import { idSchema, tokenSchema } from '@src/schema'

export const routes: FastifyPluginAsync<{ Core: ICore }> = async function routes(server, { Core }) {
  server.get<{
    Params: { id: string }
    Querystring: { token?: string }
  }>(
    '/geyser/:id'
  , {
      schema: {
        params: { id: idSchema }
      , querystring: { token: tokenSchema }
      , response: {
          200: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const controller = new AbortController()
      req.raw.on('close', () => controller.abort())

      const id = req.params.id
      const token = req.query.token

      try {
        await Core.Blacklist.check(id)
        await Core.Whitelist.check(id)
        await Core.TBAC.checkAcquirePermission(id, token)
      } catch (e) {
        if (e instanceof Core.Blacklist.Forbidden) return reply.status(403).send()
        if (e instanceof Core.Whitelist.Forbidden) return reply.status(403).send()
        if (e instanceof Core.TBAC.Unauthorized) return reply.status(401).send()
        throw e
      }

      await Core.Geyser.acquire(id, controller.signal)
      reply.status(204).send()
    }
  )
}
