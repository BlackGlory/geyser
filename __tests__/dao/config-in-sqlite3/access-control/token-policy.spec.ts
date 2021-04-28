import * as DAO from '@dao/config-in-sqlite3/access-control/token-policy'
import { initializeDatabases, clearDatabases } from '@test/utils'
import { getRawTokenPolicy, hasRawTokenPolicy, setRawTokenPolicy } from './utils'
import 'jest-extended'

jest.mock('@dao/config-in-sqlite3/database')

beforeEach(initializeDatabases)
afterEach(clearDatabases)

describe('TokenPolicy', () => {
  describe('getAllNamespacesWithTokenPolicies(): string[]', () => {
    it('return string[]', () => {
      const namespace = 'namespace'
      setRawTokenPolicy({
        namespace: namespace
      , acquire_token_required: 1
      })

      const result = DAO.getAllNamespacesWithTokenPolicies()

      expect(result).toEqual([namespace])
    })
  })

  describe('getTokenPolicies(namespace: string): TokenPolicy', () => {
    describe('exists', () => {
      it('return', () => {
        const namespace = 'namespace'
        setRawTokenPolicy({
          namespace: namespace
        , acquire_token_required: 1
        })

        const result = DAO.getTokenPolicies(namespace)

        expect(result).toEqual({
          acquireTokenRequired: true
        })
      })
    })

    describe('does not exist', () => {
      it('return', () => {
        const namespace = 'namespace'

        const result = DAO.getTokenPolicies(namespace)

        expect(result).toEqual({
          acquireTokenRequired: null
        })
      })
    })
  })

  describe('setAcquireTokenRequired(namespace: string, val: boolean): void', () => {
    it('return undefined', () => {
      const namespace = 'namespace'

      const result = DAO.setAcquireTokenRequired(namespace, true)
      const row = getRawTokenPolicy(namespace)

      expect(result).toBeUndefined()
      expect(row).not.toBeNull()
      expect(row!['acquire_token_required']).toBe(1)
    })
  })

  describe('unsetAcquireTokenRequired(namespace: string): void', () => {
    describe('exists', () => {
      it('return undefined', () => {
        const namespace = 'namespace'
        setRawTokenPolicy({
          namespace: namespace
        , consume_token_required: 1
        , acquire_token_required: 1
        , clear_token_required: 1
        })

        const result = DAO.unsetAcquireTokenRequired(namespace)
        const row = getRawTokenPolicy(namespace)

        expect(result).toBeUndefined()
        expect(row).not.toBeNull()
        expect(row!['acquire_token_required']).toBeNull()
      })
    })

    describe('does not exist', () => {
      it('return undefined', () => {
        const namespace = 'namespace'

        const result = DAO.unsetAcquireTokenRequired(namespace)

        expect(result).toBeUndefined()
        expect(hasRawTokenPolicy(namespace)).toBeFalse()
      })
    })
  })
})
