import { isAdmin } from './admin.js'
import * as Geyser from './geyser.js'
import * as Configuration from './configuration.js'
import { IAPI } from './contract.js'

export const api: IAPI = {
  isAdmin
, Geyser
, Configuration
}
