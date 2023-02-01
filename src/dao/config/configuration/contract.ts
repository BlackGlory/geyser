import { IConfiguration } from '@api/contract.js'
export { IConfiguration } from '@api/contract.js'

export interface IConfigurationDAO {
  getAllNamespacesWithConfiguration(): string[]
  getConfiguration(namespace: string): IConfiguration

  setDuration(namespace: string, val: number): void
  unsetDuration(namespace: string): void

  setLimit(namespace: string, val: number): void
  unsetLimit(namespace: string): void
}
