import { getGeyserMap } from './geyser-map'
import { Geyser } from './geyser'

export async function create(namespace: string, config: IGeyserConfig): Promise<void> {
  const map = getGeyserMap()

  if (!map[namespace]) {
    map[namespace] = new Geyser(namespace, config)
  }
}
