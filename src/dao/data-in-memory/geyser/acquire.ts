import { getGeyserMap } from './geyser-map'
import { GeyserNotExist } from './errors'

/**
 * @throws {AbortError}
 * @throws {GeyserNotExist}
 */
export async function acquire(id: string, abortSignal: AbortSignal): Promise<void> {
  const map = getGeyserMap()

  if (!map[id]) throw new GeyserNotExist()

  await map[id].acquire(abortSignal)
}
