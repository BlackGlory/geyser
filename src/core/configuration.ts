import { ConfigurationDAO } from '@dao/config-in-sqlite3/configuration'
import { updateConfig } from './geyser'

export function getAllNamespaces(): Promise<string[]> {
  return ConfigurationDAO.getAllNamespacesWithConfiguration()
}

export function get(namespace: string): Promise<IConfiguration> {
  return ConfigurationDAO.getConfiguration(namespace)
}

export async function setDuration(namespace: string, val: number): Promise<void> {
  await ConfigurationDAO.setDuration(namespace, val)
  await updateConfig(namespace)
}

export async function unsetDuration(namespace: string): Promise<void> {
  await ConfigurationDAO.unsetDuration(namespace)
  await updateConfig(namespace)
}

export async function setLimit(namespace: string, val: number): Promise<void> {
  await ConfigurationDAO.setLimit(namespace, val)
  await updateConfig(namespace)
}

export async function unsetLimit(namespace: string): Promise<void> {
  await ConfigurationDAO.unsetLimit(namespace)
  await updateConfig(namespace)
}
