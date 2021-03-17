type IGeyserConfig = import('hotypes').MapNullablePropsToNonNullableProps<IConfiguration>

interface IGeyserDAO {
  create(id: string, config: IGeyserConfig): Promise<void>

  /**
   * @throws {GeyserNotExist}
   */
  update(id: string, config: IGeyserConfig): Promise<void>

  /**
   * @throws {AbortError}
   * @throws {GeyserNotExist}
   */
  acquire(id: string, abortSignal: AbortSignal): Promise<void>

  nextTick(): Promise<void>

  AbortError: CustomErrorConstructor
  GeyserNotExist: CustomErrorConstructor
}
