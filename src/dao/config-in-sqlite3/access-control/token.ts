import { getDatabase } from '../database'

export function getAllIdsWithTokens(): string[] {
  const result = getDatabase().prepare(`
    SELECT geyser_id
      FROM geyser_token;
  `).all()

  return result.map(x => x['geyser_id'])
}

export function getAllTokens(id: string): Array<{ token: string, acquire: boolean }> {
  const result: Array<{
    token: string
    'acquire_permission': number
  }> = getDatabase().prepare(`
    SELECT token
         , acquire_permission
      FROM geyser_token
     WHERE geyser_id = $id;
  `).all({ id })

  return result.map(x => ({
    token: x['token']
  , acquire: x['acquire_permission'] === 1
  }))
}

export function hasAcquireTokens(id: string): boolean {
  const result = getDatabase().prepare(`
    SELECT EXISTS(
             SELECT *
               FROM geyser_token
              WHERE geyser_id = $id
                AND acquire_permission = 1
           ) AS acquire_tokens_exist
  `).get({ id })

  return result['acquire_tokens_exist'] === 1
}

export function matchAcquireToken({ token, id }: {
  token: string
  id: string
}): boolean {
  const result = getDatabase().prepare(`
    SELECT EXISTS(
             SELECT *
               FROM geyser_token
              WHERE geyser_id = $id
                AND token = $token
                AND acquire_permission = 1
           ) AS matched
  `).get({ token, id })

  return result['matched'] === 1
}

export function setAcquireToken({ token, id }: { token: string; id: string }) {
  getDatabase().prepare(`
    INSERT INTO geyser_token (token, geyser_id, acquire_permission)
    VALUES ($token, $id, 1)
        ON CONFLICT (token, geyser_id)
        DO UPDATE SET acquire_permission = 1;
  `).run({ token, id })
}

export function unsetAcquireToken({ token, id }: { token: string; id: string }) {
  const db = getDatabase()
  db.transaction(() => {
    db.prepare(`
      UPDATE geyser_token
         SET acquire_permission = 0
       WHERE token = $token
         AND geyser_id = $id;
    `).run({ token, id })

    deleteNoPermissionToken({ token, id })
  })()
}

function deleteNoPermissionToken(params: { token: string, id: string }) {
  getDatabase().prepare(`
    DELETE FROM geyser_token
     WHERE token = $token
       AND geyser_id = $id
       AND acquire_permission = 0;
  `).run(params)
}
