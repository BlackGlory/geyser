import { startService, stopService, getAddress } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { AccessControlDAO } from '@dao'
import { fetch } from 'extra-fetch'
import { get } from 'extra-request'
import { url, pathname, searchParam } from 'extra-request/lib/es2018/transformers'
import { prepareGeyser } from './utils'

jest.mock('@dao/config-in-sqlite3/database')
expect.extend(matchers)

beforeEach(startService)
afterEach(stopService)

describe('token-based access control', () => {
  describe('enabled', () => {
    describe('namespace need delete tokens', () => {
      describe('token matched', () => {
        it('204', async () => {
          process.env.GEYSER_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const namespace = 'namespace'
          const token = 'token'
          await prepareGeyser(namespace)
          await AccessControlDAO.setAcquireTokenRequired(namespace, true)
          await AccessControlDAO.setAcquireToken({ namespace: namespace, token })

          const res = await fetch(get(
            url(getAddress())
          , pathname(`/geyser/${namespace}`)
          , searchParam('token', token)
          ))

          expect(res.status).toBe(204)
        })
      })

      describe('token does not matched', () => {
        it('401', async () => {
          process.env.GEYSER_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const namespace = 'namespace'
          const token = 'token'
          await prepareGeyser(namespace)
          await AccessControlDAO.setAcquireTokenRequired(namespace, true)
          await AccessControlDAO.setAcquireToken({ namespace: namespace, token })

          const res = await fetch(get(
            url(getAddress())
          , pathname(`/geyser/${namespace}`)
          , searchParam('token', 'bad')
          ))

          expect(res.status).toBe(401)
        })
      })

      describe('no token', () => {
        it('401', async () => {
          process.env.GEYSER_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const namespace = 'namespace'
          const token = 'token'
          await prepareGeyser(namespace)
          await AccessControlDAO.setAcquireTokenRequired(namespace, true)
          await AccessControlDAO.setAcquireToken({ namespace: namespace, token })

          const res = await fetch(get(
            url(getAddress())
          , pathname(`/geyser/${namespace}`)
          ))

          expect(res.status).toBe(401)
        })
      })
    })

    describe('namespace does not need acquire tokens', () => {
      describe('ACQUIRE_TOKEN_REQUIRED=true', () => {
        it('401', async () => {
          process.env.GEYSER_TOKEN_BASED_ACCESS_CONTROL = 'true'
          process.env.GEYSER_ACQUIRE_TOKEN_REQUIRED = 'true'
          const namespace = 'namespace'
          await prepareGeyser(namespace)

          const res = await fetch(get(
            url(getAddress())
          , pathname(`/geyser/${namespace}`)
          ))

          expect(res.status).toBe(401)
        })
      })

      describe('ACQUIRE_TOKEN_REQUIRED=false', () => {
        it('204', async () => {
          process.env.GEYSER_TOKEN_BASED_ACCESS_CONTROL = 'true'
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

  describe('disabled', () => {
    describe('namespace need acquire tokens', () => {
      describe('no token', () => {
        it('204', async () => {
          const namespace = 'namespace'
          const token = 'token'
          await prepareGeyser(namespace)
          await AccessControlDAO.setAcquireTokenRequired(namespace, true)
          await AccessControlDAO.setAcquireToken({ namespace: namespace, token })

          const res = await fetch(get(
            url(getAddress())
          , pathname(`/geyser/${namespace}`)
          ))

          expect(res.status).toBe(204)
        })
      })
    })

    describe('namespace does not need acquire tokens', () => {
      describe('ACQUIRE_TOKEN_REQUIRED=true', () => {
        it('204', async () => {
          process.env.GEYSER_ACQUIRE_TOKEN_REQUIRED = 'true'
          const namespace = 'namespace'
          const token = 'token'
          await prepareGeyser(namespace)
          await AccessControlDAO.setAcquireTokenRequired(namespace, true)
          await AccessControlDAO.setAcquireToken({ namespace: namespace, token })

          const res = await fetch(get(
            url(getAddress())
          , pathname(`/geyser/${namespace}`)
          ))

          expect(res.status).toBe(204)
        })
      })
    })
  })
})
