import { FastifyPluginAsync } from 'fastify'
import { namespaceSchema, tokenSchema } from '@src/schema.js'

export const routes: FastifyPluginAsync<{ Core: ICore }> = async function routes(server, { Core }) {
  // get all namespaces
  server.get<{ Params: { namespace: string }}>(
    '/geyser-with-tokens'
  , {
      schema: {
        params: { namespace: namespaceSchema }
      , response: {
          200: {
            type: 'array'
          , items: { type: 'string' }
          }
        }
      }
    }
  , async (req, reply) => {
      const result = await Core.TBAC.Token.getAllNamespaces()
      return reply.send(result)
    }
  )

  // get all tokens
  server.get<{
    Params: { namespace: string }
  }>(
    '/geyser/:namespace/tokens'
  , {
      schema: {
        params: { namespace: namespaceSchema }
      , response: {
          200: {
            type: 'array'
          , items: {
              type: 'object'
            , properties: {
                token: tokenSchema
              , acquire: { type: 'boolean' }
              }
            }
          }
        }
      }
    }
  , async (req, reply) => {
      const namespace = req.params.namespace
      const result = await Core.TBAC.Token.getAll(namespace)
      return reply.send(result)
    }
  )

  // acquire token
  server.put<{
    Params: { token: string, namespace: string }
  }>(
    '/geyser/:namespace/tokens/:token/acquire'
  , {
      schema: {
        params: {
          token: tokenSchema
        , namespace: namespaceSchema
        }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const namespace = req.params.namespace
      const token = req.params.token
      await Core.TBAC.Token.setAcquireToken(namespace, token)
      return reply
        .status(204)
        .send()
    }
  )

  server.delete<{
    Params: { token: string, namespace: string }
  }>(
    '/geyser/:namespace/tokens/:token/acquire'
  , {
      schema: {
        params: {
          token: tokenSchema
        , namespace: namespaceSchema
        }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const namespace = req.params.namespace
      const token = req.params.token
      await Core.TBAC.Token.unsetAcquireToken(namespace, token)
      return reply
        .status(204)
        .send()
    }
  )
}
