import { FastifyPluginAsync } from 'fastify'
import { rateLimiterIdSchema } from '@src/schema.js'
import { IAPI, IRateLimiterConfiguration } from '@src/contract.js'

export const routes: FastifyPluginAsync<{ API: IAPI }> = async (server, { API }) => {
  server.get<{
    Params: { id: string }
    Reply: IRateLimiterConfiguration
  }>(
    '/rate-limiters/:id'
  , {
      schema: {
        params: { id: rateLimiterIdSchema }
      , response: {
          200: {
            duration: { type: ['integer', 'null'] }
          , limit: { type: ['integer', 'null'] }
          }
        }
      }
    }
  , async (req, reply) => {
      const rateLimiterId = req.params.id

      const config = API.getRateLimiter(rateLimiterId)
      if (config) {
        return reply
          .status(200)
          .send(config)
      } else {
        return reply
          .status(404)
          .send()
      }
    }
  )
}
