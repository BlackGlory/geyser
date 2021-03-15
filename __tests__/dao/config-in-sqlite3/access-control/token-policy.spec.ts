import * as DAO from '@dao/config-in-sqlite3/access-control/token-policy'
import { initializeDatabases, clearDatabases } from '@test/utils'
import { getRawTokenPolicy, hasRawTokenPolicy, setRawTokenPolicy } from './utils'
import 'jest-extended'

jest.mock('@dao/config-in-sqlite3/database')

beforeEach(initializeDatabases)
afterEach(clearDatabases)

describe('TokenPolicy', () => {
  describe('getAllIdsWithTokenPolicies(): string[]', () => {
    it('return string[]', () => {
      const id = 'id'
      setRawTokenPolicy({
        geyser_id: id
      , acquire_token_required: 1
      })

      const result = DAO.getAllIdsWithTokenPolicies()

      expect(result).toEqual([id])
    })
  })

  describe('getTokenPolicies(id: string): TokenPolicy', () => {
    describe('exists', () => {
      it('return', () => {
        const id = 'id'
        setRawTokenPolicy({
          geyser_id: id
        , acquire_token_required: 1
        })

        const result = DAO.getTokenPolicies(id)

        expect(result).toEqual({
          acquireTokenRequired: true
        })
      })
    })

    describe('does not exist', () => {
      it('return', () => {
        const id = 'id'

        const result = DAO.getTokenPolicies(id)

        expect(result).toEqual({
          acquireTokenRequired: null
        })
      })
    })
  })

  describe('setAcquireTokenRequired(id: string, val: boolean): void', () => {
    it('return undefined', () => {
      const id = 'id'

      const result = DAO.setAcquireTokenRequired(id, true)
      const row = getRawTokenPolicy(id)

      expect(result).toBeUndefined()
      expect(row).not.toBeNull()
      expect(row!['acquire_token_required']).toBe(1)
    })
  })

  describe('unsetAcquireTokenRequired(id: string): void', () => {
    describe('exists', () => {
      it('return undefined', () => {
        const id = 'id'
        setRawTokenPolicy({
          geyser_id: id
        , consume_token_required: 1
        , acquire_token_required: 1
        , clear_token_required: 1
        })

        const result = DAO.unsetAcquireTokenRequired(id)
        const row = getRawTokenPolicy(id)

        expect(result).toBeUndefined()
        expect(row).not.toBeNull()
        expect(row!['acquire_token_required']).toBeNull()
      })
    })

    describe('does not exist', () => {
      it('return undefined', () => {
        const id = 'id'

        const result = DAO.unsetAcquireTokenRequired(id)

        expect(result).toBeUndefined()
        expect(hasRawTokenPolicy(id)).toBeFalse()
      })
    })
  })
})
