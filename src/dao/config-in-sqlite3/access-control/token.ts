import { getDatabase } from '../database'

export function getAllNamespacesWithTokens(): string[] {
  const result = getDatabase().prepare(`
    SELECT namespace
      FROM geyser_token;
  `).all()

  return result.map(x => x['namespace'])
}

export function getAllTokens(namespace: string): Array<{ token: string, acquire: boolean }> {
  const result: Array<{
    token: string
    'acquire_permission': number
  }> = getDatabase().prepare(`
    SELECT token
         , acquire_permission
      FROM geyser_token
     WHERE namespace = $namespace;
  `).all({ namespace })

  return result.map(x => ({
    token: x['token']
  , acquire: x['acquire_permission'] === 1
  }))
}

export function hasAcquireTokens(namespace: string): boolean {
  const result = getDatabase().prepare(`
    SELECT EXISTS(
             SELECT 1
               FROM geyser_token
              WHERE namespace = $namespace
                AND acquire_permission = 1
           ) AS acquire_tokens_exist
  `).get({ namespace })

  return result['acquire_tokens_exist'] === 1
}

export function matchAcquireToken({ token, namespace }: {
  token: string
  namespace: string
}): boolean {
  const result = getDatabase().prepare(`
    SELECT EXISTS(
             SELECT 1
               FROM geyser_token
              WHERE namespace = $namespace
                AND token = $token
                AND acquire_permission = 1
           ) AS matched
  `).get({ token, namespace })

  return result['matched'] === 1
}

export function setAcquireToken({ token, namespace }: {
  token: string
  namespace: string
}): void {
  getDatabase().prepare(`
    INSERT INTO geyser_token (token, namespace, acquire_permission)
    VALUES ($token, $namespace, 1)
        ON CONFLICT (token, namespace)
        DO UPDATE SET acquire_permission = 1;
  `).run({ token, namespace })
}

export function unsetAcquireToken({ token, namespace }: {
  token: string
  namespace: string
}): void {
  const db = getDatabase()
  db.transaction(() => {
    db.prepare(`
      UPDATE geyser_token
         SET acquire_permission = 0
       WHERE token = $token
         AND namespace = $namespace;
    `).run({ token, namespace })

    deleteNoPermissionToken({ token, namespace })
  })()
}

function deleteNoPermissionToken(params: { token: string, namespace: string }) {
  getDatabase().prepare(`
    DELETE FROM geyser_token
     WHERE token = $token
       AND namespace = $namespace
       AND acquire_permission = 0;
  `).run(params)
}
