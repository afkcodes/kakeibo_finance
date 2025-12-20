/**
 * @fileoverview Database migrations and normalization utilities
 * @module @kakeibo/core/services/database
 *
 * Provides utilities for migrating data between different formats,
 * normalizing legacy data, and handling backward compatibility.
 *
 * Platform: Platform-agnostic (core)
 */

import type { ExportData } from './types';

/**
 * Normalize category ID to user-independent format
 *
 * Converts legacy IDs like "default-user-expense-food" to "expense-food"
 * This ensures backward compatibility with older backups.
 *
 * @param categoryId - Category ID to normalize
 * @returns Normalized category ID
 *
 * @example
 * ```ts
 * normalizeCategoryId('default-user-expense-food'); // 'expense-food'
 * normalizeCategoryId('user123-expense-food'); // 'expense-food'
 * normalizeCategoryId('expense-food'); // 'expense-food' (unchanged)
 * ```
 */
export function normalizeCategoryId(categoryId: string): string {
  if (!categoryId) return categoryId;

  // Match legacy format: {anything}-expense-{name} or {anything}-income-{name}
  const expenseMatch = categoryId.match(/^.*-(expense-.+)$/);
  if (expenseMatch) return expenseMatch[1].replace(/&/g, 'and');

  const incomeMatch = categoryId.match(/^.*-(income-.+)$/);
  if (incomeMatch) return incomeMatch[1].replace(/&/g, 'and');

  // Already in correct format or custom category
  return categoryId.replace(/&/g, 'and');
}

/**
 * Detect user ID from backup data
 *
 * Attempts to find the user ID from the first available record
 * in the backup data.
 *
 * @param data - Export data
 * @returns User ID or null if not found
 *
 * @example
 * ```ts
 * const userId = detectBackupUserId(backupData);
 * if (userId) {
 *   console.log('Backup created by user:', userId);
 * }
 * ```
 */
export function detectBackupUserId(data: ExportData): string | null {
  // Try to find userId from various sources
  if (data.accounts?.[0]?.userId) return data.accounts[0].userId;
  if (data.transactions?.[0]?.userId) return data.transactions[0].userId;
  if (data.categories?.[0]?.userId) return data.categories[0].userId;
  if (data.budgets?.[0]?.userId) return data.budgets[0].userId;
  if (data.goals?.[0]?.userId) return data.goals[0].userId;
  if (data.users?.[0]?.id) return data.users[0].id;

  return null;
}

/**
 * Remap user ID in a record
 *
 * Replaces the userId field in a record with a new user ID.
 * Useful when importing data from another user.
 *
 * @param record - Record with userId field
 * @param newUserId - New user ID
 * @returns Record with updated userId
 *
 * @example
 * ```ts
 * const transaction = { id: '1', userId: 'oldUser', amount: 100 };
 * const updated = remapUserId(transaction, 'newUser');
 * // { id: '1', userId: 'newUser', amount: 100 }
 * ```
 */
export function remapUserId<T extends { userId?: string }>(record: T, newUserId: string): T {
  return { ...record, userId: newUserId };
}

/**
 * Normalize category IDs in a record
 *
 * Applies category ID normalization to categoryId and categoryIds fields.
 *
 * @param record - Record with category fields
 * @returns Record with normalized category IDs
 *
 * @example
 * ```ts
 * const transaction = {
 *   id: '1',
 *   categoryId: 'user123-expense-food'
 * };
 * const normalized = normalizeCategoryIdsInRecord(transaction);
 * // { id: '1', categoryId: 'expense-food' }
 * ```
 */
export function normalizeCategoryIdsInRecord<
  T extends { categoryId?: string; categoryIds?: string[] },
>(record: T): T {
  const normalized: T = { ...record };

  if (normalized.categoryId) {
    normalized.categoryId = normalizeCategoryId(normalized.categoryId);
  }

  if (normalized.categoryIds && Array.isArray(normalized.categoryIds)) {
    normalized.categoryIds = normalized.categoryIds.map(normalizeCategoryId);
  }

  return normalized;
}

