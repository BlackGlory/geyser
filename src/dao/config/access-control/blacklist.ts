import { getDatabase } from '../database.js'
import { withLazyStatic, lazyStatic } from 'extra-lazy'

export const getAllBlacklistItems = withLazyStatic(function (): string[] {
  const rows = lazyStatic(() => getDatabase().prepare(`
    SELECT namespace
      FROM geyser_blacklist;
  `), [getDatabase()])
    .all() as Array<{ namespace: string }>

  return rows.map(x => x['namespace'])
})

export const inBlacklist = withLazyStatic(function (namespace: string): boolean {
  const row = lazyStatic(() => getDatabase().prepare(`
    SELECT EXISTS(
             SELECT 1
               FROM geyser_blacklist
              WHERE namespace = $namespace
           ) AS exist_in_blacklist;
  `), [getDatabase()])
    .get({ namespace }) as { exist_in_blacklist: 1 | 0 }

  return row['exist_in_blacklist'] === 1
})

export const addBlacklistItem = withLazyStatic(function (namespace: string): void {
  lazyStatic(() => getDatabase().prepare(`
    INSERT INTO geyser_blacklist (namespace)
    VALUES ($namespace)
        ON CONFLICT
        DO NOTHING;
  `), [getDatabase()]).run({ namespace })
})

export const removeBlacklistItem = withLazyStatic(function (namespace: string): void {
  lazyStatic(() => getDatabase().prepare(`
    DELETE FROM geyser_blacklist
     WHERE namespace = $namespace;
  `), [getDatabase()]).run({ namespace })
})
