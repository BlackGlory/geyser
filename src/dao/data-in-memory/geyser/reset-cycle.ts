import { getGeyserMap } from './geyser-map'
import { GeyserNotExist } from './errors'

/**
 * @throws {GeyserNotExist}
 */
export async function resetCycle(namespace: string): Promise<void> {
  const map = getGeyserMap()

  if (!map[namespace]) throw new GeyserNotExist()

  map[namespace].resetCycle()
}
