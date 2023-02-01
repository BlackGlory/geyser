import { CustomError } from '@blackglory/errors'
import {
  TOKEN_BASED_ACCESS_CONTROL
, ACQUIRE_TOKEN_REQUIRED
} from '@env/index.js'
import { AccessControlDAO } from '@dao/index.js'
import * as TokenPolicy from './token-policy.js'
import * as Token from './token.js'
import { IAPI } from '../contract.js'

class Unauthorized extends CustomError {}

export const TBAC: IAPI['TBAC'] = {
  isEnabled
, checkAcquirePermission
, Unauthorized

, TokenPolicy
, Token
}

function isEnabled(): boolean {
  return TOKEN_BASED_ACCESS_CONTROL()
}

/**
 * @throws {Unauthorized}
 */
function checkAcquirePermission(namespace: string, token?: string): void {
  if (!isEnabled()) return

  const acquireTokenRequired =
    (TokenPolicy.get(namespace)).acquireTokenRequired ??
    ACQUIRE_TOKEN_REQUIRED()

  if (acquireTokenRequired) {
    if (!token) throw new Unauthorized()
    if (!AccessControlDAO.Token.matchAcquireToken({ token, namespace })) {
      throw new Unauthorized()
    }
  }
}
