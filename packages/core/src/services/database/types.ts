/**
 * @fileoverview Database types and interfaces
 * @module @kakeibo/core/services/database
 *
 * Defines platform-agnostic types for database queries, filters, and data export.
 * These types are used by the IDatabaseAdapter interface.
 *
 * Platform: Platform-agnostic (core)
 */

import type { Account } from '../../types/account';
import type { Budget } from '../../types/budget';
import type { Category } from '../../types/category';
import type { Goal } from '../../types/goal';
import type { Transaction } from '../../types/transaction';
import type { User, UserSettings } from '../../types/user';

// Re-export filter types from schemas (defined via Zod)
export type {
  AccountFilters,
  BudgetFilters,
  CategoryFilters,
  GoalFilters,
  TransactionFilters,
} from '../../schemas';

/**
 * Generic query options for pagination and sorting
 */
export interface QueryOptions {
  /** Number of items to return */
  limit?: number;

  /** Number of items to skip */
  offset?: number;

  /** Field to sort by */
  sortBy?: string;

  /** Sort direction */
  sortOrder?: 'asc' | 'desc';
}

/**
 * Exported database data structure
 */
export interface ExportData {
  /** User records */
  users?: User[];

  /** Account records */
  accounts?: Account[];

  /** Category records */
  categories?: Category[];

  /** Transaction records */
  transactions?: Transaction[];

  /** Budget records */
  budgets?: Budget[];

  /** Goal records */
  goals?: Goal[];

  /** User settings */
  settings?: UserSettings;

  /** Export timestamp */
  exportedAt?: string;

  /** App version */
  version?: string;
}

/**
 * Backup metadata
 */
export interface BackupMetadata {
  /** Backup creation timestamp */
  createdAt: Date;

  /** User ID who created the backup */
  userId: string;

  /** Number of records in backup */
  recordCount: {
    users: number;
    accounts: number;
    categories: number;
    transactions: number;
    budgets: number;
    goals: number;
  };

  /** App version */
  appVersion?: string;
}
