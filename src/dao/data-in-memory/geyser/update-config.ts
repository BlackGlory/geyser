import { getGeyserMap } from './geyser-map'
import { GeyserNotExist } from './errors'

/**
 * @throws {GeyserNotExist}
 */
export async function updateConfig(namespace: string, config: IGeyserConfig): Promise<void> {
  const map = getGeyserMap()

  if (!map[namespace]) throw new GeyserNotExist()

  map[namespace].updateConfig(config)
}
