/**
 * @fileoverview Goal validation schemas
 * @module @kakeibo/core/schemas
 *
 * Zod schemas for validating goal creation, updates, and contributions.
 * Supports both savings and debt payoff goals.
 *
 * Platform: Platform-agnostic (core)
 */

import { z } from 'zod';

/**
 * Schema for creating a new goal
 *
 * Validates all required fields for savings and debt goals.
 */
export const createGoalSchema = z
  .object({
    /** Goal name */
    name: z.string().min(1, 'Name is required'),

    /** Goal type */
    type: z.enum(['savings', 'debt']),

    /** Target amount to save/pay off */
    targetAmount: z.number().positive('Target amount must be greater than 0'),

    /** Current amount saved/paid */
    currentAmount: z.number().min(0).optional(),

    /** Goal deadline (ISO string) */
    deadline: z.string().optional(),

    /** Linked account ID (where funds are stored) */
    accountId: z.string().optional(),

    /** Goal color (hex) */
    color: z.string().optional(),

    /** Goal notes */
    notes: z.string().optional(),

    /** Whether goal is archived/completed */
    isArchived: z.boolean().optional(),
  })
  .refine(
    (data) => {
      // Current amount cannot exceed target amount
      if (data.currentAmount && data.currentAmount > data.targetAmount) {
        return false;
      }
      return true;
    },
    {
      message: 'Current amount cannot exceed target amount',
      path: ['currentAmount'],
    }
  );

/**
 * Inferred TypeScript type from create schema
 */
export type CreateGoalInput = z.infer<typeof createGoalSchema>;

/**
 * Schema for updating an existing goal
 * All fields are optional
 */
export const updateGoalSchema = createGoalSchema.partial();

/**
 * Inferred TypeScript type from update schema
 */
export type UpdateGoalInput = z.infer<typeof updateGoalSchema>;

/**
 * Schema for goal contribution/withdrawal
 */
export const goalTransactionSchema = z.object({
  /** Goal ID */
  goalId: z.string().min(1, 'Goal is required'),

  /** Amount to contribute or withdraw */
  amount: z.number().positive('Amount must be greater than 0'),

  /** Source/destination account ID */
  accountId: z.string().min(1, 'Account is required'),

  /** Transaction description */
  description: z.string().optional(),

  /** Transaction date (ISO string) */
  date: z.string().optional(),
});

/**
 * Inferred TypeScript type from goal transaction schema
 */
export type GoalTransactionInput = z.infer<typeof goalTransactionSchema>;

/**
 * Schema for goal filters/queries
 */
export const goalFiltersSchema = z.object({
  /** Filter by goal type */
  type: z.enum(['savings', 'debt']).optional(),

  /** Filter by archived status */
  isArchived: z.boolean().optional(),

  /** Filter by completion status */
  isCompleted: z.boolean().optional(),

  /** Filter by account ID */
  accountId: z.string().optional(),

  /** Search in goal name */
  search: z.string().optional(),

  /** Sort field */
  sortBy: z.enum(['name', 'targetAmount', 'currentAmount', 'deadline', 'progress']).optional(),

  /** Sort direction */
  sortDirection: z.enum(['asc', 'desc']).optional(),
});

/**
 * Inferred TypeScript type from filters schema
 */
export type GoalFilters = z.infer<typeof goalFiltersSchema>;
