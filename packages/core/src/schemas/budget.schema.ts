/**
 * @fileoverview Budget validation schemas
 * @module @kakeibo/core/schemas
 *
 * Zod schemas for validating budget creation and updates.
 * Supports multi-category budgets with configurable periods and rollover.
 *
 * Platform: Platform-agnostic (core)
 */

import { z } from 'zod';

/**
 * Schema for creating a new budget
 *
 * Validates all required fields for budget setup including
 * multi-category support, period configuration, and alert thresholds.
 */
export const createBudgetSchema = z
  .object({
    /** Budget name (user-defined) */
    name: z.string().min(1, 'Budget name is required'),

    /** Category IDs (must select at least one) */
    categoryIds: z.array(z.string()).min(1, 'Select at least one category'),

    /** Budget amount */
    amount: z.number().positive('Amount must be greater than 0'),

    /** Budget period */
    period: z.enum(['weekly', 'monthly', 'yearly']),

    /** Start date (ISO string) */
    startDate: z.string().optional(),

    /** End date (ISO string, optional) */
    endDate: z.string().optional(),

    /** Whether to roll over unused amounts to next period */
    rollover: z.boolean().optional(),

    /** Whether budget is active */
    isActive: z.boolean().optional(),

    /** Alert thresholds (percentages: e.g., [50, 80, 100]) */
    alertThresholds: z.array(z.number().min(0).max(100)).optional(),
  })
  .refine(
    (data) => {
      // If endDate is provided, it must be after startDate
      if (data.startDate && data.endDate) {
        return new Date(data.endDate) > new Date(data.startDate);
      }
      return true;
    },
    {
      message: 'End date must be after start date',
      path: ['endDate'],
    }
  );

/**
 * Inferred TypeScript type from create schema
 */
export type CreateBudgetInput = z.infer<typeof createBudgetSchema>;

/**
 * Schema for updating an existing budget
 * All fields are optional
 */
export const updateBudgetSchema = createBudgetSchema.partial();

/**
 * Inferred TypeScript type from update schema
 */
export type UpdateBudgetInput = z.infer<typeof updateBudgetSchema>;

/**
 * Schema for budget filters/queries
 */
export const budgetFiltersSchema = z.object({
  /** Filter by active status */
  isActive: z.boolean().optional(),

  /** Filter by period */
  period: z.enum(['weekly', 'monthly', 'yearly']).optional(),

  /** Filter by category ID (budgets containing this category) */
  categoryId: z.string().optional(),

  /** Search in budget name */
  search: z.string().optional(),

  /** Sort field */
  sortBy: z.enum(['name', 'amount', 'spent', 'startDate']).optional(),

  /** Sort direction */
  sortDirection: z.enum(['asc', 'desc']).optional(),
});

/**
 * Inferred TypeScript type from filters schema
 */
export type BudgetFilters = z.infer<typeof budgetFiltersSchema>;
