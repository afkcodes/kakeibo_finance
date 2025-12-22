/**
 * @fileoverview Utility functions and helpers
 * @module @kakeibo/web/utils
 */

export type { Toast, ToastPayload, ToastVariant } from './toast';
export { subscribe, toast, toastHelpers } from './toast';

// Database error handling
export {
  checkStorageQuota,
  getDatabaseErrorMessage,
  warnIfStorageLow,
  withDatabaseErrorHandling,
} from './databaseErrorHandler';
