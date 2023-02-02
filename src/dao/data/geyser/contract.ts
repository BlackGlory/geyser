import { CustomErrorConstructor } from '@blackglory/errors'
import { IGeyserConfig } from '@api/contract.js'
export { IGeyserConfig } from '@api/contract.js'

export interface IGeyserDAO {
  create(namespace: string, config: IGeyserConfig): Promise<void>

  /**
   * @throws {GeyserNotExist}
   */
  updateConfig(namespace: string, config: IGeyserConfig): void

  /**
   * @throws {GeyserNotExist}
   */
  resetCycle(namespace: string): Promise<void>

  /**
   * @throws {AbortError}
   * @throws {GeyserNotExist}
   */
  acquire(namespace: string, abortSignal: AbortSignal): Promise<void>

  nextTick(): Promise<void>

  AbortError: CustomErrorConstructor
  GeyserNotExist: CustomErrorConstructor
}
