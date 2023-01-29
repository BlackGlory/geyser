import { GeyserDAO } from '@dao/data-in-memory/geyser/index.js'
import { ConfigurationDAO } from '@dao/index.js'
import { DURATION, LIMIT } from '@env/index.js'

/**
 * @throws {AbortError}
 */
export async function acquire(namespace: string, abortSignal: AbortSignal): Promise<void> {
  try {
    return await GeyserDAO.acquire(namespace, abortSignal)
  } catch (e) {
    if (e instanceof GeyserDAO.GeyserNotExist) {
      await GeyserDAO.create(namespace, await createConfig(namespace))
      return await acquire(namespace, abortSignal)
    }
    throw e
  }
}

export function nextTick(): Promise<void> {
  return GeyserDAO.nextTick()
}

export async function updateConfig(namespace: string): Promise<void> {
  const config = await createConfig(namespace)

  try {
    await GeyserDAO.updateConfig(namespace, config)
  } catch (e) {
    if (e instanceof GeyserDAO.GeyserNotExist) return
    throw e
  }
}

export async function resetCycle(namespace: string): Promise<void> {
  try {
    await GeyserDAO.resetCycle(namespace)
  } catch (e) {
    if (e instanceof GeyserDAO.GeyserNotExist) return
    throw e
  }
}

export const AbortError = GeyserDAO.AbortError

async function createConfig(namespace: string): Promise<IGeyserConfig> {
  const config = await ConfigurationDAO.getConfiguration(namespace)
  const duration = config.duration ?? DURATION()
  const limit = config.limit ?? LIMIT()

  return { duration, limit }
}
