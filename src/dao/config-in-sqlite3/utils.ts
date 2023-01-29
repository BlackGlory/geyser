import * as path from 'path'
import type { Database as IDatabase } from 'better-sqlite3'
import { getAppRoot } from '@src/utils.js'
import { findMigrationFilenames, readMigrationFile } from 'migration-files'
import { map } from 'extra-promise'
import { migrate } from '@blackglory/better-sqlite3-migrations'

export async function migrateDatabase(db: IDatabase): Promise<void> {
  const migrationsPath = path.join(getAppRoot(), 'migrations/config-in-sqlite3')
  const migrations = await map(
    await findMigrationFilenames(migrationsPath)
  , readMigrationFile
  )
  migrate(db, migrations)
}
