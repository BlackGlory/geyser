import { AbortError } from './geyser.js'
import { GeyserNotExist } from './errors.js'
import { create } from './create.js'
import { acquire } from './acquire.js'
import { nextTick } from './next-tick.js'
import { updateConfig } from './update-config.js'
import { resetCycle } from './reset-cycle.js'
import { IGeyserDAO } from './contract.js'

export const GeyserDAO: IGeyserDAO = {
  AbortError
, GeyserNotExist

, create
, resetCycle
, updateConfig
, acquire
, nextTick
}
