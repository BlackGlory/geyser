import { ConfigurationDAO } from '@dao/config-in-sqlite3/configuration'

export function getAllIds(): Promise<string[]> {
  return ConfigurationDAO.getAllIdsWithConfigurations()
}

export function get(geyserId: string): Promise<Configurations> {
  return ConfigurationDAO.getConfigurations(geyserId)
}

export function setDuration(geyserId: string, val: number): Promise<void> {
  return ConfigurationDAO.setDuration(geyserId, val)
}

export function unsetDuration(geyserId: string): Promise<void> {
  return ConfigurationDAO.unsetDuration(geyserId)
}

export function setLimit(geyserId: string, val: number): Promise<void> {
  return ConfigurationDAO.setLimit(geyserId, val)
}

export function unsetLimit(geyserId: string): Promise<void> {
  return ConfigurationDAO.unsetLimit(geyserId)
}
