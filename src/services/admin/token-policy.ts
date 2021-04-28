import { FastifyPluginAsync } from 'fastify'
import { namespaceSchema } from '@src/schema'

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
      const result = await Core.TBAC.TokenPolicy.getAllNamespaces()
      reply.send(result)
    }
  )

  server.get<{
    Params: { namespace: string }
  }>(
    '/geyser/:namespace/token-policies'
  , {
      schema: {
        params: { namespace: namespaceSchema }
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
      const namespace = req.params.namespace
      const result = await Core.TBAC.TokenPolicy.get(namespace)
      reply.send(result)
    }
  )

  server.put<{
    Params: { namespace: string }
  , Body: boolean
  }>(
    '/geyser/:namespace/token-policies/acquire-token-required'
  , {
      schema: {
        params: { namespace: namespaceSchema }
      , body: { type: 'boolean' }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const namespace = req.params.namespace
      const val = req.body
      await Core.TBAC.TokenPolicy.setAcquireTokenRequired(namespace, val)
      reply.status(204).send()
    }
  )

  server.delete<{
    Params: { namespace: string}
  }>(
    '/geyser/:namespace/token-policies/acquire-token-required'
  , {
      schema: {
        params: { namespace: namespaceSchema }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const namespace = req.params.namespace
      await Core.TBAC.TokenPolicy.unsetAcquireTokenRequired(namespace)
      reply.status(204).send()
    }
  )
}
