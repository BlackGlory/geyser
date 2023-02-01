import { go } from '@blackglory/prelude'
import { AbortController } from 'extra-abort'
import * as ConfigInSqlite3 from '@src/dao/config/database.js'
import { buildServer } from './server.js'
import { PORT, HOST, NODE_ENV, NodeEnv } from '@env/index.js'
import { callNextTickEverySecond } from './schedule.js'
import { youDied } from 'you-died'

// eslint-disable-next-line
go(async () => {
  ConfigInSqlite3.openDatabase()
  youDied(() => ConfigInSqlite3.closeDatabase())
  await ConfigInSqlite3.prepareDatabase()

  const server = await buildServer()
  await server.listen({
    host: HOST()
  , port: PORT()
  })
  if (NODE_ENV() === NodeEnv.Test) process.exit()

  const tickLoopController = new AbortController()
  callNextTickEverySecond(tickLoopController.signal)
  youDied(() => tickLoopController.abort())

  process.send?.('ready')
})
