import * as DAO from '@dao/config-in-sqlite3/access-control/token'
import { initializeDatabases, clearDatabases } from '@test/utils'
import { getRawToken, hasRawToken, setRawToken } from './utils'
import 'jest-extended'

jest.mock('@dao/config-in-sqlite3/database')

beforeEach(initializeDatabases)
afterEach(clearDatabases)

describe('token-based access control', () => {
  describe('getAllIdsWithTokens(): string[]', () => {
    it('return string[]', () => {
      const id = 'id'
      setRawToken({
        token: 'token'
      , geyser_id: id
      , acquire_permission: 1
      })

      const result = DAO.getAllIdsWithTokens()

      expect(result).toEqual([id])
    })
  })

  describe('getAllTokens(id: string): TokenInfo[]', () => {
    it('return TokenInfo[]', () => {
      const id = 'id'
      const token = setRawToken({
        token: 'token'
      , geyser_id: id
      , acquire_permission: 1
      })

      const result = DAO.getAllTokens(id)

      expect(result).toEqual([
        {
          token: token.token
        , acquire: !!token.acquire_permission
        }
      ])
    })
  })

  describe('AcquireToken', () => {
    describe('hasAcquireTokens(id: string): boolean', () => {
      describe('tokens exist', () => {
        it('return true', () => {
          const id = 'id'
          setRawToken({
            token: 'token'
          , geyser_id: id
          , acquire_permission: 1
          })

          const result = DAO.hasAcquireTokens(id)

          expect(result).toBeTrue()
        })
      })

      describe('tokens do not exist', () => {
        it('return false', () => {
          const id = 'id'

          const result = DAO.hasAcquireTokens(id)

          expect(result).toBeFalse()
        })
      })
    })

    describe('matchAcquireToken({ token: string; id: string }): boolean', () => {
      describe('token exist', () => {
        it('return true', () => {
          const token = 'token'
          const id = 'id'
          setRawToken({
            token
          , geyser_id: id
          , acquire_permission: 1
          })

          const result = DAO.matchAcquireToken({ token, id })

          expect(result).toBeTrue()
        })
      })

      describe('token does not exist', () => {
        it('return false', () => {
          const token = 'token'
          const id = 'id'

          const result = DAO.matchAcquireToken({ token, id })

          expect(result).toBeFalse()
        })
      })
    })

    describe('setAcquireToken({ token: string; id: string })', () => {
      describe('token exists', () => {
        it('update row', () => {
          const token = 'token'
          const id = 'id'
          setRawToken({
            token
          , geyser_id: id
          , acquire_permission: 1
          })

          const result = DAO.setAcquireToken({ token, id })
          const row = getRawToken(token, id)

          expect(result).toBeUndefined()
          expect(row).not.toBeNull()
          expect(row!['acquire_permission']).toBe(1)
        })
      })

      describe('token does not exist', () => {
        it('insert row', () => {
          const token = 'token'
          const id = 'id'

          const result = DAO.setAcquireToken({ token, id })
          const row = getRawToken(token, id)

          expect(result).toBeUndefined()
          expect(row).not.toBeNull()
          expect(row!['acquire_permission']).toBe(1)
        })
      })
    })

    describe('unsetAcquireToken({ token: string; id: string })', () => {
      describe('token exists', () => {
        it('return undefined', () => {
          const token = 'token'
          const id = 'id'
          setRawToken({
            token
          , geyser_id: id
          , acquire_permission: 1
          })

          const result = DAO.unsetAcquireToken({ token, id })

          expect(result).toBeUndefined()
          expect(hasRawToken(token, id)).toBeFalse()
        })
      })

      describe('token does not exist', () => {
        it('return undefined', () => {
          const token = 'token'
          const id = 'id'

          const result = DAO.unsetAcquireToken({ token, id })

          expect(result).toBeUndefined()
          expect(hasRawToken(token, id)).toBeFalse()
        })
      })
    })
  })
})
