import { go } from '@blackglory/go'
import { AbortController } from 'abort-controller'
import * as ConfigInSqlite3 from '@src/dao/config-in-sqlite3/database'
import { buildServer } from './server'
import { PORT, HOST, CI } from '@env'
import { callNextTickEverySecond } from './schedule'

const tickLoopController = new AbortController()

process.on('exit', () => {
  tickLoopController.abort()

  ConfigInSqlite3.closeDatabase()
})
process.on('SIGHUP', () => process.exit(128 + 1))
process.on('SIGINT', () => process.exit(128 + 2))
process.on('SIGTERM', () => process.exit(128 + 15))

go(async () => {
  ConfigInSqlite3.openDatabase()
  await ConfigInSqlite3.prepareDatabase()

  const server = buildServer()
  await server.listen(PORT(), HOST())
  if (CI()) await process.exit()

  callNextTickEverySecond(tickLoopController.signal)

  process.send?.('ready')
})
