import { isAdmin } from './admin'
import * as Geyser from './geyser'
import * as Blacklist from './blacklist'
import * as Whitelist from './whitelist'
import * as Configuration from './configuration'
import { TBAC } from './token-based-access-control'

export const Core: ICore = {
  isAdmin
, Geyser
, Blacklist
, Whitelist
, Configuration
, TBAC
}
