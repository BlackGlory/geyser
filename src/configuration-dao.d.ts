interface IConfigurationDAO {
  getAllIdsWithConfiguration(): Promise<string[]>
  getConfiguration(geyserId: string): Promise<IConfiguration>

  setDuration(geyserId: string, val: number): Promise<void>
  unsetDuration(geyserId: string): Promise<void>

  setLimit(geyserId: string, val: number): Promise<void>
  unsetLimit(geyserId: string): Promise<void>
}
