import { getDatabase } from '../database.js'
import { withLazyStatic, lazyStatic } from 'extra-lazy'

export const getAllNamespacesWithTokenPolicies = withLazyStatic(function (): string[] {
  const rows = lazyStatic(() => getDatabase().prepare(`
    SELECT namespace
      FROM geyser_token_policy;
  `), [getDatabase()])
    .all() as Array<{ namespace: string }>

  return rows.map(x => x['namespace'])
})

export const getTokenPolicies = withLazyStatic(function (namespace: string): {
  acquireTokenRequired: boolean | null
} {
  const row = lazyStatic(() => getDatabase().prepare(`
    SELECT acquire_token_required
      FROM geyser_token_policy
     WHERE namespace = $namespace;
  `), [getDatabase()])
    .get({ namespace }) as { acquire_token_required: 1 | 0 | null } | undefined

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
})

export const setAcquireTokenRequired = withLazyStatic(function (
  namespace: string
, val: boolean
): void {
  lazyStatic(() => getDatabase().prepare(`
    INSERT INTO geyser_token_policy (namespace, acquire_token_required)
    VALUES ($namespace, $acquireTokenRequired)
        ON CONFLICT(namespace)
        DO UPDATE SET acquire_token_required = $acquireTokenRequired;
  `), [getDatabase()]).run({ namespace, acquireTokenRequired: booleanToNumber(val) })
})

export const unsetAcquireTokenRequired = withLazyStatic(function (namespace: string): void {
  lazyStatic(() => getDatabase().transaction((namespace: string) => {
    lazyStatic(() => getDatabase().prepare(`
      UPDATE geyser_token_policy
         SET acquire_token_required = NULL
       WHERE namespace = $namespace;
    `), [getDatabase()]).run({ namespace })

    deleteNoPoliciesRow(namespace)
  }), [getDatabase()])(namespace)
})

const deleteNoPoliciesRow = withLazyStatic(function (namespace: string): void {
  lazyStatic(() => getDatabase().prepare(`
    DELETE FROM geyser_token_policy
     WHERE namespace = $namespace
       AND acquire_token_required = NULL
  `), [getDatabase()]).run({ namespace })
})

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
