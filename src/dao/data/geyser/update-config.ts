import { getGeyserMap } from './geyser-map.js'
import { GeyserNotExist } from './errors.js'
import { IGeyserConfig } from './contract.js'

/**
 * @throws {GeyserNotExist}
 */
export function updateConfig(
  namespace: string
, config: IGeyserConfig
): void {
  const map = getGeyserMap()

  if (!map[namespace]) throw new GeyserNotExist()

  map[namespace].updateConfig(config)
}
