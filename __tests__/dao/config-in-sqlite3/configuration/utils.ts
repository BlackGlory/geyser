import { NullablePropsToOptionalProps } from '@blackglory/types'
import { getDatabase } from '@dao/config-in-sqlite3/database'

interface IRawConfiguration {
  geyser_id: string
  duration: number | null
  limit: number | null
}

export function setRawConfiguration<T extends IRawConfiguration>(item: T): T {
  getDatabase().prepare(`
    INSERT INTO geyser_configuration (
      geyser_id
    , duration
    , "limit"
    )
    VALUES (
      $geyser_id
    , $duration
    , $limit
    );
  `).run(item)

  return item
}

export function setMinimalConfiguration(item: NullablePropsToOptionalProps<IRawConfiguration>): IRawConfiguration {
  return setRawConfiguration({
    geyser_id: item.geyser_id
  , duration: item.duration ?? null
  , limit: item.limit ?? null
  })
}

export function hasRawConfiguration(id: string): boolean {
  return !!getRawConfiguration(id)
}

export function getRawConfiguration(id: string): IRawConfiguration | null {
  return getDatabase().prepare(`
    SELECT *
      FROM geyser_configuration
     WHERE geyser_id = $id;
  `).get({ id })
}
