/**
 * @fileoverview Database migration system
 * @module @kakeibo/native/services/db
 *
 * Handles database versioning and migrations for schema updates.
 *
 * Platform: Native only
 */

import type { DB } from '@op-engineering/op-sqlite';
import { CREATE_INDEXES, CREATE_TABLES, SCHEMA_VERSION } from './schema';

/**
 * Get current database version
 */
export async function getDatabaseVersion(db: DB): Promise<number> {
  try {
    const result = await db.execute('PRAGMA user_version;');
    const version = result.rows[0]?.user_version;
    return typeof version === 'number' ? version : 0;
  } catch (error) {
    console.error('Failed to get database version:', error);
    return 0;
  }
}

/**
 * Set database version
 */
export async function setDatabaseVersion(db: DB, version: number): Promise<void> {
  try {
    await db.execute(`PRAGMA user_version = ${version};`);
  } catch (error) {
    console.error('Failed to set database version:', error);
    throw error;
  }
}

/**
 * Initialize database with schema
 * Creates all tables and indexes if they don't exist
 */
export async function initializeDatabase(db: DB): Promise<void> {
  try {
    const currentVersion = await getDatabaseVersion(db);

    if (currentVersion === 0) {
      console.log('Initializing database schema...');

      // Create all tables
      for (const createTableSQL of CREATE_TABLES) {
        await db.execute(createTableSQL);
      }

      // Create all indexes
      for (const createIndexSQL of CREATE_INDEXES) {
        await db.execute(createIndexSQL);
      }

      // Set version
      await setDatabaseVersion(db, SCHEMA_VERSION);

      console.log(`Database initialized with version ${SCHEMA_VERSION}`);
    } else if (currentVersion < SCHEMA_VERSION) {
      console.log(`Migrating database from v${currentVersion} to v${SCHEMA_VERSION}`);
      await runMigrations(db, currentVersion, SCHEMA_VERSION);
    } else {
      console.log(`Database is up to date (v${currentVersion})`);
    }
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
}

/**
 * Run database migrations
 * Applies incremental schema changes based on version
 */
async function runMigrations(db: DB, fromVersion: number, toVersion: number): Promise<void> {
  // Future migrations will go here
  // Example:
  // if (fromVersion < 2 && toVersion >= 2) {
  //   await migrateToV2(db);
  // }

  await setDatabaseVersion(db, toVersion);
  console.log(`Migration complete: v${fromVersion} → v${toVersion}`);
}

/**
 * Drop all tables (for testing/reset)
 * WARNING: This deletes all data!
 */
export async function dropAllTables(db: DB): Promise<void> {
  const tables = ['goals', 'budgets', 'transactions', 'categories', 'accounts', 'users'];

  for (const table of tables) {
    await db.execute(`DROP TABLE IF EXISTS ${table};`);
  }

  await setDatabaseVersion(db, 0);
  console.log('All tables dropped');
}
