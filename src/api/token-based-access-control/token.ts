import { AccessControlDAO } from '@dao/index.js'

export function getAllNamespaces(): string[] {
  return AccessControlDAO.Token.getAllNamespacesWithTokens()
}

export function getAll(namespace: string): Array<{
  token: string
  acquire: boolean
}> {
  return AccessControlDAO.Token.getAllTokens(namespace)
}

export function setAcquireToken(namespace: string, token: string): void {
  AccessControlDAO.Token.setAcquireToken({ namespace, token })
}

export function unsetAcquireToken(namespace: string, token: string): void {
  AccessControlDAO.Token.unsetAcquireToken({ namespace, token })
}
