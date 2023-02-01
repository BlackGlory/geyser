import { AccessControlDAO } from '@dao/index.js'

export function getAllNamespaces(): string[] {
  return AccessControlDAO.TokenPolicy.getAllNamespacesWithTokenPolicies()
}

export function get(namespace: string): {
  acquireTokenRequired: boolean | null
} {
  return AccessControlDAO.TokenPolicy.getTokenPolicies(namespace)
}

export function setAcquireTokenRequired(namespace: string, val: boolean): void {
  AccessControlDAO.TokenPolicy.setAcquireTokenRequired(namespace, val)
}

export function unsetAcquireTokenRequired(namespace: string): void {
  AccessControlDAO.TokenPolicy.unsetAcquireTokenRequired(namespace)
}
