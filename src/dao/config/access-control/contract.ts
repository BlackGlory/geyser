export interface IAccessControlDAO {
  Blacklist: IBlacklistDAO
  Whitelist: IWhitelistDAO
  Token: ITokenDAO
  TokenPolicy: ITokenPolicyDAO
}

export interface IBlacklistDAO {
  getAllBlacklistItems(): string[]
  inBlacklist(namespace: string): boolean
  addBlacklistItem(namespace: string): void
  removeBlacklistItem(namespace: string): void
}

export interface IWhitelistDAO {
  getAllWhitelistItems(): string[]
  inWhitelist(namespace: string): boolean
  addWhitelistItem(namespace: string): void
  removeWhitelistItem(namespace: string): void
}

export interface ITokenDAO {
  getAllNamespacesWithTokens(): string[]
  getAllTokens(namespace: string): Array<{
    token: string
    acquire: boolean
  }>

  hasAcquireTokens(namespace: string): boolean
  matchAcquireToken(params: {
    token: string
    namespace: string
  }): boolean
  setAcquireToken(params: {
    token: string
    namespace: string
  }): void
  unsetAcquireToken(params: {
    token: string
    namespace: string
  }): void
}

export interface ITokenPolicyDAO {
  getAllNamespacesWithTokenPolicies(): string[]
  getTokenPolicies(namespace: string): {
    acquireTokenRequired: boolean | null
  }

  setAcquireTokenRequired(namespace: string, val: boolean): void
  unsetAcquireTokenRequired(namespace: string): void
}
