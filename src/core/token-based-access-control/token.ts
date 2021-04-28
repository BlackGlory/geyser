import { AccessControlDAO } from '@dao'

export function getAllNamespaces(): Promise<string[]> {
  return AccessControlDAO.getAllNamespacesWithTokens()
}

export function getAll(namespace: string): Promise<Array<{
  token: string
  acquire: boolean
}>> {
  return AccessControlDAO.getAllTokens(namespace)
}

export function setAcquireToken(namespace: string, token: string): Promise<void> {
  return AccessControlDAO.setAcquireToken({ namespace, token })
}

export function unsetAcquireToken(namespace: string, token: string): Promise<void> {
  return AccessControlDAO.unsetAcquireToken({ namespace, token })
}
