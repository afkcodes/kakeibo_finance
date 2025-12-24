/**
 * @fileoverview Native database setup (OP-SQLite)
 * @module @kakeibo/native/services/db
 *
 * Initializes SQLite database for native platform.
 *
 * Platform: Native only
 */

import type { DB } from '@op-engineering/op-sqlite';
import { open } from '@op-engineering/op-sqlite';
import { initializeDatabase } from './migrations';

/**
 * Database connection singleton
 */
let dbInstance: DB | null = null;

/**
 * Database name
 */
const DB_NAME = 'kakeibo.db';

/**
 * Get or create database connection
 */
export async function getDatabase(): Promise<DB> {
  if (dbInstance) {
    return dbInstance;
  }

  try {
    // Open database connection
    dbInstance = open({
      name: DB_NAME,
    });

    // Enable foreign keys (SQLite has them disabled by default)
    await dbInstance.execute('PRAGMA foreign_keys = ON;');

    // Initialize schema
    await initializeDatabase(dbInstance);

    console.log('Database connection established');
    return dbInstance;
  } catch (error) {
    console.error('Failed to open database:', error);
    throw error;
  }
}

/**
 * Close database connection
 */
export async function closeDatabase(): Promise<void> {
  if (dbInstance) {
    try {
      dbInstance.close();
      dbInstance = null;
      console.log('Database connection closed');
    } catch (error) {
      console.error('Failed to close database:', error);
    }
  }
}

/**
 * Execute a SQL query
 * Helper function with error handling
 */
export async function executeQuery<T = any>(
  sql: string,
  params?: any[]
): Promise<{ rows: T[]; rowsAffected: number }> {
  const db = await getDatabase();

  try {
    const result = await db.execute(sql, params);
    return {
      rows: result.rows as T[],
      rowsAffected: result.rowsAffected ?? 0,
    };
  } catch (error) {
    console.error('Query execution failed:', error);
    console.error('SQL:', sql);
    console.error('Params:', params);
    throw error;
  }
}

/**
 * Execute multiple queries in a transaction
 * Ensures atomicity - all succeed or all fail
 */
export async function executeTransaction(
  queries: Array<{ sql: string; params?: any[] }>
): Promise<void> {
  const db = await getDatabase();

  await db.transaction(async (tx) => {
    for (const { sql, params } of queries) {
      await tx.execute(sql, params);
    }
  });
}

// Export the database instance getter
export const db = { getDatabase, closeDatabase, executeQuery, executeTransaction };

// Export adapter
export { adapter } from './SQLiteAdapter';
