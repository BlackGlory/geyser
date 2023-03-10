import { fastify } from 'fastify'
import cors from '@fastify/cors'
import { routes as geyser } from '@services/geyser/index.js'
import { routes as robots } from '@services/robots/index.js'
import { routes as health } from '@services/health/index.js'
import { NODE_ENV, NodeEnv } from '@env/index.js'
import { API } from '@apis/index.js'
import { getPackageFilename } from '@utils/get-package-filename.js'
import { readJSONFileSync } from 'extra-filesystem'
import { isntUndefined, isString } from '@blackglory/prelude'
import { assert } from '@blackglory/errors'
import semver from 'semver'

type LoggerLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal'

export async function buildServer() {
  const pkg = readJSONFileSync<{ version: string }>(getPackageFilename())

  const server = fastify({
    logger: getLoggerOptions()
  , maxParamLength: 600
  , forceCloseConnections: true
  })

  server.addHook('onRequest', async (req, reply) => {
    // eslint-disable-next-line
    reply.header('Cache-Control', 'private, no-cache')
  })
  server.addHook('onRequest', async (req, reply) => {
    const acceptVersion = req.headers['accept-version']
    if (isntUndefined(acceptVersion)) {
      assert(isString(acceptVersion), 'Accept-Version must be string')
      if (!semver.satisfies(pkg.version, acceptVersion)) {
        return reply.status(400).send()
      }
    }
  })

  await server.register(cors, { origin: true })
  await server.register(geyser, { API })
  await server.register(robots)
  await server.register(health)

  return server
}

function getLoggerOptions(): { level: LoggerLevel } | boolean {
  switch (NODE_ENV()) {
    case NodeEnv.Test: return false
    case NodeEnv.Production: return { level: 'error' }
    case NodeEnv.Development: return { level: 'trace' }
    default: return false
  }
}
