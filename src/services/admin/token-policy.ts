import { FastifyPluginAsync } from 'fastify'
import { idSchema } from '@src/schema'

export const routes: FastifyPluginAsync<{ Core: ICore }> = async function routes(server, { Core }) {
  server.get(
    '/geyser-with-token-policies'
  , {
      schema: {
        response: {
          200: {
            type: 'array'
          , items: { type: 'string' }
          }
        }
      }
    }
  , async (req, reply) => {
      const result = await Core.TBAC.TokenPolicy.getAllIds()
      reply.send(result)
    }
  )

  server.get<{
    Params: { id: string }
  }>(
    '/geyser/:id/token-policies'
  , {
      schema: {
        params: { id: idSchema }
      , response: {
          200: {
            acquireTokenRequired: {
              anyOf: [
                { type: 'boolean' }
              , { type: 'null' }
              ]
            }
          }
        }
      }
    }
  , async (req, reply) => {
      const id = req.params.id
      const result = await Core.TBAC.TokenPolicy.get(id)
      reply.send(result)
    }
  )

  server.put<{
    Params: { id: string }
  , Body: boolean
  }>(
    '/geyser/:id/token-policies/acquire-token-required'
  , {
      schema: {
        params: { id: idSchema }
      , body: { type: 'boolean' }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const id = req.params.id
      const val = req.body
      await Core.TBAC.TokenPolicy.setAcquireTokenRequired(id, val)
      reply.status(204).send()
    }
  )

  server.delete<{
    Params: { id: string}
  }>(
    '/geyser/:id/token-policies/acquire-token-required'
  , {
      schema: {
        params: { id: idSchema }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const id = req.params.id
      await Core.TBAC.TokenPolicy.unsetAcquireTokenRequired(id)
      reply.status(204).send()
    }
  )
}
