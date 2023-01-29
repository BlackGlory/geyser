import { AccessControlDAO } from '@dao/index.js'

export function getAllNamespaces(): Promise<string[]> {
  return AccessControlDAO.getAllNamespacesWithTokenPolicies()
}

export function get(namespace: string): Promise<{
  acquireTokenRequired: boolean | null
}> {
  return AccessControlDAO.getTokenPolicies(namespace)
}

export function setAcquireTokenRequired(namespace: string, val: boolean): Promise<void> {
  return AccessControlDAO.setAcquireTokenRequired(namespace, val)
}

export function unsetAcquireTokenRequired(namespace: string): Promise<void> {
  return AccessControlDAO.unsetAcquireTokenRequired(namespace)
}
