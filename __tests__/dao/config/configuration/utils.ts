import { MapNullablePropsToOptional } from 'hotypes'
import { getDatabase } from '@dao/config/database.js'

interface IRawConfiguration {
  namespace: string
  duration: number | null
  limit: number | null
}

export function setRawConfiguration<T extends IRawConfiguration>(item: T): T {
  getDatabase().prepare(`
    INSERT INTO geyser_configuration (
      namespace
    , duration
    , "limit"
    )
    VALUES (
      $namespace
    , $duration
    , $limit
    );
  `).run(item)

  return item
}

export function setMinimalConfiguration(item: MapNullablePropsToOptional<IRawConfiguration>): IRawConfiguration {
  return setRawConfiguration({
    namespace: item.namespace
  , duration: item.duration ?? null
  , limit: item.limit ?? null
  })
}

export function hasRawConfiguration(namespace: string): boolean {
  return !!getRawConfiguration(namespace)
}

export function getRawConfiguration(namespace: string): IRawConfiguration | undefined {
  return getDatabase().prepare(`
    SELECT *
      FROM geyser_configuration
     WHERE namespace = $namespace;
  `).get({ namespace }) as IRawConfiguration | undefined
}
