interface Configurations {
  duration: number | null
  limit: number | null
}

interface IConfigurationDAO {
  getAllIdsWithConfigurations(): Promise<string[]>
  getConfigurations(geyserId: string): Promise<Configurations>

  setDuration(geyserId: string, val: number): Promise<void>
  unsetDuration(geyserId: string): Promise<void>

  setLimit(geyserId: string, val: number): Promise<void>
  unsetLimit(geyserId: string): Promise<void>
}
