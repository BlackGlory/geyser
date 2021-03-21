import { Geyser } from './geyser'

type IGeyserMap = { [id: string]: Geyser }

let map: IGeyserMap = createGeyserMap()

export function getGeyserMap(): IGeyserMap {
  return map
}

export function resetGeyserMap(): void {
  map = createGeyserMap()
}

function createGeyserMap(): IGeyserMap {
  return {}
}
