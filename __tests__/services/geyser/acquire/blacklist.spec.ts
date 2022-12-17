import { startService, stopService, getAddress } from '@test/utils'
import { AccessControlDAO } from '@dao'
import { fetch } from 'extra-fetch'
import { get } from 'extra-request'
import { url, pathname } from 'extra-request/lib/es2018/transformers'
import { prepareGeyser } from './utils'

jest.mock('@dao/config-in-sqlite3/database')

beforeEach(startService)
afterEach(stopService)

describe('blacklist', () => {
  describe('enabled', () => {
    describe('namespace in blacklist', () => {
      it('403', async () => {
        process.env.GEYSER_LIST_BASED_ACCESS_CONTROL = 'blacklist'
        const namespace = 'namespace'
        await prepareGeyser(namespace)
        await AccessControlDAO.addBlacklistItem(namespace)

        const res = await fetch(get(
          url(getAddress())
        , pathname(`/geyser/${namespace}`)
        ))

        expect(res.status).toBe(403)
      })
    })

    describe('namespace not in blacklist', () => {
      it('204', async () => {
        process.env.GEYSER_LIST_BASED_ACCESS_CONTROL = 'blacklist'
        const namespace = 'namespace'
        await prepareGeyser(namespace)

        const res = await fetch(get(
          url(getAddress())
        , pathname(`/geyser/${namespace}`)
        ))

        expect(res.status).toBe(204)
      })
    })
  })

  describe('disabled', () => {
    describe('namespace in blacklist', () => {
      it('204', async () => {
        const namespace = 'namespace'
        await prepareGeyser(namespace)
        await AccessControlDAO.addBlacklistItem(namespace)

        const res = await fetch(get(
          url(getAddress())
        , pathname(`/geyser/${namespace}`)
        ))

        expect(res.status).toBe(204)
      })
    })
  })
})
