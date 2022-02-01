import { AbortError } from './geyser'
import { GeyserNotExist } from './errors'
import { create } from './create'
import { acquire } from './acquire'
import { nextTick } from './next-tick'
import { updateConfig } from './update-config'
import { resetCycle } from './reset-cycle'

export const GeyserDAO: IGeyserDAO = {
  AbortError
, GeyserNotExist

, create
, resetCycle
, updateConfig
, acquire
, nextTick
}
