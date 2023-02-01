import { ConfigurationDAO } from '@dao/config/configuration/index.js'
import { updateConfig } from './geyser.js'
import { IConfiguration } from './contract.js'

export function getAllNamespaces(): string[] {
  return ConfigurationDAO.getAllNamespacesWithConfiguration()
}

export function get(namespace: string): IConfiguration {
  return ConfigurationDAO.getConfiguration(namespace)
}

export async function setDuration(namespace: string, val: number): Promise<void> {
  ConfigurationDAO.setDuration(namespace, val)
  await updateConfig(namespace)
}

export async function unsetDuration(namespace: string): Promise<void> {
  ConfigurationDAO.unsetDuration(namespace)
  await updateConfig(namespace)
}

export async function setLimit(namespace: string, val: number): Promise<void> {
  ConfigurationDAO.setLimit(namespace, val)
  await updateConfig(namespace)
}

export async function unsetLimit(namespace: string): Promise<void> {
  ConfigurationDAO.unsetLimit(namespace)
  await updateConfig(namespace)
}
