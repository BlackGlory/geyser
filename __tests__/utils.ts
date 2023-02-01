import * as ConfigInSqlite3 from '@dao/config/database.js'
import { resetGeyserMap } from '@dao/data/geyser/geyser-map.js'
import { resetCache } from '@env/cache.js'
import { buildServer } from '@src/server.js'
import Ajv from 'ajv'

const ajv = new Ajv.default()
let server: ReturnType<typeof buildServer>
let address: string

export function getAddress() {
  return address
}

export async function startService() {
  await initializeDatabases()
  server = buildServer()
  address = await server.listen()
}

export async function stopService() {
  await server.close()
  clearDatabases()
  resetGeyserMap()
  resetEnvironment()
}

export async function initializeDatabases() {
  ConfigInSqlite3.openDatabase()
  await ConfigInSqlite3.prepareDatabase()
}

export async function clearDatabases() {
  ConfigInSqlite3.closeDatabase()
}

async function resetEnvironment() {
  // assigning a property on `process.env` will implicitly convert the value to a string.
  // use `delete` to delete a property from `process.env`.
  // see also: https://nodejs.org/api/process.html#process_process_env
  delete process.env.GEYSER_ADMIN_PASSWORD
  delete process.env.GEYSER_LIST_BASED_ACCESS_CONTROL
  delete process.env.GEYSER_TOKEN_BASED_ACCESS_CONTROL
  delete process.env.GEYSER_ACQUIRE_TOKEN_REQUIRED
  delete process.env.GEYSER_DURATION
  delete process.env.GEYSER_LIMIT

  // reset memoize
  resetCache()
}

export function expectMatchSchema(data: unknown, schema: object): void {
  if (!ajv.validate(schema, data)) {
    throw new Error(ajv.errorsText())
  }
}
