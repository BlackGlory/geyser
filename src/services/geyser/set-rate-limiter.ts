import { FastifyPluginAsync } from 'fastify'
import { rateLimiterIdSchema } from '@src/schema.js'
import { IAPI, IRateLimiterConfig } from '@src/contract.js'

export const routes: FastifyPluginAsync<{ API: IAPI }> = async (server, { API }) => {
  server.put<{
    Params: { id: string }
    Body: IRateLimiterConfig
  }>(
    '/rate-limiters/:id'
  , {
      schema: {
        params: { id: rateLimiterIdSchema }
      , body: {
          duration: { type: ['integer', 'null'] }
        , limit: { type: ['integer', 'null'] }
        }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const rateLimiterId = req.params.id
      const config = req.body

      API.setRateLimiter(rateLimiterId, config)

      return reply
        .status(204)
        .send()
    }
  )
}
