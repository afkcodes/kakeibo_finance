/**
 * @fileoverview Database Error Handler Utility
 * @module @kakeibo/web/utils
 *
 * Provides error handling wrapper for Dexie operations
 */

import { toastHelpers } from './toast';

/**
 * Error messages for common database errors
 */
const DB_ERROR_MESSAGES: Record<string, string> = {
  QuotaExceededError: 'Storage quota exceeded. Please free up some space.',
  VersionError: 'Database version mismatch. Please refresh the page.',
  NotFoundError: 'The requested item was not found.',
  ConstraintError: 'This item already exists or conflicts with existing data.',
  DataError: 'Invalid data format. Please check your input.',
  TransactionInactiveError: 'Database transaction failed. Please try again.',
  ReadOnlyError: 'Cannot modify data in read-only mode.',
  TimeoutError: 'Database operation timed out. Please try again.',
  AbortError: 'Operation was cancelled.',
  UnknownError: 'An unexpected error occurred. Please try again.',
};

/**
 * Get user-friendly error message from database error
 */
export const getDatabaseErrorMessage = (error: any): string => {
  if (!error) return DB_ERROR_MESSAGES.UnknownError;

  const errorName = error.name || error.constructor?.name || 'UnknownError';
  return DB_ERROR_MESSAGES[errorName] || error.message || DB_ERROR_MESSAGES.UnknownError;
};

/**
 * Wrapper for database operations with error handling
 */
export async function withDatabaseErrorHandling<T>(
  operation: () => Promise<T>,
  options?: {
    errorMessage?: string;
    showToast?: boolean;
    onError?: (error: Error) => void;
    retries?: number;
    retryDelay?: number;
  }
): Promise<T | null> {
  const { errorMessage, showToast = true, onError, retries = 0, retryDelay = 1000 } = options || {};

  let attempt = 0;

  while (attempt <= retries) {
    try {
      return await operation();
    } catch (error: any) {
      console.error('[Database Error]', error);

      // Don't retry on certain errors
      const shouldRetry =
        attempt < retries &&
        !['ConstraintError', 'DataError', 'NotFoundError'].includes(error.name);

      if (shouldRetry) {
        attempt++;
        // Exponential backoff
        await new Promise((resolve) => setTimeout(resolve, retryDelay * attempt));
        continue;
      }

      // Show error toast
      if (showToast) {
        const message = errorMessage || getDatabaseErrorMessage(error);
        toastHelpers.error('Database Error', message);
      }

      // Call error handler
      if (onError) {
        onError(error);
      }

      return null;
    }
  }

  return null;
}

/**
 * Check if storage quota is available
 */
export async function checkStorageQuota(): Promise<{
  available: boolean;
  usage?: number;
  quota?: number;
  percentage?: number;
}> {
  try {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      const usage = estimate.usage || 0;
      const quota = estimate.quota || 0;
      const percentage = quota > 0 ? (usage / quota) * 100 : 0;

      return {
        available: percentage < 90, // Warn if > 90% used
        usage,
        quota,
        percentage,
      };
    }
  } catch (error) {
    console.error('Failed to check storage quota:', error);
  }

  return { available: true };
}

/**
 * Show warning if storage quota is low
 */
export async function warnIfStorageLow(): Promise<void> {
  const { available, percentage } = await checkStorageQuota();

  if (!available && percentage) {
    toastHelpers.warning(
      'Storage almost full',
      `You're using ${percentage.toFixed(0)}% of available storage. Consider exporting and cleaning up old data.`
    );
  }
}
