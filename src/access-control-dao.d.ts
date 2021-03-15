interface IBlacklistDAO {
  getAllBlacklistItems(): Promise<string[]>
  inBlacklist(id: string): Promise<boolean>
  addBlacklistItem(id: string): Promise<void>
  removeBlacklistItem(id: string): Promise<void>
}

interface IWhitelistDAO {
  getAllWhitelistItems(): Promise<string[]>
  inWhitelist(id: string): Promise<boolean>
  addWhitelistItem(id: string): Promise<void>
  removeWhitelistItem(id: string): Promise<void>
}

interface ITokenDAO {
  getAllIdsWithTokens(): Promise<string[]>
  getAllTokens(id: string): Promise<Array<{
    token: string
    acquire: boolean
  }>>

  hasAcquireTokens(id: string): Promise<boolean>
  matchAcquireToken(props: { token: string; id: string }): Promise<boolean>
  setAcquireToken(props: { token: string; id: string }): Promise<void>
  unsetAcquireToken(props: { token: string; id: string }): Promise<void>
}

interface ITokenPolicyDAO {
  getAllIdsWithTokenPolicies(): Promise<string[]>
  getTokenPolicies(id: string): Promise<{
    acquireTokenRequired: boolean | null
  }>

  setAcquireTokenRequired(id: string, val: boolean): Promise<void>
  unsetAcquireTokenRequired(id: string): Promise<void>
}

interface IAccessControlDAO extends
  IBlacklistDAO
, IWhitelistDAO
, ITokenDAO
, ITokenPolicyDAO {}
