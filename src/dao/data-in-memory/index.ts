import { Geyser, AbortError } from './geyser'
import { CustomError } from '@blackglory/errors'

class GeyserNotExist extends CustomError {}

const geyserMap: { [id: string]: Geyser } = {}

export const GeyserDAO: IGeyserDAO = {
  /**
   * @throws {AbortError}
   * @throws {GeyserNotExist}
   */
  async acquire(id: string, abortSignal: AbortSignal): Promise<void> {
    if (!geyserMap[id]) throw new GeyserNotExist()

    await geyserMap[id].acquire(abortSignal)
  }

, async nextTick(): Promise<void> {
    const geysers = Object.values(geyserMap)

    for (const geyser of geysers) {
      geyser.nextTick()
    }
  }

, async create(id: string, config: IGeyserConfig): Promise<void> {
    if (!geyserMap[id]) {
      geyserMap[id] = new Geyser(id, config)
    }
  }

  /**
   * @throws {GeyserNotExist}
   */
, async update(id: string, config: IGeyserConfig): Promise<void> {
    if (!geyserMap[id]) throw new GeyserNotExist()

    geyserMap[id].updateConfig(config)
  }

, AbortError
, GeyserNotExist
}
