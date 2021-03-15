import { CustomError } from '@blackglory/errors'
import {
  TOKEN_BASED_ACCESS_CONTROL
, ACQUIRE_TOKEN_REQUIRED
} from '@env'
import { AccessControlDAO } from '@dao'
import * as TokenPolicy from './token-policy'
import * as Token from './token'

class Unauthorized extends CustomError {}

export const TBAC: ICore['TBAC'] = {
  isEnabled
, checkAcquirePermission
, Unauthorized

, TokenPolicy
, Token
}

function isEnabled() {
  return TOKEN_BASED_ACCESS_CONTROL()
}

/**
 * @throws {Unauthorized}
 */
async function checkAcquirePermission(id: string, token?: string) {
  if (!isEnabled()) return

  const acquireTokenRequired =
    (await TokenPolicy.get(id)).acquireTokenRequired
  ?? ACQUIRE_TOKEN_REQUIRED()

  if (acquireTokenRequired) {
    if (!token) throw new Unauthorized()
    if (!await AccessControlDAO.matchAcquireToken({ token, id })) throw new Unauthorized()
  }
}
