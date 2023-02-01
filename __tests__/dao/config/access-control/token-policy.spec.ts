import { TokenPolicyDAO } from '@dao/config/access-control/index.js'
import { initializeDatabases, clearDatabases } from '@test/utils.js'
import { getRawTokenPolicy, hasRawTokenPolicy, setRawTokenPolicy } from './utils.js'

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

      const result = TokenPolicyDAO.getAllNamespacesWithTokenPolicies()

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

        const result = TokenPolicyDAO.getTokenPolicies(namespace)

        expect(result).toEqual({
          acquireTokenRequired: true
        })
      })
    })

    describe('does not exist', () => {
      it('return', () => {
        const namespace = 'namespace'

        const result = TokenPolicyDAO.getTokenPolicies(namespace)

        expect(result).toEqual({
          acquireTokenRequired: null
        })
      })
    })
  })

  describe('setAcquireTokenRequired(namespace: string, val: boolean): void', () => {
    it('return undefined', () => {
      const namespace = 'namespace'

      const result = TokenPolicyDAO.setAcquireTokenRequired(namespace, true)
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

        const result = TokenPolicyDAO.unsetAcquireTokenRequired(namespace)
        const row = getRawTokenPolicy(namespace)

        expect(result).toBeUndefined()
        expect(row).not.toBeNull()
        expect(row!['acquire_token_required']).toBeNull()
      })
    })

    describe('does not exist', () => {
      it('return undefined', () => {
        const namespace = 'namespace'

        const result = TokenPolicyDAO.unsetAcquireTokenRequired(namespace)

        expect(result).toBeUndefined()
        expect(hasRawTokenPolicy(namespace)).toBe(false)
      })
    })
  })
})
