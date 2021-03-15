type Json = import('@blackglory/types').Json
type CustomErrorConstructor = import('@blackglory/errors').CustomErrorConstructor

interface ICore {
  isAdmin(password: string): boolean

  Geyser: {
    acquire(id: string): Promise<void>
  }

  Configuration: {
    getAllIds(): Promise<string[]>
    get(id: string): Promise<Configurations>

    setDuration(geyserId: string, val: number): Promise<void>
    unsetDuration(geyserId: string): Promise<void>

    setLimit(geyserId: string, val: number): Promise<void>
    unsetLimit(geyserId: string): Promise<void>
  }

  Blacklist: {
    isEnabled(): boolean
    isBlocked(id: string): Promise<boolean>
    getAll(): Promise<string[]>
    add(id: string): Promise<void>
    remove(id: string): Promise<void>

    /**
     * @throws {Forbidden}
     */
    check(id: string): Promise<void>

    Forbidden: CustomErrorConstructor
  }

  Whitelist: {
    isEnabled(): boolean
    isBlocked(id: string): Promise<boolean>
    check(id: string): Promise<void>
    getAll(): Promise<string[]>
    add(id: string): Promise<void>
    remove(id: string): Promise<void>

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
    checkAcquirePermission(id: string, token?: string): Promise<void>

    Unauthorized: CustomErrorConstructor

    Token: {
      getAllIds(): Promise<string[]>
      getAll(id: string): Promise<Array<{
        token: string
        acquire: boolean
      }>>

      setAcquireToken(id: string, token: string): Promise<void>
      unsetAcquireToken(id: string, token: string): Promise<void>
    }

    TokenPolicy: {
      getAllIds(): Promise<string[]>
      get(id: string): Promise<{
        acquireTokenRequired: boolean | null
      }>

      setAcquireTokenRequired(id: string, val: boolean): Promise<void>
      unsetAcquireTokenRequired(id: string): Promise<void>
    }
  }
}
