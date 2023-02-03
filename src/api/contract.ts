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
}
