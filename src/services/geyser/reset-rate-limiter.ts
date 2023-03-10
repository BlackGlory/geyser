import { FastifyPluginAsync } from 'fastify'
import { rateLimiterIdSchema } from '@src/schema.js'
import { IAPI } from '@src/contract.js'
import { RateLimiterNotFound } from '@src/errors.js'

export const routes: FastifyPluginAsync<{ API: IAPI }> = async (server, { API }) => {
  server.post<{
    Params: { id: string }
  }>(
    '/rate-limiters/:id/reset'
  , {
      schema: {
        params: { id: rateLimiterIdSchema }
      , response: {
          204: { type: 'null' }
        , 404: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const rateLimiterId = req.params.id

      try {
        API.resetRateLimiter(rateLimiterId)

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
