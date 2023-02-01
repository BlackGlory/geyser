import { CustomErrorConstructor } from '@blackglory/errors'
import { MapPropsToNonNullable } from 'hotypes'

export interface IConfiguration {
  duration: number | null
  limit: number | null
}

export type IGeyserConfig = MapPropsToNonNullable<IConfiguration>

export interface IAPI {
  isAdmin(password: string): boolean

  Geyser: {
    /**
     * @throws {AbortError}
     */
    acquire(namespace: string, abortSignal: AbortSignal): Promise<void>
    updateConfig(namespace: string): void
    resetCycle(namespace: string): Promise<void>
    nextTick(): Promise<void>

    AbortError: CustomErrorConstructor
  }

  Configuration: {
    getAllNamespaces(): string[]
    get(namespace: string): IConfiguration

    setDuration(namespace: string, val: number): void
    unsetDuration(namespace: string): void

    setLimit(namespace: string, val: number): void
    unsetLimit(namespace: string): void
  }

  Blacklist: {
    isEnabled(): boolean
    isBlocked(namespace: string): boolean
    getAll(): string[]
    add(namespace: string): void
    remove(namespace: string): void

    /**
     * @throws {Forbidden}
     */
    check(namespace: string): void

    Forbidden: CustomErrorConstructor
  }

  Whitelist: {
    isEnabled(): boolean
    isBlocked(namespace: string): boolean
    check(namespace: string): void
    getAll(): string[]
    add(namespace: string): void
    remove(namespace: string): void

    /**
     * @throws {Forbidden}
     */
    Forbidden: CustomErrorConstructor
  }

  TBAC: {
    isEnabled(): boolean

    /**
     * @throws {Unauthorized}
     */
    checkAcquirePermission(namespace: string, token?: string): void

    Unauthorized: CustomErrorConstructor

    Token: {
      getAllNamespaces(): string[]
      getAll(namespace: string): Array<{
        token: string
        acquire: boolean
      }>

      setAcquireToken(namespace: string, token: string): void
      unsetAcquireToken(namespace: string, token: string): void
    }

    TokenPolicy: {
      getAllNamespaces(): string[]
      get(namespace: string): {
        acquireTokenRequired: boolean | null
      }

      setAcquireTokenRequired(namespace: string, val: boolean): void
      unsetAcquireTokenRequired(namespace: string): void
    }
  }
}
