/**
 * @fileoverview Data migration utilities for user transitions
 * @module @kakeibo/core/services/auth
 *
 * Handles guest→authenticated user data migration.
 * Pure functions for migration logic (DB operations happen in platform layer).
 *
 * Platform: Platform-agnostic (core)
 */

/**
 * Migration result tracking
 */
export interface MigrationCounts {
  /** Number of transactions migrated */
  transactions: number;
  /** Number of budgets migrated */
  budgets: number;
  /** Number of goals migrated */
  goals: number;
  /** Number of accounts migrated */
  accounts: number;
  /** Number of categories migrated */
  categories: number;
}

/**
 * Migration operation result
 */
export interface MigrationResult {
  /** Whether migration succeeded */
  success: boolean;
  /** Counts of migrated records */
  migratedCounts: MigrationCounts;
  /** Error message if failed */
  error?: string;
}

/**
 * Storage key for pending migration guest ID
 */
const PENDING_MIGRATION_KEY = 'pendingMigrationGuestId';

/**
 * Get the storage key for pending migration
 *
 * @returns Storage key
 */
export function getPendingMigrationKey(): string {
  return PENDING_MIGRATION_KEY;
}

/**
 * Get storage data for pending migration
 *
 * @param guestUserId - Guest user ID to store
 * @returns Storage key and value for platform storage
 */
export function getPendingMigrationData(guestUserId: string): { key: string; value: string } {
  return {
    key: PENDING_MIGRATION_KEY,
    value: guestUserId,
  };
}

/**
 * Check if guest user ID indicates need for migration
 *
 * @param guestUserId - Guest user ID from storage
 * @returns True if migration should be attempted
 */
export function shouldAttemptMigration(guestUserId: string | null): boolean {
  return guestUserId?.startsWith('guest-') ?? false;
}
