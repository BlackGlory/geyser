import { AccessControlDAO } from '@dao'

export function getAllIds(): Promise<string[]> {
  return AccessControlDAO.getAllIdsWithTokenPolicies()
}

export function get(id: string): Promise<{
  acquireTokenRequired: boolean | null
}> {
  return AccessControlDAO.getTokenPolicies(id)
}

export function setAcquireTokenRequired(id: string, val: boolean): Promise<void> {
  return AccessControlDAO.setAcquireTokenRequired(id, val)
}

export function unsetAcquireTokenRequired(id: string): Promise<void> {
  return AccessControlDAO.unsetAcquireTokenRequired(id)
}
