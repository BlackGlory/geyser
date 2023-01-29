import { expectMatchSchema, startService, stopService, getAddress } from '@test/utils.js'
import { fetch } from 'extra-fetch'
import { get, put, del } from 'extra-request'
import { url, pathname, headers, json } from 'extra-request/transformers'
import { toJSON } from 'extra-response'

beforeEach(startService)
afterEach(stopService)

describe('Configuration', () => {
  describe('GET /admin/geyser-with-config', () => {
    describe('auth', () => {
      it('200', async () => {
        process.env.GEYSER_ADMIN_PASSWORD = 'password'

        const res = await fetch(get(
          url(getAddress())
        , pathname('/admin/geyser-with-config')
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
        , pathname('/admin/geyser-with-config')
        ))

        expect(res.status).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.GEYSER_ADMIN_PASSWORD = 'password'

        const res = await fetch(get(
          url(getAddress())
        , pathname('/admin/geyser-with-config')
        , headers(createAuthHeaders('bad'))
        ))

        expect(res.status).toBe(401)
      })
    })
  })

  describe('GET /admin/geyser/:namespace/config', () => {
    describe('auth', () => {
      it('200', async () => {
        process.env.GEYSER_ADMIN_PASSWORD = 'password'
        const namespace = 'namespace'

        const res = await fetch(get(
          url(getAddress())
        , pathname(`/admin/geyser/${namespace}/config`)
        , headers(createAuthHeaders())
        ))

        expect(res.status).toBe(200)
        expectMatchSchema(await toJSON(res), {
          type: 'object'
        , properties: {
            duration: {
              oneOf: [
                { type: 'number' }
              , { type: 'null' }
              ]
            }
          , limit: {
              oneOf: [
                { type: 'number' }
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
        , pathname(`/admin/geyser/${namespace}/config`)
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
        , pathname(`/admin/geyser/${namespace}/config`)
        , headers(createAuthHeaders('bad'))
        ))

        expect(res.status).toBe(401)
      })
    })
  })

  describe('PUT /admin/geyser/:namespace/config/duration', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.GEYSER_ADMIN_PASSWORD = 'password'
        const namespace = 'namespace'
        const val = 100

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/admin/geyser/${namespace}/config/duration`)
        , headers(createAuthHeaders())
        , json(val)
        ))

        expect(res.status).toBe(204)
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const namespace = 'namespace'
        const val = 100

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/admin/geyser/${namespace}/config/duration`)
        , json(val)
        ))

        expect(res.status).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.GEYSER_ADMIN_PASSWORD = 'password'
        const namespace = 'namespace'
        const val = 100

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/admin/geyser/${namespace}/config/duration`)
        , headers(createAuthHeaders('bad'))
        , json(val)
        ))

        expect(res.status).toBe(401)
      })
    })
  })

  describe('DELETE /admin/geyser/:namespace/config/duration', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.GEYSER_ADMIN_PASSWORD = 'password'
        const namespace = 'namespace'

        const res = await fetch(del(
          url(getAddress())
        , pathname(`/admin/geyser/${namespace}/config/duration`)
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
        , pathname(`/admin/geyser/${namespace}/config/duration`)
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
        , pathname(`/admin/geyser/${namespace}/config/duration`)
        , headers(createAuthHeaders('bad'))
        ))

        expect(res.status).toBe(401)
      })
    })
  })

  describe('PUT /admin/geyser/:namespace/config/limit', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.GEYSER_ADMIN_PASSWORD = 'password'
        const namespace = 'namespace'
        const val = 100

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/admin/geyser/${namespace}/config/limit`)
        , headers(createAuthHeaders())
        , json(val)
        ))

        expect(res.status).toBe(204)
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const namespace = 'namespace'
        const val = 100

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/admin/geyser/${namespace}/config/limit`)
        , json(val)
        ))

        expect(res.status).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.GEYSER_ADMIN_PASSWORD = 'password'
        const namespace = 'namespace'
        const val = 100

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/admin/geyser/${namespace}/config/limit`)
        , headers(createAuthHeaders('bad'))
        , json(val)
        ))

        expect(res.status).toBe(401)
      })
    })
  })

  describe('DELETE /admin/geyser/:namespace/config/limit', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.GEYSER_ADMIN_PASSWORD = 'password'
        const namespace = 'namespace'

        const res = await fetch(del(
          url(getAddress())
        , pathname(`/admin/geyser/${namespace}/config/limit`)
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
        , pathname(`/admin/geyser/${namespace}/config/limit`)
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
        , pathname(`/admin/geyser/${namespace}/config/limit`)
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
