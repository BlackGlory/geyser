import { Geyser } from './geyser.js'

type IGeyserMap = { [namespace: string]: Geyser }

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
