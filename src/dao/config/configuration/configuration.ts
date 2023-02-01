import { getDatabase } from '../database.js'
import { withLazyStatic, lazyStatic } from 'extra-lazy'
import { IConfiguration } from './contract.js'

export const getAllNamespacesWithConfiguration = withLazyStatic(function (): string[] {
  const result = lazyStatic(() => getDatabase().prepare(`
    SELECT namespace
      FROM geyser_configuration;
  `), [getDatabase()]).all()

  return result.map(x => x['namespace'])
})

export const getConfiguration = withLazyStatic(function (namespace: string): IConfiguration {
  const row: {
    'duration': number | null
    'limit': number | null
  } = lazyStatic(() => getDatabase().prepare(`
    SELECT duration
         , "limit"
      FROM geyser_configuration
     WHERE namespace = $namespace;
  `), [getDatabase()]).get({ namespace })

  if (row) {
    return {
      duration: row['duration']
    , limit: row['limit']
    }
  } else {
    return {
      duration: null
    , limit: null
    }
  }
})

export const setDuration = withLazyStatic(function (namespace: string, val: number): void {
  lazyStatic(() => getDatabase().prepare(`
    INSERT INTO geyser_configuration (namespace, duration)
    VALUES ($namespace, $duration)
        ON CONFLICT(namespace)
        DO UPDATE SET duration = $duration;
  `), [getDatabase()]).run({ namespace, duration: val })
})

export const unsetDuration = withLazyStatic(function (namespace: string): void {
  lazyStatic(() => getDatabase().transaction((namespace: string) => {
    lazyStatic(() => getDatabase().prepare(`
      UPDATE geyser_configuration
         SET duration = NULL
       WHERE namespace = $namespace;
    `), [getDatabase()]).run({ namespace })

    deleteNoConfigurationsRow(namespace)
  }), [getDatabase()])(namespace)
})

export const setLimit = withLazyStatic(function (namespace: string, val: number): void {
  lazyStatic(() => getDatabase().prepare(`
    INSERT INTO geyser_configuration (namespace, "limit")
    VALUES ($namespace, $limit)
        ON CONFLICT(namespace)
        DO UPDATE SET "limit" = $limit;
  `), [getDatabase()]).run({ namespace, limit: val })
})

export const unsetLimit = withLazyStatic(function (namespace: string): void {
  lazyStatic(() => getDatabase().transaction((namespace: string) => {
    lazyStatic(() => getDatabase().prepare(`
      UPDATE geyser_configuration
         SET "limit" = NULL
       WHERE namespace = $namespace;
    `), [getDatabase()]).run({ namespace })

    deleteNoConfigurationsRow(namespace)
  }), [getDatabase()])(namespace)
})

const deleteNoConfigurationsRow = withLazyStatic(function (namespace: string): void {
  lazyStatic(() => getDatabase().prepare(`
    DELETE FROM geyser_configuration
     WHERE namespace = $namespace
       AND duration = NULL
       AND "limit" = NULL;
  `), [getDatabase()]).run({ namespace })
})
