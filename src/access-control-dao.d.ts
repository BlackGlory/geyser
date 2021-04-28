interface IBlacklistDAO {
  getAllBlacklistItems(): Promise<string[]>
  inBlacklist(namespace: string): Promise<boolean>
  addBlacklistItem(namespace: string): Promise<void>
  removeBlacklistItem(namespace: string): Promise<void>
}

interface IWhitelistDAO {
  getAllWhitelistItems(): Promise<string[]>
  inWhitelist(namespace: string): Promise<boolean>
  addWhitelistItem(namespace: string): Promise<void>
  removeWhitelistItem(namespace: string): Promise<void>
}

interface ITokenDAO {
  getAllNamespacesWithTokens(): Promise<string[]>
  getAllTokens(namespace: string): Promise<Array<{
    token: string
    acquire: boolean
  }>>

  hasAcquireTokens(namespace: string): Promise<boolean>
  matchAcquireToken(params: { token: string; namespace: string }): Promise<boolean>
  setAcquireToken(params: { token: string; namespace: string }): Promise<void>
  unsetAcquireToken(params: { token: string; namespace: string }): Promise<void>
}

interface ITokenPolicyDAO {
  getAllNamespacesWithTokenPolicies(): Promise<string[]>
  getTokenPolicies(namespace: string): Promise<{
    acquireTokenRequired: boolean | null
  }>

  setAcquireTokenRequired(namespace: string, val: boolean): Promise<void>
  unsetAcquireTokenRequired(namespace: string): Promise<void>
}

interface IAccessControlDAO extends
  IBlacklistDAO
, IWhitelistDAO
, ITokenDAO
, ITokenPolicyDAO {}
