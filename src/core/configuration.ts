import { ConfigurationDAO } from '@dao/config-in-sqlite3/configuration'
import { updateConfig } from './geyser'

export function getAllIds(): Promise<string[]> {
  return ConfigurationDAO.getAllIdsWithConfiguration()
}

export function get(id: string): Promise<IConfiguration> {
  return ConfigurationDAO.getConfiguration(id)
}

export async function setDuration(id: string, val: number): Promise<void> {
  await ConfigurationDAO.setDuration(id, val)
  await updateConfig(id)
}

export async function unsetDuration(id: string): Promise<void> {
  await ConfigurationDAO.unsetDuration(id)
  await updateConfig(id)
}

export async function setLimit(id: string, val: number): Promise<void> {
  await ConfigurationDAO.setLimit(id, val)
  await updateConfig(id)
}

export async function unsetLimit(id: string): Promise<void> {
  await ConfigurationDAO.unsetLimit(id)
  await updateConfig(id)
}
