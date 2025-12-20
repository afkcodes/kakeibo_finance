/**
 * @fileoverview Auth services barrel export
 * @module @kakeibo/core/services/auth
 *
 * Platform-agnostic authentication services.
 *
 * Platform: Platform-agnostic (core)
 */

export type { GuestUserResult } from '../../types/auth';
// Auth service
export {
  convertOAuthUser,
  createGuestUser,
  isGuestUser,
  isValidUserSettings,
  mergeSettingsWithDefaults,
} from './authService';
export type { MigrationCounts, MigrationResult } from './migration';
// Migration utilities
export {
  getPendingMigrationData,
  getPendingMigrationKey,
  shouldAttemptMigration,
} from './migration';
