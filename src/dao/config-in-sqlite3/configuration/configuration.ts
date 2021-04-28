import { getDatabase } from '../database'

export function getAllNamespacesWithConfiguration(): string[] {
  const result = getDatabase().prepare(`
    SELECT namespace
      FROM geyser_configuration;
  `).all()
  return result.map(x => x['namespace'])
}

export function getConfiguration(namespace: string): IConfiguration {
  const row: {
    'duration': number | null
    'limit': number | null
  } = getDatabase().prepare(`
    SELECT duration
         , "limit"
      FROM geyser_configuration
     WHERE namespace = $namespace;
  `).get({ namespace })

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

export function setDuration(namespace: string, val: number): void {
  getDatabase().prepare(`
    INSERT INTO geyser_configuration (namespace, duration)
    VALUES ($namespace, $duration)
        ON CONFLICT(namespace)
        DO UPDATE SET duration = $duration;
  `).run({ namespace, duration: val })
}

export function unsetDuration(namespace: string): void {
  const db = getDatabase()
  db.transaction(() => {
    db.prepare(`
      UPDATE geyser_configuration
         SET duration = NULL
       WHERE namespace = $namespace;
    `).run({ namespace })

    deleteNoConfigurationsRow(namespace)
  })()
}

export function setLimit(namespace: string, val: number) {
  getDatabase().prepare(`
    INSERT INTO geyser_configuration (namespace, "limit")
    VALUES ($namespace, $limit)
        ON CONFLICT(namespace)
        DO UPDATE SET "limit" = $limit;
  `).run({ namespace, limit: val })
}

export function unsetLimit(namespace: string): void {
  const db = getDatabase()
  db.transaction(() => {
    db.prepare(`
      UPDATE geyser_configuration
         SET "limit" = NULL
       WHERE namespace = $namespace;
    `).run({ namespace })

    deleteNoConfigurationsRow(namespace)
  })()
}

function deleteNoConfigurationsRow(namespace: string): void {
  getDatabase().prepare(`
    DELETE FROM geyser_configuration
     WHERE namespace = $namespace
       AND duration = NULL
       AND "limit" = NULL;
  `).run({ namespace })
}
