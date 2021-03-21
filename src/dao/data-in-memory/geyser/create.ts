import { getGeyserMap } from './geyser-map'
import { Geyser } from './geyser'

export async function create(id: string, config: IGeyserConfig): Promise<void> {
  const map = getGeyserMap()

  if (!map[id]) {
    map[id] = new Geyser(id, config)
  }
}
