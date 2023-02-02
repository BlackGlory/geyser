import { getGeyserMap } from './geyser-map.js'
import { Geyser } from './geyser.js'
import { IGeyserConfig } from './contract.js'

export async function create(namespace: string, config: IGeyserConfig): Promise<void> {
  const map = getGeyserMap()

  if (!map[namespace]) {
    map[namespace] = new Geyser(namespace, config)
  }
}
