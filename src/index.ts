import { go } from '@blackglory/go'
import { AbortController } from 'extra-abort'
import * as ConfigInSqlite3 from '@src/dao/config-in-sqlite3/database'
import { buildServer } from './server'
import { PORT, HOST, NODE_ENV, NodeEnv } from '@env'
import { callNextTickEverySecond } from './schedule'
import { youDied } from 'you-died'

go(async () => {
  ConfigInSqlite3.openDatabase()
  youDied(() => ConfigInSqlite3.closeDatabase())
  await ConfigInSqlite3.prepareDatabase()

  const server = buildServer()
  await server.listen(PORT(), HOST())
  if (NODE_ENV() === NodeEnv.Test) process.exit()

  const tickLoopController = new AbortController()
  callNextTickEverySecond(tickLoopController.signal)
  youDied(() => tickLoopController.abort())

  process.send?.('ready')
})
