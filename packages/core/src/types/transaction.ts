/**
 * @fileoverview Transaction type definitions and utilities
 * @module @kakeibo/core/types
 *
 * Defines the Transaction entity - the core building block of the app.
 * Transactions represent all financial movements: expenses, income, transfers,
 * and goal-related transactions.
 *
 * Platform: Platform-agnostic (core)
 */

/**
 * Types of transactions supported
 *
 * - expense: Money spent
 * - income: Money received
 * - transfer: Money moved between accounts
 * - goal-contribution: Money saved towards a goal (deducts from account)
 * - goal-withdrawal: Money withdrawn from a goal (adds to account)
 * - balance-adjustment: Manual correction for discrepancies (reconciliation)
 */
export type TransactionType =
  | 'expense'
  | 'income'
  | 'transfer'
  | 'goal-contribution'
  | 'goal-withdrawal'
  | 'balance-adjustment';

/**
 * Geographic location data for a transaction
 * Optional - can be used for location-based analytics
 */
export interface Location {
  /** Latitude coordinate */
  latitude: number;

  /** Longitude coordinate */
  longitude: number;

  /** Human-readable address (optional) */
  address?: string;
}

/**
 * Transaction entity representing a financial movement
 *
 * Transactions are the primary data model. They track all money movements
 * across accounts, categories, and goals.
 */
export interface Transaction {
  /** Unique identifier */
  id: string;

  /** Owner user ID */
  userId: string;

  /** Source account ID */
  accountId: string;

  /** Transaction amount (always positive, sign determined by type) */
  amount: number;

  /** Type of transaction */
  type: TransactionType;

  /** Category ID for classification */
  categoryId: string;

  /** Optional subcategory for detailed tracking */
  subcategoryId?: string;

  /** User-provided description/note */
  description: string;

  /** Transaction date */
  date: Date;

  /** Optional tags for flexible categorization */
  tags: string[];

  /** Optional location data */
  location?: Location;

  /** Optional receipt/attachment reference */
  receipt?: string;

  /** Whether this is a recurring transaction */
  isRecurring: boolean;

  /** Recurring group ID (if isRecurring is true) */
  recurringId?: string;

  /** Destination account ID (for transfers only) */
  toAccountId?: string;

  /** Goal ID (for goal-contribution/goal-withdrawal only) */
  goalId?: string;

  /** Essential expense flag (for needs vs wants tracking) */
  isEssential?: boolean;

  /** Sync status (for future cloud sync feature) */
  synced: boolean;

  /** Creation timestamp */
  createdAt: Date;

  /** Last update timestamp */
  updatedAt: Date;
}
