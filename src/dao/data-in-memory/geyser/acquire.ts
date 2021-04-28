import { getGeyserMap } from './geyser-map'
import { GeyserNotExist } from './errors'

/**
 * @throws {AbortError}
 * @throws {GeyserNotExist}
 */
export async function acquire(namespace: string, abortSignal: AbortSignal): Promise<void> {
  const map = getGeyserMap()

  if (!map[namespace]) throw new GeyserNotExist()

  await map[namespace].acquire(abortSignal)
}
