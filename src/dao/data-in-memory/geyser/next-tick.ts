import { getGeyserMap } from './geyser-map.js'

export async function nextTick(): Promise<void> {
  const geysers = Object.values(getGeyserMap())

  for (const geyser of geysers) {
    geyser.nextTick()
  }
}
