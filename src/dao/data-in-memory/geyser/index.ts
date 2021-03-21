import { AbortError } from './geyser'
import { GeyserNotExist } from './errors'
import { create } from './create'
import { acquire } from './acquire'
import { nextTick } from './next-tick'
import { update } from './update'

export const GeyserDAO: IGeyserDAO = {
  AbortError
, GeyserNotExist

, create
, update
, acquire
, nextTick
}
