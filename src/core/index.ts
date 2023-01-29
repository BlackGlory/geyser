import { isAdmin } from './admin.js'
import * as Geyser from './geyser.js'
import * as Blacklist from './blacklist.js'
import * as Whitelist from './whitelist.js'
import * as Configuration from './configuration.js'
import { TBAC } from './token-based-access-control/index.js'

export const Core: ICore = {
  isAdmin
, Geyser
, Blacklist
, Whitelist
, Configuration
, TBAC
}
