import { GeyserDAO } from '@dao/data-in-memory/geyser/index.js'

export async function prepareGeyser(namespace: string): Promise<void> {
  await GeyserDAO.create(namespace, {
    duration: Infinity
  , limit: Infinity
  })
}