/**
 * Migrate budget from old single-category format to new multi-category format
 *
 * Old budgets had a single `categoryId` field.
 * New budgets have a `categoryIds` array.
 *
 * @param budget - Budget record (old or new format)
 * @returns Budget with categoryIds array
 *
 * @example
 * ```ts
 * const oldBudget = { id: '1', categoryId: 'expense-food', amount: 500 };
 * const newBudget = migrateBudgetCategoryIds(oldBudget);
 * // { id: '1', categoryIds: ['expense-food'], amount: 500 }
 * ```
 */
export function migrateBudgetCategoryIds<T extends { categoryId?: string; categoryIds?: string[] }>(
  budget: T
): T & { categoryIds: string[] } {
  // New format: already has categoryIds array
  if (Array.isArray(budget.categoryIds) && budget.categoryIds.length > 0) {
    return budget as T & { categoryIds: string[] };
  }

  // Old format: convert single categoryId to array
  if (budget.categoryId) {
    const { categoryId, ...rest } = budget;
    return { ...rest, categoryIds: [categoryId] } as T & { categoryIds: string[] };
  }

  // No category IDs found
  return { ...budget, categoryIds: [] } as T & { categoryIds: string[] };
}

/**
 * Validate and fix financial month start day
 *
 * Ensures the financial month start day is between 1 and 31.
 *
 * @param day - Financial month start day
 * @param defaultDay - Default day if invalid (default: 1)
 * @returns Valid financial month start day
 *
 * @example
 * ```ts
 * validateFinancialMonthStartDay(15); // 15
 * validateFinancialMonthStartDay(35); // 1 (invalid, use default)
 * validateFinancialMonthStartDay('15'); // 15 (converts string)
 * ```
 */
export function validateFinancialMonthStartDay(
  day: number | string | null | undefined,
  defaultDay = 1
): number {
  if (day === null || day === undefined) return defaultDay;

  const numDay = typeof day === 'string' ? Number(day) : day;

  if (!Number.isFinite(numDay) || numDay < 1 || numDay > 31) {
    return defaultDay;
  }

  return Math.floor(numDay);
}

/**
 * Clean and validate export data
 *
 * Ensures export data has valid structure and removes invalid records.
 *
 * @param data - Export data to validate
 * @returns Cleaned export data
 */
export function cleanExportData(data: ExportData): ExportData {
  const cleaned: ExportData = {
    ...data,
    users: Array.isArray(data.users) ? data.users.filter((u) => u?.id) : [],
    accounts: Array.isArray(data.accounts) ? data.accounts.filter((a) => a?.id) : [],
    categories: Array.isArray(data.categories) ? data.categories.filter((c) => c?.id) : [],
    transactions: Array.isArray(data.transactions) ? data.transactions.filter((t) => t?.id) : [],
    budgets: Array.isArray(data.budgets) ? data.budgets.filter((b) => b?.id) : [],
    goals: Array.isArray(data.goals) ? data.goals.filter((g) => g?.id) : [],
  };

  return cleaned;
}

/**
 * Generate migration report
 *
 * Creates a summary of what was migrated during an import operation.
 *
 * @param data - Export data
 * @returns Migration report
 */
export function generateMigrationReport(data: ExportData): {
  totalRecords: number;
  recordCounts: Record<string, number>;
  hasSettings: boolean;
  detectedUserId: string | null;
} {
  const recordCounts = {
    users: data.users?.length ?? 0,
    accounts: data.accounts?.length ?? 0,
    categories: data.categories?.length ?? 0,
    transactions: data.transactions?.length ?? 0,
    budgets: data.budgets?.length ?? 0,
    goals: data.goals?.length ?? 0,
  };

  const totalRecords = Object.values(recordCounts).reduce((sum, count) => sum + count, 0);

  return {
    totalRecords,
    recordCounts,
    hasSettings: !!data.settings,
    detectedUserId: detectBackupUserId(data),
  };
}
