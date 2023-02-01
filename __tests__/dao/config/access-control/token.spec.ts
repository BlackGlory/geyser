import { TokenDAO } from '@dao/config/access-control/index.js'
import { initializeDatabases, clearDatabases } from '@test/utils.js'
import { getRawToken, hasRawToken, setRawToken } from './utils.js'

beforeEach(initializeDatabases)
afterEach(clearDatabases)

describe('token-based access control', () => {
  describe('getAllNamespacesWithTokens(): string[]', () => {
    it('return string[]', () => {
      const namespace = 'namespace'
      setRawToken({
        token: 'token'
      , namespace: namespace
      , acquire_permission: 1
      })

      const result = TokenDAO.getAllNamespacesWithTokens()

      expect(result).toEqual([namespace])
    })
  })

  describe('getAllTokens(namespace: string): TokenInfo[]', () => {
    it('return TokenInfo[]', () => {
      const namespace = 'namespace'
      const token = setRawToken({
        token: 'token'
      , namespace: namespace
      , acquire_permission: 1
      })

      const result = TokenDAO.getAllTokens(namespace)

      expect(result).toEqual([
        {
          token: token.token
        , acquire: !!token.acquire_permission
        }
      ])
    })
  })

  describe('AcquireToken', () => {
    describe('hasAcquireTokens(namespace: string): boolean', () => {
      describe('tokens exist', () => {
        it('return true', () => {
          const namespace = 'namespace'
          setRawToken({
            token: 'token'
          , namespace: namespace
          , acquire_permission: 1
          })

          const result = TokenDAO.hasAcquireTokens(namespace)

          expect(result).toBe(true)
        })
      })

      describe('tokens do not exist', () => {
        it('return false', () => {
          const namespace = 'namespace'

          const result = TokenDAO.hasAcquireTokens(namespace)

          expect(result).toBe(false)
        })
      })
    })

    describe('matchAcquireToken({ token: string; namespace: string }): boolean', () => {
      describe('token exist', () => {
        it('return true', () => {
          const token = 'token'
          const namespace = 'namespace'
          setRawToken({
            token
          , namespace: namespace
          , acquire_permission: 1
          })

          const result = TokenDAO.matchAcquireToken({ token, namespace: namespace })

          expect(result).toBe(true)
        })
      })

      describe('token does not exist', () => {
        it('return false', () => {
          const token = 'token'
          const namespace = 'namespace'

          const result = TokenDAO.matchAcquireToken({ token, namespace: namespace })

          expect(result).toBe(false)
        })
      })
    })

    describe('setAcquireToken({ token: string; namespace: string })', () => {
      describe('token exists', () => {
        it('update row', () => {
          const token = 'token'
          const namespace = 'namespace'
          setRawToken({
            token
          , namespace: namespace
          , acquire_permission: 1
          })

          const result = TokenDAO.setAcquireToken({ token, namespace: namespace })
          const row = getRawToken(token, namespace)

          expect(result).toBeUndefined()
          expect(row).not.toBeNull()
          expect(row!['acquire_permission']).toBe(1)
        })
      })

      describe('token does not exist', () => {
        it('insert row', () => {
          const token = 'token'
          const namespace = 'namespace'

          const result = TokenDAO.setAcquireToken({ token, namespace: namespace })
          const row = getRawToken(token, namespace)

          expect(result).toBeUndefined()
          expect(row).not.toBeNull()
          expect(row!['acquire_permission']).toBe(1)
        })
      })
    })

    describe('unsetAcquireToken({ token: string; namespace: string })', () => {
      describe('token exists', () => {
        it('return undefined', () => {
          const token = 'token'
          const namespace = 'namespace'
          setRawToken({
            token
          , namespace: namespace
          , acquire_permission: 1
          })

          const result = TokenDAO.unsetAcquireToken({ token, namespace: namespace })

          expect(result).toBeUndefined()
          expect(hasRawToken(token, namespace)).toBe(false)
        })
      })

      describe('token does not exist', () => {
        it('return undefined', () => {
          const token = 'token'
          const namespace = 'namespace'

          const result = TokenDAO.unsetAcquireToken({ token, namespace: namespace })

          expect(result).toBeUndefined()
          expect(hasRawToken(token, namespace)).toBe(false)
        })
      })
    })
  })
})
