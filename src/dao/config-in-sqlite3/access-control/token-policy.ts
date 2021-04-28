import { getDatabase } from '../database'

export function getAllNamespacesWithTokenPolicies(): string[] {
  const result = getDatabase().prepare(`
    SELECT namespace
      FROM geyser_token_policy;
  `).all()
  return result.map(x => x['namespace'])
}

export function getTokenPolicies(namespace: string): { acquireTokenRequired: boolean | null } {
  const row: {
    'acquire_token_required': number | null
  } = getDatabase().prepare(`
    SELECT acquire_token_required
      FROM geyser_token_policy
     WHERE namespace = $namespace;
  `).get({ namespace })

  if (row) {
    const acquireTokenRequired = row['acquire_token_required']

    return {
      acquireTokenRequired:
        acquireTokenRequired === null
        ? null
        : numberToBoolean(acquireTokenRequired)
    }
  } else {
    return { acquireTokenRequired: null }
  }
}

export function setAcquireTokenRequired(namespace: string, val: boolean): void {
  getDatabase().prepare(`
    INSERT INTO geyser_token_policy (namespace, acquire_token_required)
    VALUES ($namespace, $acquireTokenRequired)
        ON CONFLICT(namespace)
        DO UPDATE SET acquire_token_required = $acquireTokenRequired;
  `).run({ namespace, acquireTokenRequired: booleanToNumber(val) })
}

export function unsetAcquireTokenRequired(namespace: string): void {
  const db = getDatabase()
  db.transaction(() => {
    db.prepare(`
      UPDATE geyser_token_policy
         SET acquire_token_required = NULL
       WHERE namespace = $namespace;
    `).run({ namespace })

    deleteNoPoliciesRow(namespace)
  })()
}

function deleteNoPoliciesRow(namespace: string): void {
  getDatabase().prepare(`
    DELETE FROM geyser_token_policy
     WHERE namespace = $namespace
       AND acquire_token_required = NULL
  `).run({ namespace })
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
