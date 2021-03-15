import { FastifyPluginAsync } from 'fastify'
import { idSchema } from '@src/schema'

export const routes: FastifyPluginAsync<{ Core: ICore }> = async function routes(server, { Core }) {
  server.get(
    '/geyser-with-configurations'
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
      const result = await Core.Configuration.getAllIds()
      reply.send(result)
    }
  )

  server.get<{
    Params: { id: string }
  }>(
    '/geyser/:id/configurations'
  , {
      schema: {
        params: { id: idSchema }
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
      const id = req.params.id
      const result = await Core.Configuration.get(id)
      reply.send(result)
    }
  )

  server.put<{
    Params: { id: string }
    Body: number
  }>(
    '/geyser/:id/configurations/duration'
  , {
      schema: {
        params: { id: idSchema }
      , body: { type: 'number' }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const id = req.params.id
      const val = req.body
      await Core.Configuration.setDuration(id, val)
      reply.status(204).send()
    }
  )

  server.delete<{
    Params: { id: string }
  }>(
    '/geyser/:id/configurations/duration'
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
      await Core.Configuration.unsetDuration(id)
      reply.status(204).send()
    }
  )

  server.put<{
    Params: { id: string }
    Body: number
  }>(
    '/geyser/:id/configurations/limit'
  , {
      schema: {
        params: { id: idSchema }
      , body: { type: 'number' }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const id = req.params.id
      const val = req.body
      await Core.Configuration.setLimit(id, val)
      reply.status(204).send()
    }
  )

  server.delete<{
    Params: { id: string }
  }>(
    '/geyser/:id/configurations/limit'
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
      await Core.Configuration.unsetLimit(id)
      reply.status(204).send()
    }
  )
}
