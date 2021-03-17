import { getDatabase } from '../database'

export function getAllIdsWithConfiguration(): string[] {
  const result = getDatabase().prepare(`
    SELECT geyser_id
      FROM geyser_configuration;
  `).all()
  return result.map(x => x['geyser_id'])
}

export function getConfiguration(id: string): IConfiguration {
  const row: {
    'duration': number | null
    'limit': number | null
  } = getDatabase().prepare(`
    SELECT duration
         , "limit"
      FROM geyser_configuration
     WHERE geyser_id = $id;
  `).get({ id })

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
}

export function setDuration(id: string, val: number): void {
  getDatabase().prepare(`
    INSERT INTO geyser_configuration (geyser_id, duration)
    VALUES ($id, $duration)
        ON CONFLICT(geyser_id)
        DO UPDATE SET duration = $duration;
  `).run({ id, duration: val })
}

export function unsetDuration(id: string): void {
  const db = getDatabase()
  db.transaction(() => {
    db.prepare(`
      UPDATE geyser_configuration
         SET duration = NULL
       WHERE geyser_id = $id;
    `).run({ id })

    deleteNoConfigurationsRow(id)
  })()
}

export function setLimit(id: string, val: number) {
  getDatabase().prepare(`
    INSERT INTO geyser_configuration (geyser_id, "limit")
    VALUES ($id, $limit)
        ON CONFLICT(geyser_id)
        DO UPDATE SET "limit" = $limit;
  `).run({ id, limit: val })
}

export function unsetLimit(id: string): void {
  const db = getDatabase()
  db.transaction(() => {
    db.prepare(`
      UPDATE geyser_configuration
         SET "limit" = NULL
       WHERE geyser_id = $id;
    `).run({ id })

    deleteNoConfigurationsRow(id)
  })()
}

function deleteNoConfigurationsRow(id: string): void {
  getDatabase().prepare(`
    DELETE FROM geyser_configuration
     WHERE geyser_id = $id
       AND duration = NULL
       AND "limit" = NULL;
  `).run({ id })
}
