import * as Blacklist from './blacklist'
import * as Whitelist from './whitelist'
import * as Token from './token'
import * as TokenPolicy from './token-policy'

const BlacklistDAO: IBlacklistDAO = {
  addBlacklistItem: asyncify(Blacklist.addBlacklistItem)
, getAllBlacklistItems: asyncify(Blacklist.getAllBlacklistItems)
, inBlacklist: asyncify(Blacklist.inBlacklist)
, removeBlacklistItem: asyncify(Blacklist.removeBlacklistItem)
}

const WhitelistDAO: IWhitelistDAO = {
  addWhitelistItem: asyncify(Whitelist.addWhitelistItem)
, getAllWhitelistItems: asyncify(Whitelist.getAllWhitelistItems)
, inWhitelist: asyncify(Whitelist.inWhitelist)
, removeWhitelistItem: asyncify(Whitelist.removeWhitelistItem)
}

const TokenDAO: ITokenDAO = {
  getAllIdsWithTokens: asyncify(Token.getAllIdsWithTokens)
, getAllTokens: asyncify(Token.getAllTokens)

, hasAcquireTokens: asyncify(Token.hasAcquireTokens)
, matchAcquireToken: asyncify(Token.matchAcquireToken)
, setAcquireToken: asyncify(Token.setAcquireToken)
, unsetAcquireToken: asyncify(Token.unsetAcquireToken)
}

const TokenPolicyDAO: ITokenPolicyDAO = {
  getAllIdsWithTokenPolicies: asyncify(TokenPolicy.getAllIdsWithTokenPolicies)
, getTokenPolicies: asyncify(TokenPolicy.getTokenPolicies)

, setAcquireTokenRequired: asyncify(TokenPolicy.setAcquireTokenRequired)
, unsetAcquireTokenRequired: asyncify(TokenPolicy.unsetAcquireTokenRequired)
}

export const AccessControlDAO: IAccessControlDAO = {
  ...BlacklistDAO
, ...WhitelistDAO
, ...TokenDAO
, ...TokenPolicyDAO
}

function asyncify<T extends any[], U>(fn: (...args: T) => U): (...args: T) => Promise<U> {
  return async function (this: unknown, ...args: T): Promise<U> {
    return Reflect.apply(fn, this, args)
  }
}
