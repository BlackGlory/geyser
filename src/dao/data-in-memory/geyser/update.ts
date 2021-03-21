import { getGeyserMap } from './geyser-map'
import { GeyserNotExist } from './errors'

/**
 * @throws {GeyserNotExist}
 */
export async function update(id: string, config: IGeyserConfig): Promise<void> {
  const map = getGeyserMap()

  if (!map[id]) throw new GeyserNotExist()

  map[id].updateConfig(config)
}
