import { startService, stopService, getAddress } from '@test/utils.js'
import { AccessControlDAO } from '@dao/index.js'
import { fetch } from 'extra-fetch'
import { get } from 'extra-request'
import { url, pathname } from 'extra-request/transformers'
import { prepareGeyser } from './utils.js'

beforeEach(startService)
afterEach(stopService)

describe('whitelist', () => {
  describe('enabled', () => {
    describe('namespace in whitelist', () => {
      it('204', async () => {
        process.env.GEYSER_LIST_BASED_ACCESS_CONTROL = 'whitelist'
        const namespace = 'namespace'
        await prepareGeyser(namespace)
        await AccessControlDAO.addWhitelistItem(namespace)

        const res = await fetch(get(
          url(getAddress())
        , pathname(`/geyser/${namespace}`)
        ))

        expect(res.status).toBe(204)
      })
    })

    describe('namespace not in whitelist', () => {
      it('403', async () => {
        process.env.GEYSER_LIST_BASED_ACCESS_CONTROL = 'whitelist'
        const namespace = 'namespace'
        await prepareGeyser(namespace)

        const res = await fetch(get(
          url(getAddress())
        , pathname(`/geyser/${namespace}`)
        ))

        expect(res.status).toBe(403)
      })
    })
  })

  describe('disabled', () => {
    describe('namespace not in whitelist', () => {
      it('204', async () => {
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
})
