import { getDatabase } from '../database.js'
import { withLazyStatic, lazyStatic } from 'extra-lazy'

export const getAllWhitelistItems = withLazyStatic(function (): string[] {
  const result = lazyStatic(() => getDatabase().prepare(`
    SELECT namespace
      FROM geyser_whitelist;
  `), [getDatabase()])
    .all() as Array<{ namespace: string }>

  return result.map(x => x['namespace'])
})

export const inWhitelist = withLazyStatic(function (namespace: string): boolean {
  const result = lazyStatic(() => getDatabase().prepare(`
    SELECT EXISTS(
             SELECT 1
               FROM geyser_whitelist
              WHERE namespace = $namespace
           ) AS exist_in_whitelist;
  `), [getDatabase()])
    .get({ namespace }) as { exist_in_whitelist: 1 | 0 }

  return result['exist_in_whitelist'] === 1
})

export const addWhitelistItem = withLazyStatic(function (namespace: string): void {
  lazyStatic(() => getDatabase().prepare(`
    INSERT INTO geyser_whitelist (namespace)
    VALUES ($namespace)
        ON CONFLICT
        DO NOTHING;
  `), [getDatabase()]).run({ namespace: namespace })
})

export const removeWhitelistItem = withLazyStatic(function (namespace: string): void {
  lazyStatic(() => getDatabase().prepare(`
    DELETE FROM geyser_whitelist
     WHERE namespace = $namespace;
  `), [getDatabase()]).run({ namespace: namespace })
})