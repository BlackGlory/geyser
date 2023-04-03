import { resetCache } from '@env/cache.js'
import { startServer } from '@src/server.js'
import { WebSocket } from 'ws'
import { createClient } from '@delight-rpc/websocket'
import { IAPI } from '@src/contract.js'
import { openDatabase, closeDatabase, prepareDatabase } from '@src/database.js'
import { waitForEventEmitter } from '@blackglory/wait-for'
import { ClientProxy } from 'delight-rpc'

let closeServer: ReturnType<typeof startServer>
let address: string

export function getAddress(): string {
  return address
}

export async function startService(): Promise<void> {
  await initializeDatabases()
  closeServer = startServer('localhost', 8080)
  address = 'ws://localhost:8080'
}

export async function stopService(): Promise<void> {
  await closeServer()
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

export async function buildClient(): Promise<ClientProxy<IAPI>> {
  const ws = new WebSocket(address)
  await waitForEventEmitter(ws, 'open')
  const [client] = createClient<IAPI>(ws)
  return client
}
