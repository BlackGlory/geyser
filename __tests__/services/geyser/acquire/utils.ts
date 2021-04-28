import { GeyserDAO } from '@dao/data-in-memory/geyser'

export async function prepareGeyser(namespace: string): Promise<void> {
  await GeyserDAO.create(namespace, {
    duration: Infinity
  , limit: Infinity
  })
}
