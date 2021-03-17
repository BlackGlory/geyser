import { GeyserDAO } from '@dao/data-in-memory'
import { ConfigurationDAO } from '@dao'
import { DURATION, LIMIT } from '@env'

export async function acquire(id: string, abortSignal: AbortSignal): Promise<void> {
  try {
    return await GeyserDAO.acquire(id, abortSignal)
  } catch (e) {
    if (e instanceof GeyserDAO.GeyserNotExist) {
      await GeyserDAO.create(id, await createConfig(id))
      return await acquire(id, abortSignal)
    }
    throw e
  }
}

export function nextTick(): Promise<void> {
  return GeyserDAO.nextTick()
}

export async function updateConfig(id: string): Promise<void> {
  const config = await createConfig(id)

  try {
    await GeyserDAO.update(id, config)
  } catch (e) {
    if (e instanceof GeyserDAO.GeyserNotExist) return
    throw e
  }
}

async function createConfig(id: string): Promise<IGeyserConfig> {
  const config = await ConfigurationDAO.getConfiguration(id)
  const duration = config.duration ?? DURATION()
  const limit = config.limit ?? LIMIT()

  return { duration, limit }
}

export const AbortError = GeyserDAO.AbortError
