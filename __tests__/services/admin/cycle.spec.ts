import { startService, stopService, getAddress } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { fetch } from 'extra-fetch'
import { del } from 'extra-request'
import { url, pathname, headers } from 'extra-request/lib/es2018/transformers'

jest.mock('@dao/config-in-sqlite3/database')
expect.extend(matchers)

beforeEach(startService)
afterEach(stopService)

describe('Cycle', () => {
  describe('DELETE /admin/:namespace/cycle', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.GEYSER_ADMIN_PASSWORD = 'password'

        const res = await fetch(del(
          url(getAddress())
        , pathname('/admin/geyser/test/cycle')
        , headers(createAuthHeaders())
        ))

        expect(res.status).toBe(204)
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const res = await fetch(del(
          url(getAddress())
        , pathname('/admin/geyser/test/cycle')
        ))

        expect(res.status).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.GEYSER_ADMIN_PASSWORD = 'password'

        const res = await fetch(del(
          url(getAddress())
        , pathname('/admin/geyser/test/cycle')
        , headers(createAuthHeaders('bad'))
        ))

        expect(res.status).toBe(401)
      })
    })
  })
})

function createAuthHeaders(adminPassword?: string) {
  return {
    'Authorization': `Bearer ${ adminPassword ?? process.env.GEYSER_ADMIN_PASSWORD }`
  }
}