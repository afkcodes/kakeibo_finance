/**
 * @fileoverview Transaction validation schemas
 * @module @kakeibo/core/schemas
 *
 * Zod schemas for validating transaction creation, updates, and filters.
 * Used for form validation on both web and native platforms.
 *
 * Platform: Platform-agnostic (core)
 */

import { z } from 'zod';

/**
 * Schema for creating a new transaction
 *
 * Validates all required fields for expense, income, and transfer transactions.
 * Includes conditional validation:
 * - Expense/Income: requires categoryId
 * - Transfer: requires toAccountId
 */
export const createTransactionSchema = z
  .object({
    /** Transaction type */
    type: z.enum(['expense', 'income', 'transfer', 'goal-contribution', 'goal-withdrawal']),

    /** Amount (string for form input, will be parsed to number) */
    amount: z.string().min(1, 'Amount is required'),

    /** Transaction description */
    description: z.string().min(1, 'Description is required'),

    /** Source account ID */
    accountId: z.string().min(1, 'Account is required'),

    /** Transaction date (ISO string format) */
    date: z.string().min(1, 'Date is required'),

    /** Category ID (required for expense/income) */
    categoryId: z.string().optional(),

    /** Subcategory ID (optional) */
    subcategoryId: z.string().optional(),

    /** Destination account ID (required for transfers) */
    toAccountId: z.string().optional(),

    /** Goal ID (required for goal transactions) */
    goalId: z.string().optional(),

    /** Whether this is an essential expense */
    isEssential: z.boolean().optional(),

    /** Location information (auto-captured) */
    location: z
      .object({
        latitude: z.number(),
        longitude: z.number(),
        address: z.string().optional(),
      })
      .optional(),

    /** Recurring transaction configuration */
    recurring: z
      .object({
        frequency: z.enum(['daily', 'weekly', 'monthly', 'yearly']),
        interval: z.number().positive(),
        endDate: z.string().optional(),
      })
      .optional(),
  })
  .refine(
    (data) => {
      // Expense and income require categoryId
      if (data.type === 'expense' || data.type === 'income') {
        return data.categoryId && data.categoryId.length > 0;
      }
      return true;
    },
    {
      message: 'Category is required for expense and income transactions',
      path: ['categoryId'],
    }
  )
  .refine(
    (data) => {
      // Transfer requires toAccountId
      if (data.type === 'transfer') {
        return data.toAccountId && data.toAccountId.length > 0;
      }
      return true;
    },
    {
      message: 'Destination account is required for transfers',
      path: ['toAccountId'],
    }
  )
  .refine(
    (data) => {
      // Goal transactions require goalId
      if (data.type === 'goal-contribution' || data.type === 'goal-withdrawal') {
        return data.goalId && data.goalId.length > 0;
      }
      return true;
    },
    {
      message: 'Goal is required for goal transactions',
      path: ['goalId'],
    }
  );

/**
 * Inferred TypeScript type from create schema
 */
export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;

/**
 * Schema for updating an existing transaction
 * All fields are optional
 */
export const updateTransactionSchema = createTransactionSchema.partial();

/**
 * Inferred TypeScript type from update schema
 */
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;

/**
 * Schema for filtering transactions
 *
 * Used for search, filtering, and reporting queries.
 */
export const transactionFiltersSchema = z.object({
  /** Filter by transaction type */
  type: z
    .enum(['expense', 'income', 'transfer', 'goal-contribution', 'goal-withdrawal'])
    .optional(),

  /** Filter by account ID */
  accountId: z.string().optional(),

  /** Filter by category ID */
  categoryId: z.string().optional(),

  /** Filter by subcategory ID */
  subcategoryId: z.string().optional(),

  /** Filter by goal ID */
  goalId: z.string().optional(),

  /** Filter by essential flag */
  isEssential: z.boolean().optional(),

  /** Date range: start date (ISO string) */
  startDate: z.string().optional(),

  /** Date range: end date (ISO string) */
  endDate: z.string().optional(),

  /** Minimum amount */
  minAmount: z.number().optional(),

  /** Maximum amount */
  maxAmount: z.number().optional(),

  /** Search in description */
  search: z.string().optional(),

  /** Sort field */
  sortBy: z.enum(['date', 'amount', 'description', 'category']).optional(),

  /** Sort direction */
  sortDirection: z.enum(['asc', 'desc']).optional(),

  /** Pagination: limit */
  limit: z.number().positive().optional(),

  /** Pagination: offset */
  offset: z.number().min(0).optional(),
});

/**
 * Inferred TypeScript type from filters schema
 */
export type TransactionFilters = z.infer<typeof transactionFiltersSchema>;

/**
 * Schema for transaction statistics query parameters
 */
export const transactionStatsSchema = z.object({
  /** Start date for stats period (ISO string) */
  startDate: z.string(),

  /** End date for stats period (ISO string) */
  endDate: z.string(),

  /** Group by field */
  groupBy: z.enum(['category', 'account', 'day', 'week', 'month', 'year']).optional(),

  /** Filter by transaction type */
  type: z.enum(['expense', 'income']).optional(),
});

/**
 * Inferred TypeScript type from stats schema
 */
export type TransactionStatsQuery = z.infer<typeof transactionStatsSchema>;
