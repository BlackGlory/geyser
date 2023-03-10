import { FastifyPluginAsync } from 'fastify'
import { rateLimiterIdSchema } from '@src/schema.js'
import { IAPI } from '@src/contract.js'

export const routes: FastifyPluginAsync<{ API: IAPI }> = async (server, { API }) => {
  server.delete<{
    Params: { id: string }
  }>(
    '/rate-limiters/:id'
  , {
      schema: {
        params: { id: rateLimiterIdSchema }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const rateLimiterId = req.params.id

      API.removeRateLimiter(rateLimiterId)

      return reply
        .status(204)
        .send()
    }
  )
}
