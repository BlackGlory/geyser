import { go } from '@blackglory/prelude'
import { closeDatabase, openDatabase, prepareDatabase } from '@src/database.js'
import { buildServer } from './server.js'
import { PORT, HOST, NODE_ENV, NodeEnv } from '@env/index.js'
import { youDied } from 'you-died'

// eslint-disable-next-line
go(async () => {
  openDatabase()
  youDied(closeDatabase)
  await prepareDatabase()

  const server = await buildServer()
  await server.listen({
    host: HOST()
  , port: PORT()
  })
  if (NODE_ENV() === NodeEnv.Test) process.exit()

  process.send?.('ready')
})
