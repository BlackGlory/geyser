import { GeyserDAO } from '@dao/data-in-memory/geyser'

export async function prepareGeyser(id: string): Promise<void> {
  await GeyserDAO.create(id, {
    duration: Infinity
  , limit: Infinity
  })
}
