import { FastifyPluginAsync } from 'fastify'
import { namespaceSchema, tokenSchema } from '@src/schema.js'
import { AbortController } from 'extra-abort'
import { IAPI } from '@api/contract.js'

export const routes: FastifyPluginAsync<{ api: IAPI }> = async (server, { api }) => {
  server.get<{
    Params: { namespace: string }
    Querystring: { token?: string }
  }>(
    '/geyser/:namespace'
  , {
      schema: {
        params: { namespace: namespaceSchema }
      , querystring: { token: tokenSchema }
      , response: {
          200: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const controller = new AbortController()
      req.raw.on('close', () => controller.abort())

      const namespace = req.params.namespace
      const token = req.query.token

      try {
        api.Blacklist.check(namespace)
        api.Whitelist.check(namespace)
        api.TBAC.checkAcquirePermission(namespace, token)
      } catch (e) {
        if (e instanceof api.Blacklist.Forbidden) return reply.status(403).send()
        if (e instanceof api.Whitelist.Forbidden) return reply.status(403).send()
        if (e instanceof api.TBAC.Unauthorized) return reply.status(401).send()
        throw e
      }

      await api.Geyser.acquire(namespace, controller.signal)
      return reply
        .status(204)
        .send()
    }
  )
}
