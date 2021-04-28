import { startService, stopService, getAddress } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { fetch } from 'extra-fetch'
import { get, put, del } from 'extra-request'
import { url, pathname, headers, json } from 'extra-request/lib/es2018/transformers'
import { toJSON } from 'extra-response'

jest.mock('@dao/config-in-sqlite3/database')
expect.extend(matchers)

beforeEach(startService)
afterEach(stopService)

describe('TokenPolicy', () => {
  describe('GET /admin/geyser-with-token-policies', () => {
    describe('auth', () => {
      it('200', async () => {
        process.env.GEYSER_ADMIN_PASSWORD = 'password'

        const res = await fetch(get(
          url(getAddress())
        , pathname('/admin/geyser-with-token-policies')
        , headers(createAuthHeaders())
        ))

        expect(res.status).toBe(200)
        expect(await toJSON(res)).toMatchSchema({
          type: 'array'
        , items: { type: 'string' }
        })
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const res = await fetch(get(
          url(getAddress())
        , pathname('/admin/geyser-with-token-policies')
        ))

        expect(res.status).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.GEYSER_ADMIN_PASSWORD = 'password'

        const res = await fetch(get(
          url(getAddress())
        , pathname('/admin/geyser-with-token-policies')
        , headers(createAuthHeaders('bad'))
        ))

        expect(res.status).toBe(401)
      })
    })
  })

  describe('GET /admin/geyser/:namespace/token-policies', () => {
    describe('auth', () => {
      it('200', async () => {
        process.env.GEYSER_ADMIN_PASSWORD = 'password'
        const namespace = 'namespace'

        const res = await fetch(get(
          url(getAddress())
        , pathname(`/admin/geyser/${namespace}/token-policies`)
        , headers(createAuthHeaders())
        ))

        expect(res.status).toBe(200)
        expect(await toJSON(res)).toMatchSchema({
          type: 'object'
        , properties: {
            acquireTokenRequired: {
              oneOf: [
                { type: 'boolean' }
              , { type: 'null' }
              ]
            }
          }
        })
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const namespace = 'namespace'

        const res = await fetch(get(
          url(getAddress())
        , pathname(`/admin/geyser/${namespace}/token-policies`)
        ))

        expect(res.status).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.GEYSER_ADMIN_PASSWORD = 'password'
        const namespace = 'namespace'

        const res = await fetch(get(
          url(getAddress())
        , pathname(`/admin/geyser/${namespace}/token-policies`)
        , headers(createAuthHeaders('bad'))
        ))

        expect(res.status).toBe(401)
      })
    })
  })

  describe('PUT /admin/geyser/:namespace/token-policies/acquire-token-required', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.GEYSER_ADMIN_PASSWORD = 'password'
        const namespace = 'namespace'
        const val = true

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/admin/geyser/${namespace}/token-policies/acquire-token-required`)
        , headers(createAuthHeaders())
        , json(val)
        ))

        expect(res.status).toBe(204)
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const namespace = 'namespace'
        const val = true

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/admin/geyser/${namespace}/token-policies/acquire-token-required`)
        , json(val)
        ))

        expect(res.status).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.GEYSER_ADMIN_PASSWORD = 'password'
        const namespace = 'namespace'
        const val = true

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/admin/geyser/${namespace}/token-policies/acquire-token-required`)
        , headers(createAuthHeaders('bad'))
        , json(val)
        ))

        expect(res.status).toBe(401)
      })
    })
  })

  describe('DELETE /admin/geyser/:namespace/token-policies/acquire-token-required', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.GEYSER_ADMIN_PASSWORD = 'password'
        const namespace = 'namespace'

        const res = await fetch(del(
          url(getAddress())
        , pathname(`/admin/geyser/${namespace}/token-policies/acquire-token-required`)
        , headers(createAuthHeaders())
        ))

        expect(res.status).toBe(204)
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const namespace = 'namespace'

        const res = await fetch(del(
          url(getAddress())
        , pathname(`/admin/geyser/${namespace}/token-policies/acquire-token-required`)
        ))

        expect(res.status).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.GEYSER_ADMIN_PASSWORD = 'password'
        const namespace = 'namespace'

        const res = await fetch(del(
          url(getAddress())
        , pathname(`/admin/geyser/${namespace}/token-policies/acquire-token-required`)
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
