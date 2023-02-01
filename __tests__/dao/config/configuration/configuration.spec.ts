import { ConfigurationDAO } from '@dao/config/configuration/index.js'
import { initializeDatabases, clearDatabases } from '@test/utils.js'
import { setMinimalConfiguration, getRawConfiguration, hasRawConfiguration } from './utils.js'

beforeEach(initializeDatabases)
afterEach(clearDatabases)

describe('Configuration', () => {
  describe('getAllNamespacesWithConfiguration(): string[]', () => {
    it('return string[]', () => {
      const namespace = 'namespace'
      setMinimalConfiguration({
        namespace: namespace
      , duration: 100
      , limit: 10
      })

      const result = ConfigurationDAO.getAllNamespacesWithConfiguration()

      expect(result).toEqual([namespace])
    })
  })

  describe('getConfiguration(geyserId: string): Configuration', () => {
    describe('exists', () => {
      it('return', () => {
        const namespace = 'namespace'
        setMinimalConfiguration({
          namespace: namespace
        , duration: 100
        , limit: 10
        })

        const result = ConfigurationDAO.getConfiguration(namespace)

        expect(result).toEqual({
          duration: 100
        , limit: 10
        })
      })
    })

    describe('does not exist', () => {
      it('return', () => {
        const namespace = 'namespace'

        const result = ConfigurationDAO.getConfiguration(namespace)

        expect(result).toEqual({
          duration: null
        , limit: null
        })
      })
    })
  })

  describe('setDuration(geyserId: string, val: number): void', () => {
    it('return undefined', () => {
      const namespace = 'namespace'

      const result = ConfigurationDAO.setDuration(namespace, 100)
      const row = getRawConfiguration(namespace)

      expect(result).toBeUndefined()
      expect(row).toMatchObject({ duration: 100 })
    })
  })

  describe('unsetDuration(namespace: string): void', () => {
    describe('exists', () => {
      it('return undefined', () => {
        const namespace = 'namespace'
        setMinimalConfiguration({
          namespace: namespace
        , duration: 100
        })

        const result = ConfigurationDAO.unsetDuration(namespace)
        const row = getRawConfiguration(namespace)

        expect(result).toBeUndefined()
        expect(row).toMatchObject({ duration: null })
      })
    })

    describe('does not exist', () => {
      it('return undefined', () => {
        const namespace = 'namespace'

        const result = ConfigurationDAO.unsetDuration(namespace)

        expect(result).toBeUndefined()
        expect(hasRawConfiguration(namespace)).toBe(false)
      })
    })
  })

  describe('setLimit(geyserId: string, val: number): void', () => {
    it('return undefined', () => {
      const namespace = 'namespace'

      const result = ConfigurationDAO.setLimit(namespace, 10)
      const row = getRawConfiguration(namespace)

      expect(result).toBeUndefined()
      expect(row).toMatchObject({ limit: 10 })
    })
  })

  describe('unsetLimit(namespace: string): void', () => {
    describe('exists', () => {
      it('return undefined', () => {
        const namespace = 'namespace'
        setMinimalConfiguration({
          namespace: namespace
        , limit: 10
        })

        const result = ConfigurationDAO.unsetLimit(namespace)
        const row = getRawConfiguration(namespace)

        expect(result).toBeUndefined()
        expect(row).toMatchObject({ limit: null })
      })
    })

    describe('does not exist', () => {
      it('return undefined', () => {
        const namespace = 'namespace'

        const result = ConfigurationDAO.unsetLimit(namespace)

        expect(result).toBeUndefined()
        expect(hasRawConfiguration(namespace)).toBe(false)
      })
    })
  })
})
