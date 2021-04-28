import { FastifyPluginAsync } from 'fastify'
import { namespaceSchema } from '@src/schema'

export const routes: FastifyPluginAsync<{ Core: ICore }> = async function routes(server, { Core }) {
  server.get(
    '/geyser-with-config'
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
      const result = await Core.Configuration.getAllNamespaces()
      reply.send(result)
    }
  )

  server.get<{
    Params: { namespace: string }
  }>(
    '/geyser/:namespace/config'
  , {
      schema: {
        params: { namespace: namespaceSchema }
      , response: {
          200: {
            duration: {
              anyOf: [
                { type: 'number' }
              , { type: 'null' }
              ]
            }
          , limit: {
              anyOf: [
                { type: 'number' }
              , { type: 'null' }
              ]
            }
          }
        }
      }
    }
  , async (req, reply) => {
      const namespace = req.params.namespace
      const result = await Core.Configuration.get(namespace)
      reply.send(result)
    }
  )

  server.put<{
    Params: { namespace: string }
    Body: number
  }>(
    '/geyser/:namespace/config/duration'
  , {
      schema: {
        params: { namespace: namespaceSchema }
      , body: { type: 'number' }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const namespace = req.params.namespace
      const val = req.body
      await Core.Configuration.setDuration(namespace, val)
      reply.status(204).send()
    }
  )

  server.delete<{
    Params: { namespace: string }
  }>(
    '/geyser/:namespace/config/duration'
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
      await Core.Configuration.unsetDuration(namespace)
      reply.status(204).send()
    }
  )

  server.put<{
    Params: { namespace: string }
    Body: number
  }>(
    '/geyser/:namespace/config/limit'
  , {
      schema: {
        params: { namespace: namespaceSchema }
      , body: { type: 'number' }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const namespace = req.params.namespace
      const val = req.body
      await Core.Configuration.setLimit(namespace, val)
      reply.status(204).send()
    }
  )

  server.delete<{
    Params: { namespace: string }
  }>(
    '/geyser/:namespace/config/limit'
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
      await Core.Configuration.unsetLimit(namespace)
      reply.status(204).send()
    }
  )
}
