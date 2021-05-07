type IGeyserConfig = import('hotypes').MapPropsToNonNullable<IConfiguration>

interface IGeyserDAO {
  create(namespace: string, config: IGeyserConfig): Promise<void>

  /**
   * @throws {GeyserNotExist}
   */
  update(namespace: string, config: IGeyserConfig): Promise<void>

  /**
   * @throws {AbortError}
   * @throws {GeyserNotExist}
   */
  acquire(namespace: string, abortSignal: AbortSignal): Promise<void>

  nextTick(): Promise<void>

  AbortError: CustomErrorConstructor
  GeyserNotExist: CustomErrorConstructor
}
