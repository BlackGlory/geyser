import { GeyserDAO } from '@dao/data/geyser/index.js'

export async function prepareGeyser(namespace: string): Promise<void> {
  await GeyserDAO.create(namespace, {
    duration: Infinity
  , limit: Infinity
  })
}
