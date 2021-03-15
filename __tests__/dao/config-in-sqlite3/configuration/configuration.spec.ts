import * as DAO from '@dao/config-in-sqlite3/configuration/configuration'
import { initializeDatabases, clearDatabases } from '@test/utils'
import { setMinimalConfiguration, getRawConfiguration, hasRawConfiguration } from './utils'
import 'jest-extended'

jest.mock('@dao/config-in-sqlite3/database')

beforeEach(initializeDatabases)
afterEach(clearDatabases)

describe('Configuration', () => {
  describe('getAllIdsWithConfigurations(): string[]', () => {
    it('return string[]', () => {
      const id = 'id'
      setMinimalConfiguration({
        geyser_id: id
      , duration: 100
      , limit: 10
      })

      const result = DAO.getAllIdsWithConfigurations()

      expect(result).toEqual([id])
    })
  })

  describe('getConfigurations(geyserId: string): Configurations', () => {
    describe('exists', () => {
      it('return', () => {
        const id = 'id'
        setMinimalConfiguration({
          geyser_id: id
        , duration: 100
        , limit: 10
        })

        const result = DAO.getConfigurations(id)

        expect(result).toEqual({
          duration: 100
        , limit: 10
        })
      })
    })

    describe('does not exist', () => {
      it('return', () => {
        const id = 'id'

        const result = DAO.getConfigurations(id)

        expect(result).toEqual({
          duration: null
        , limit: null
        })
      })
    })
  })

  describe('setDuration(geyserId: string, val: number): void', () => {
    it('return undefined', () => {
      const id = 'id'

      const result = DAO.setDuration(id, 100)
      const row = getRawConfiguration(id)

      expect(result).toBeUndefined()
      expect(row).toMatchObject({ duration: 100 })
    })
  })

  describe('unsetDuration(id: string): void', () => {
    describe('exists', () => {
      it('return undefined', () => {
        const id = 'id'
        setMinimalConfiguration({
          geyser_id: id
        , duration: 100
        })

        const result = DAO.unsetDuration(id)
        const row = getRawConfiguration(id)

        expect(result).toBeUndefined()
        expect(row).toMatchObject({ duration: null })
      })
    })

    describe('does not exist', () => {
      it('return undefined', () => {
        const id = 'id'

        const result = DAO.unsetDuration(id)

        expect(result).toBeUndefined()
        expect(hasRawConfiguration(id)).toBeFalse()
      })
    })
  })

  describe('setLimit(geyserId: string, val: number): void', () => {
    it('return undefined', () => {
      const id = 'id'

      const result = DAO.setLimit(id, 10)
      const row = getRawConfiguration(id)

      expect(result).toBeUndefined()
      expect(row).toMatchObject({ limit: 10 })
    })
  })

  describe('unsetLimit(id: string): void', () => {
    describe('exists', () => {
      it('return undefined', () => {
        const id = 'id'
        setMinimalConfiguration({
          geyser_id: id
        , limit: 10
        })

        const result = DAO.unsetLimit(id)
        const row = getRawConfiguration(id)

        expect(result).toBeUndefined()
        expect(row).toMatchObject({ limit: null })
      })
    })

    describe('does not exist', () => {
      it('return undefined', () => {
        const id = 'id'

        const result = DAO.unsetLimit(id)

        expect(result).toBeUndefined()
        expect(hasRawConfiguration(id)).toBeFalse()
      })
    })
  })
})
