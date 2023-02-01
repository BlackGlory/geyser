import { expectMatchSchema, startService, stopService, getAddress } from '@test/utils.js'
import { tokenSchema } from '@src/schema.js'
import { fetch } from 'extra-fetch'
import { get, put, del } from 'extra-request'
import { url, pathname, headers } from 'extra-request/transformers'
import { toJSON } from 'extra-response'
import { createAuthHeaders } from './utils.js'

beforeEach(startService)
afterEach(stopService)

describe('TBAC', () => {
  describe('GET /admin/geyser-with-tokens', () => {
    describe('auth', () => {
      it('200', async () => {
        process.env.GEYSER_ADMIN_PASSWORD = 'password'

        const res = await fetch(get(
          url(getAddress())
        , pathname('/admin/geyser-with-tokens')
        , headers(createAuthHeaders())
        ))

        expect(res.status).toBe(200)
        expectMatchSchema(await toJSON(res), {
          type: 'array'
        , items: { type: 'string' }
        })
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const res = await fetch(get(
          url(getAddress())
        , pathname('/admin/geyser-with-tokens')
        ))

        expect(res.status).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.GEYSER_ADMIN_PASSWORD = 'password'

        const res = await fetch(get(
          url(getAddress())
        , pathname('/admin/geyser-with-tokens')
        , headers(createAuthHeaders('bad'))
        ))

        expect(res.status).toBe(401)
      })
    })
  })

  describe('GET /admin/geyser/:namespace/tokens', () => {
    describe('auth', () => {
      it('200', async () => {
        process.env.GEYSER_ADMIN_PASSWORD = 'password'
        const namespace = 'namespace'

        const res = await fetch(get(
          url(getAddress())
        , pathname(`/admin/geyser/${namespace}/tokens`)
        , headers(createAuthHeaders())
        ))

        expect(res.status).toBe(200)
        expectMatchSchema(await toJSON(res), {
          type: 'array'
        , items: {
            type: 'object'
          , properties: {
              token: tokenSchema
            , acquire: { type: 'boolean' }
            , consume: { type: 'boolean' }
            , clear: { type: 'boolean' }
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
        , pathname(`/admin/geyser/${namespace}/tokens`)
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
        , pathname(`/admin/geyser/${namespace}/tokens`)
        , headers(createAuthHeaders('bad'))
        ))

        expect(res.status).toBe(401)
      })
    })
  })

  describe('PUT /admin/geyser/:namespace/tokens/:token/acquire', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.GEYSER_ADMIN_PASSWORD = 'password'
        const namespace = 'namespace'
        const token = 'token'

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/admin/geyser/${namespace}/tokens/${token}/acquire`)
        , headers(createAuthHeaders())
        ))

        expect(res.status).toBe(204)
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const namespace = 'namespace'
        const token = 'token'

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/admin/geyser/${namespace}/tokens/${token}/acquire`)
        ))

        expect(res.status).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.GEYSER_ADMIN_PASSWORD = 'password'
        const namespace = 'namespace'
        const token = 'token'

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/admin/geyser/${namespace}/tokens/${token}/acquire`)
        , headers(createAuthHeaders('bad'))
        ))

        expect(res.status).toBe(401)
      })
    })
  })

  describe('DELETE /admin/geyser/:namespace/tokens/:token/acquire', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.GEYSER_ADMIN_PASSWORD = 'password'
        const namespace = 'namespace'
        const token = 'token'

        const res = await fetch(del(
          url(getAddress())
        , pathname(`/admin/geyser/${namespace}/tokens/${token}/acquire`)
        , headers(createAuthHeaders())
        ))

        expect(res.status).toBe(204)
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const namespace = 'namespace'
        const token = 'token'

        const res = await fetch(del(
          url(getAddress())
        , pathname(`/admin/geyser/${namespace}/tokens/${token}/acquire`)
        ))

        expect(res.status).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.GEYSER_ADMIN_PASSWORD = 'password'
        const namespace = 'namespace'
        const token = 'token'

        const res = await fetch(del(
          url(getAddress())
        , pathname(`/admin/geyser/${namespace}/tokens/${token}/acquire`)
        , headers(createAuthHeaders('bad'))
        ))

        expect(res.status).toBe(401)
      })
    })
  })
})
