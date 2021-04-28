interface IConfigurationDAO {
  getAllNamespacesWithConfiguration(): Promise<string[]>
  getConfiguration(namespace: string): Promise<IConfiguration>

  setDuration(namespace: string, val: number): Promise<void>
  unsetDuration(namespace: string): Promise<void>

  setLimit(namespace: string, val: number): Promise<void>
  unsetLimit(namespace: string): Promise<void>
}
