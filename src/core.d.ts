type JSONValue = import('justypes').JSONValue
type CustomErrorConstructor = import('@blackglory/errors').CustomErrorConstructor

interface IConfiguration {
  duration: number | null
  limit: number | null
}

interface ICore {
  isAdmin(password: string): boolean

  Geyser: {
    /**
     * @throws {AbortError}
     */
    acquire(namespace: string, abortSignal: AbortSignal): Promise<void>
    updateConfig(namespace: string): Promise<void>
    resetCycle(namespace: string): Promise<void>
    nextTick(): Promise<void>

    AbortError: CustomErrorConstructor
  }

  Configuration: {
    getAllNamespaces(): Promise<string[]>
    get(namespace: string): Promise<>

    setDuration(namespace: string, val: number): Promise<void>
    unsetDuration(namespace: string): Promise<void>

    setLimit(namespace: string, val: number): Promise<void>
    unsetLimit(namespace: string): Promise<void>
  }

  Blacklist: {
    isEnabled(): boolean
    isBlocked(namespace: string): Promise<boolean>
    getAll(): Promise<string[]>
    add(namespace: string): Promise<void>
    remove(namespace: string): Promise<void>

    /**
     * @throws {Forbidden}
     */
    check(namespace: string): Promise<void>

    Forbidden: CustomErrorConstructor
  }

  Whitelist: {
    isEnabled(): boolean
    isBlocked(namespace: string): Promise<boolean>
    check(namespace: string): Promise<void>
    getAll(): Promise<string[]>
    add(namespace: string): Promise<void>
    remove(namespace: string): Promise<void>

    /**
     * @throws {Forbidden}
     */
    Forbidden: CustomErrorConstructor
  }

  TBAC: {
    isEnabled(): boolean

    /**
     * @throws {Unauthorized}
     */
    checkAcquirePermission(namespace: string, token?: string): Promise<void>

    Unauthorized: CustomErrorConstructor

    Token: {
      getAllNamespaces(): Promise<string[]>
      getAll(namespace: string): Promise<Array<{
        token: string
        acquire: boolean
      }>>

      setAcquireToken(namespace: string, token: string): Promise<void>
      unsetAcquireToken(namespace: string, token: string): Promise<void>
    }

    TokenPolicy: {
      getAllNamespaces(): Promise<string[]>
      get(namespace: string): Promise<{
        acquireTokenRequired: boolean | null
      }>

      setAcquireTokenRequired(namespace: string, val: boolean): Promise<void>
      unsetAcquireTokenRequired(namespace: string): Promise<void>
    }
  }
}
