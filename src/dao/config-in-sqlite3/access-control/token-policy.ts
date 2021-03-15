import { getDatabase } from '../database'

export function getAllIdsWithTokenPolicies(): string[] {
  const result = getDatabase().prepare(`
    SELECT geyser_id
      FROM geyser_token_policy;
  `).all()
  return result.map(x => x['geyser_id'])
}

export function getTokenPolicies(id: string): { acquireTokenRequired: boolean | null } {
  const row: {
    'acquire_token_required': number | null
  } = getDatabase().prepare(`
    SELECT acquire_token_required
      FROM geyser_token_policy
     WHERE geyser_id = $id;
  `).get({ id })

  if (row) {
    const acquireTokenRequired = row['acquire_token_required']

    return {
      acquireTokenRequired: acquireTokenRequired === null
                            ? null
                            : numberToBoolean(acquireTokenRequired)
    }
  } else {
    return { acquireTokenRequired: null }
  }
}

export function setAcquireTokenRequired(id: string, val: boolean): void {
  getDatabase().prepare(`
    INSERT INTO geyser_token_policy (geyser_id, acquire_token_required)
    VALUES ($id, $acquireTokenRequired)
        ON CONFLICT(geyser_id)
        DO UPDATE SET acquire_token_required = $acquireTokenRequired;
  `).run({ id, acquireTokenRequired: booleanToNumber(val) })
}

export function unsetAcquireTokenRequired(id: string): void {
  const db = getDatabase()
  db.transaction(() => {
    db.prepare(`
      UPDATE geyser_token_policy
         SET acquire_token_required = NULL
       WHERE geyser_id = $id;
    `).run({ id })

    deleteNoPoliciesRow(id)
  })()
}

function deleteNoPoliciesRow(id: string): void {
  getDatabase().prepare(`
    DELETE FROM geyser_token_policy
     WHERE geyser_id = $id
       AND acquire_token_required = NULL
  `).run({ id })
}

function numberToBoolean(val: number): boolean {
  if (val === 0) {
    return false
  } else {
    return true
  }
}

function booleanToNumber(val: boolean): number {
  if (val) {
    return 1
  } else {
    return 0
  }
}
