/**
 * @fileoverview Custom validators and business rule validators
 * @module @kakeibo/core/utils
 *
 * Provides reusable Zod validators and business logic validators
 * for common validation patterns across the application.
 *
 * Platform: Platform-agnostic (core)
 */

import { z } from 'zod';

/**
 * Validates that a string can be parsed as a positive number
 *
 * @example
 * ```ts
 * const schema = z.object({
 *   amount: positiveNumberString()
 * });
 * ```
 */
export const positiveNumberString = () =>
  z
    .string()
    .min(1, 'Value is required')
    .refine((val) => !Number.isNaN(Number(val)), {
      message: 'Must be a valid number',
    })
    .refine((val) => Number(val) > 0, {
      message: 'Must be greater than 0',
    });

/**
 * Validates that a string can be parsed as a non-negative number (including zero)
 *
 * @example
 * ```ts
 * const schema = z.object({
 *   currentAmount: nonNegativeNumberString()
 * });
 * ```
 */
export const nonNegativeNumberString = () =>
  z
    .string()
    .min(1, 'Value is required')
    .refine((val) => !Number.isNaN(Number(val)), {
      message: 'Must be a valid number',
    })
    .refine((val) => Number(val) >= 0, {
      message: 'Must be 0 or greater',
    });

/**
 * Validates an ISO date string
 *
 * @example
 * ```ts
 * const schema = z.object({
 *   date: isoDateString()
 * });
 * ```
 */
export const isoDateString = () =>
  z
    .string()
    .min(1, 'Date is required')
    .refine(
      (val) => {
        const date = new Date(val);
        return !Number.isNaN(date.getTime());
      },
      {
        message: 'Must be a valid date',
      }
    );

/**
 * Validates a future date string
 *
 * @example
 * ```ts
 * const schema = z.object({
 *   deadline: futureDateString()
 * });
 * ```
 */
export const futureDateString = () =>
  z
    .string()
    .min(1, 'Date is required')
    .refine(
      (val) => {
        const date = new Date(val);
        return !Number.isNaN(date.getTime());
      },
      {
        message: 'Must be a valid date',
      }
    )
    .refine(
      (val) => {
        const date = new Date(val);
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        return date >= now;
      },
      {
        message: 'Date must be in the future',
      }
    );

/**
 * Validates a hex color code
 *
 * @example
 * ```ts
 * const schema = z.object({
 *   color: hexColor()
 * });
 * ```
 */
export const hexColor = () =>
  z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color (e.g., #FF5733)');

/**
 * Validates an email address
 *
 * @example
 * ```ts
 * const schema = z.object({
 *   email: emailAddress()
 * });
 * ```
 */
export const emailAddress = () =>
  z.string().min(1, 'Email is required').email('Must be a valid email address');

/**
 * Validates an array has at least one item
 *
 * @example
 * ```ts
 * const schema = z.object({
 *   categoryIds: nonEmptyArray(z.string(), 'At least one category is required')
 * });
 * ```
 */
export const nonEmptyArray = <T extends z.ZodTypeAny>(
  itemSchema: T,
  message = 'At least one item is required'
) => z.array(itemSchema).min(1, message);

/**
 * Business rule validators
 */

/**
 * Validates that target amount is greater than current amount for goals
 *
 * @param currentAmount - Current amount
 * @param targetAmount - Target amount
 * @returns True if valid
 */
export const validateGoalAmounts = (currentAmount: number, targetAmount: number): boolean => {
  return targetAmount > currentAmount;
};

/**
 * Validates that budget amount is positive
 *
 * @param amount - Budget amount
 * @returns True if valid
 */
export const validateBudgetAmount = (amount: number): boolean => {
  return amount > 0;
};

/**
 * Validates that a date is within a valid range for financial months
 *
 * @param date - Date to validate
 * @param startDay - Financial month start day (1-31)
 * @returns True if valid
 */
export const validateFinancialMonthDate = (date: Date, startDay: number): boolean => {
  if (startDay < 1 || startDay > 31) return false;
  return !Number.isNaN(date.getTime());
};

/**
 * Validates that transfer source and destination accounts are different
 *
 * @param fromAccountId - Source account ID
 * @param toAccountId - Destination account ID
 * @returns True if valid
 */
export const validateTransferAccounts = (fromAccountId: string, toAccountId: string): boolean => {
  return fromAccountId !== toAccountId;
};

/**
 * Validates that budget period is valid
 *
 * @param period - Budget period
 * @returns True if valid
 */
export const validateBudgetPeriod = (period: string): boolean => {
  return ['weekly', 'monthly', 'yearly'].includes(period);
};

/**
 * Validates that alert thresholds are in ascending order
 *
 * @param thresholds - Array of alert thresholds (percentages)
 * @returns True if valid
 */
export const validateAlertThresholds = (thresholds: number[]): boolean => {
  if (thresholds.length === 0) return true;

  for (let i = 0; i < thresholds.length - 1; i++) {
    if (thresholds[i] >= thresholds[i + 1]) return false;
    if (thresholds[i] < 0 || thresholds[i] > 100) return false;
  }

  const lastThreshold = thresholds[thresholds.length - 1];
  return lastThreshold > 0 && lastThreshold <= 100;
};

/**
 * Validates account balance based on account type
 *
 * @param balance - Account balance
 * @param accountType - Account type
 * @returns True if valid
 */
export const validateAccountBalance = (balance: number, accountType: string): boolean => {
  // Credit accounts can have negative balances
  if (accountType === 'credit') return true;

  // Other accounts should have non-negative balances
  return balance >= 0;
};

/**
 * Validates that a category is appropriate for transaction type
 *
 * @param categoryType - Category type (expense/income)
 * @param transactionType - Transaction type
 * @returns True if valid
 */
export const validateCategoryForTransactionType = (
  categoryType: string,
  transactionType: string
): boolean => {
  if (transactionType === 'expense') return categoryType === 'expense';
  if (transactionType === 'income') return categoryType === 'income';
  // Transfers don't require categories
  return true;
};

/**
 * Validates recurring transaction configuration
 *
 * @param frequency - Recurrence frequency
 * @param interval - Recurrence interval
 * @returns True if valid
 */
export const validateRecurringConfig = (frequency: string, interval: number): boolean => {
  const validFrequencies = ['daily', 'weekly', 'monthly', 'yearly'];
  return validFrequencies.includes(frequency) && interval > 0;
};
