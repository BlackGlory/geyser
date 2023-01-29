import { getGeyserMap } from './geyser-map.js'
import { GeyserNotExist } from './errors.js'

/**
 * @throws {GeyserNotExist}
 */
export async function updateConfig(namespace: string, config: IGeyserConfig): Promise<void> {
  const map = getGeyserMap()

  if (!map[namespace]) throw new GeyserNotExist()

  map[namespace].updateConfig(config)
}
