import { closeDatabase, openDatabase, prepareDatabase } from '@src/database.js'
import { resetCache } from '@env/cache.js'
import { buildServer } from '@src/server.js'
import { UnpackedPromise } from 'hotypes'

let server: UnpackedPromise<ReturnType<typeof buildServer>>
let address: string

export function getAddress(): string {
  return address
}

export async function startService(): Promise<void> {
  await initializeDatabases()
  server = await buildServer()
  address = await server.listen()
}

export async function stopService(): Promise<void> {
  await server.close()
  clearDatabases()
  resetEnvironment()
}

export async function initializeDatabases(): Promise<void> {
  openDatabase()
  await prepareDatabase()
}

export function clearDatabases(): void {
  closeDatabase()
}

function resetEnvironment(): void {
  // reset memoize
  resetCache()
}
