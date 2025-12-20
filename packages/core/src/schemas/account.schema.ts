/**
 * @fileoverview Account validation schemas
 * @module @kakeibo/core/schemas
 *
 * Zod schemas for validating account creation and updates.
 * Supports bank, credit, cash, investment, and wallet account types.
 *
 * Platform: Platform-agnostic (core)
 */

import { z } from 'zod';

/**
 * Schema for creating a new account
 *
 * Validates all required fields for different account types.
 */
export const createAccountSchema = z.object({
  /** Account name */
  name: z.string().min(1, 'Name is required'),

  /** Account type */
  type: z.enum(['bank', 'credit', 'cash', 'investment', 'wallet']),

  /** Initial balance */
  balance: z.number(),

  /** Currency code (ISO 4217) */
  currency: z.string().min(3).max(3),

  /** Account color (hex) */
  color: z.string(),

  /** Account icon name */
  icon: z.string(),

  /** Account notes (optional) */
  notes: z.string().optional(),

  /** Whether account is excluded from net worth calculations (optional) */
  excludeFromTotal: z.boolean().optional(),

  /** Whether account is archived (optional) */
  isArchived: z.boolean().optional(),
});

/**
 * Inferred TypeScript type from create schema
 */
export type CreateAccountInput = z.infer<typeof createAccountSchema>;

/**
 * Schema for updating an existing account
 * All fields are optional except balance updates
 */
export const updateAccountSchema = createAccountSchema.partial();

/**
 * Inferred TypeScript type from update schema
 */
export type UpdateAccountInput = z.infer<typeof updateAccountSchema>;

/**
 * Schema for account filters/queries
 */
export const accountFiltersSchema = z.object({
  /** Filter by account type */
  type: z.enum(['bank', 'credit', 'cash', 'investment', 'wallet']).optional(),

  /** Filter by archived status */
  isArchived: z.boolean().optional(),

  /** Search in account name */
  search: z.string().optional(),
});

/**
 * Inferred TypeScript type from filters schema
 */
export type AccountFilters = z.infer<typeof accountFiltersSchema>;
