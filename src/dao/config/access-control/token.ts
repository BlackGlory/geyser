import { getDatabase } from '../database.js'
import { withLazyStatic, lazyStatic } from 'extra-lazy'

export const getAllNamespacesWithTokens = withLazyStatic(function (): string[] {
  const rows = lazyStatic(() => getDatabase().prepare(`
    SELECT namespace
      FROM geyser_token;
  `), [getDatabase()])
    .all() as Array<{ namespace: string }>

  return rows.map(x => x['namespace'])
})

export const getAllTokens = withLazyStatic(function (
  namespace: string
): Array<{ token: string, acquire: boolean }> {
  const rows = lazyStatic(() => getDatabase().prepare(`
    SELECT token
         , acquire_permission
      FROM geyser_token
     WHERE namespace = $namespace;
  `), [getDatabase()])
    .all({ namespace }) as Array<{
      token: string
      acquire_permission: number
    }>

  return rows.map(x => ({
    token: x['token']
  , acquire: x['acquire_permission'] === 1
  }))
})

export const hasAcquireTokens = withLazyStatic(function (namespace: string): boolean {
  const result = lazyStatic(() => getDatabase().prepare(`
    SELECT EXISTS(
             SELECT 1
               FROM geyser_token
              WHERE namespace = $namespace
                AND acquire_permission = 1
           ) AS acquire_tokens_exist
  `), [getDatabase()])
    .get({ namespace }) as { acquire_tokens_exist: 1 | 0 }

  return result['acquire_tokens_exist'] === 1
})

export const matchAcquireToken = withLazyStatic(function ({ token, namespace }: {
  token: string
  namespace: string
}): boolean {
  const row = lazyStatic(() => getDatabase().prepare(`
    SELECT EXISTS(
             SELECT 1
               FROM geyser_token
              WHERE namespace = $namespace
                AND token = $token
                AND acquire_permission = 1
           ) AS matched
  `), [getDatabase()])
    .get({ token, namespace }) as { matched: 1 | 0 }

  return row['matched'] === 1
})

export const setAcquireToken = withLazyStatic(function ({ token, namespace }: {
  token: string
  namespace: string
}): void {
  lazyStatic(() => getDatabase().prepare(`
    INSERT INTO geyser_token (token, namespace, acquire_permission)
    VALUES ($token, $namespace, 1)
        ON CONFLICT (token, namespace)
        DO UPDATE SET acquire_permission = 1;
  `), [getDatabase()]).run({ token, namespace })
})

export const unsetAcquireToken = withLazyStatic(function (params: {
  token: string
  namespace: string
}): void {
  lazyStatic(() => getDatabase().transaction(({ token, namespace }: {
    token: string
    namespace: string
  }) => {
    lazyStatic(() => getDatabase().prepare(`
      UPDATE geyser_token
         SET acquire_permission = 0
       WHERE token = $token
         AND namespace = $namespace;
    `), [getDatabase()]).run({ token, namespace })

    deleteNoPermissionToken({ token, namespace })
  }), [getDatabase()])(params)
})

const deleteNoPermissionToken = withLazyStatic(function (params: {
  token: string
  namespace: string
}): void {
  lazyStatic(() => getDatabase().prepare(`
    DELETE FROM geyser_token
     WHERE token = $token
       AND namespace = $namespace
       AND acquire_permission = 0;
  `), [getDatabase()]).run(params)
})
