import { FastifyPluginAsync } from 'fastify'
import { rateLimiterIdSchema } from '@src/schema.js'
import { AbortController } from 'extra-abort'
import { IAPI } from '@src/contract.js'
import { RateLimiterNotFound } from '@src/errors.js'

export const routes: FastifyPluginAsync<{ API: IAPI }> = async (server, { API }) => {
  server.post<{
    Params: { id: string }
  }>(
    '/rate-limiters/:id/acquire'
  , {
      schema: {
        params: { id: rateLimiterIdSchema }
      , response: {
          204: { type: 'null' }
        , 404: { type: 'null' }
        , 503: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const controller = new AbortController()
      req.raw.on('close', () => controller.abort())

      const rateLimiterId = req.params.id

      try {
        await API.acquireToken(rateLimiterId, controller.signal)

        return reply
          .status(204)
          .send()
      } catch (e) {
        if (e instanceof RateLimiterNotFound) {
          return reply
            .status(404)
            .send()
        }

        throw e
      }
    }
  )
}
