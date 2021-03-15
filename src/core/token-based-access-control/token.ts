import { AccessControlDAO } from '@dao'

export function getAllIds(): Promise<string[]> {
  return AccessControlDAO.getAllIdsWithTokens()
}

export function getAll(id: string): Promise<Array<{
  token: string
  acquire: boolean
}>> {
  return AccessControlDAO.getAllTokens(id)
}

export function setAcquireToken(id: string, token: string): Promise<void> {
  return AccessControlDAO.setAcquireToken({ id, token })
}

export function unsetAcquireToken(id: string, token: string): Promise<void> {
  return AccessControlDAO.unsetAcquireToken({ id, token })
}
