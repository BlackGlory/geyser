import { ConfigurationDAO } from '@dao/config/configuration/index.js'
import { updateConfig } from './geyser.js'
import { IConfiguration } from './contract.js'

export function getAllNamespaces(): string[] {
  return ConfigurationDAO.getAllNamespacesWithConfiguration()
}

export function get(namespace: string): IConfiguration {
  return ConfigurationDAO.getConfiguration(namespace)
}

export function setDuration(namespace: string, val: number): void {
  ConfigurationDAO.setDuration(namespace, val)
  updateConfig(namespace)
}

export function unsetDuration(namespace: string): void {
  ConfigurationDAO.unsetDuration(namespace)
  updateConfig(namespace)
}

export function setLimit(namespace: string, val: number): void {
  ConfigurationDAO.setLimit(namespace, val)
  updateConfig(namespace)
}

export function unsetLimit(namespace: string): void {
  ConfigurationDAO.unsetLimit(namespace)
  updateConfig(namespace)
}
