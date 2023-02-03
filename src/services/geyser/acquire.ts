import { FastifyPluginAsync } from 'fastify'
import { namespaceSchema } from '@src/schema.js'
import { AbortController } from 'extra-abort'
import { IAPI } from '@api/contract.js'

export const routes: FastifyPluginAsync<{ api: IAPI }> = async (server, { api }) => {
  server.get<{
    Params: { namespace: string }
  }>(
    '/geyser/:namespace'
  , {
      schema: {
        params: { namespace: namespaceSchema }
      , response: {
          200: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const controller = new AbortController()
      req.raw.on('close', () => controller.abort())

      const namespace = req.params.namespace

      await api.Geyser.acquire(namespace, controller.signal)
      return reply
        .status(204)
        .send()
    }
  )
}
