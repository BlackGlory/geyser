import { FastifyPluginAsync } from 'fastify'
import { namespaceSchema } from '@src/schema.js'

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
      return reply.send(result)
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
            duration: { type: 'number', nullable: true }
          , limit: { type: 'number', nullable: true }
          }
        }
      }
    }
  , async (req, reply) => {
      const namespace = req.params.namespace
      const result = await Core.Configuration.get(namespace)
      return reply.send(result)
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
      return reply
        .status(204)
        .send()
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
      return reply
        .status(204)
        .send()
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
      return reply
        .status(204)
        .send()
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
      return reply
        .status(204)
        .send()
    }
  )
}
