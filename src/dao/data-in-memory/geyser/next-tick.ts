import { getGeyserMap } from './geyser-map'

export async function nextTick(): Promise<void> {
  const geysers = Object.values(getGeyserMap())

  for (const geyser of geysers) {
    geyser.nextTick()
  }
}
