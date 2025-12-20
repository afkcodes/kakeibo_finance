/**
 * @fileoverview Budget progress calculation services
 * @module @kakeibo/core/services/calculations
 *
 * Pure functions for calculating budget progress, alerts, and projections.
 * These functions are platform-agnostic and can be used on both web and native.
 *
 * Platform: Platform-agnostic (core)
 */

import type { Budget, BudgetProgress } from '../../types/budget';
import type { Transaction } from '../../types/transaction';

/**
 * Calculate which alert thresholds have been exceeded
 *
 * @param percentage - Current spending percentage (0-100+)
 * @param thresholds - Alert thresholds to check (e.g., [50, 80, 100])
 * @returns Array of exceeded thresholds, sorted descending
 *
 * @example
 * ```ts
 * calculateActiveAlerts(85, [50, 80, 100])
 * // Returns: [80, 50]
 * ```
 */
export function calculateActiveAlerts(percentage: number, thresholds: number[]): number[] {
  return thresholds.filter((threshold) => percentage >= threshold).sort((a, b) => b - a);
}

/**
 * Calculate projected spending based on daily average
 *
 * @param dailyAverage - Average spending per day so far
 * @param totalDays - Total days in the budget period
 * @returns Projected total spending for the entire period
 *
 * @example
 * ```ts
 * calculateProjectedSpending(50, 30)
 * // Returns: 1500 (50 * 30)
 * ```
 */
export function calculateProjectedSpending(dailyAverage: number, totalDays: number): number {
  return dailyAverage * totalDays;
}

/**
 * Calculate budget progress with all metrics
 *
 * Calculates:
 * - Spending percentage
 * - Remaining amount
 * - Days remaining
 * - Daily budget
 * - Daily average spending
 * - Projected spending
 * - Active alerts
 * - Over budget/warning status
 *
 * @param budget - The budget to calculate progress for
 * @param transactions - Transactions to calculate spending from
 * @param periodStart - Start date of the budget period
 * @param periodEnd - End date of the budget period
 * @param now - Current date (defaults to new Date())
 * @returns Complete budget progress object
 *
 * @example
 * ```ts
 * const progress = calculateBudgetProgress(
 *   budget,
 *   transactions,
 *   new Date('2024-01-01'),
 *   new Date('2024-01-31'),
 * );
 * console.log(progress.percentage); // 75
 * console.log(progress.isOverBudget); // false
 * console.log(progress.activeAlerts); // [50]
 * ```
 */
export function calculateBudgetProgress(
  budget: Budget,
  transactions: Transaction[],
  periodStart: Date,
  periodEnd: Date,
  now: Date = new Date()
): BudgetProgress {
  // Normalize categoryIds for backward compatibility
  let categoryIds: string[] = [];
  if (Array.isArray(budget.categoryIds) && budget.categoryIds.length > 0) {
    categoryIds = budget.categoryIds;
  } else {
    // Old format: single categoryId
    // biome-ignore lint/suspicious/noExplicitAny: backward compatibility with legacy data
    const oldCategoryId = (budget as any).categoryId as string | undefined;
    if (oldCategoryId) {
      categoryIds = [oldCategoryId];
    }
  }

  // Filter transactions that match the budget criteria
  const relevantTransactions = transactions.filter((t) => {
    const tDate = new Date(t.date);
    const inPeriod = t.type === 'expense' && tDate >= periodStart && tDate <= periodEnd;

    if (!inPeriod) return false;

    // Check if transaction's category is in the budget's categoryIds
    return categoryIds.includes(t.categoryId);
  });

  // Calculate spending
  const spent = relevantTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const remaining = budget.amount - spent;
  const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;

  // Time calculations
  const totalDays = Math.max(
    1,
    Math.ceil((periodEnd.getTime() - periodStart.getTime()) / (1000 * 60 * 60 * 24))
  );
  const daysRemaining = Math.max(
    0,
    Math.ceil((periodEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  );
  const daysPassed = Math.max(1, totalDays - daysRemaining);

  // Spending projections
  const dailyBudget = daysRemaining > 0 ? remaining / daysRemaining : 0;
  const dailyAverage = spent / daysPassed;
  const projectedSpending = calculateProjectedSpending(dailyAverage, totalDays);
  const projectedRemaining = budget.amount - projectedSpending;

  // Alert calculations
  const alertThresholds = budget.alerts?.thresholds ?? [50, 80, 100];
  const activeAlerts =
    budget.alerts?.enabled !== false ? calculateActiveAlerts(percentage, alertThresholds) : [];
  const isWarning = activeAlerts.length > 0 && !activeAlerts.includes(100);

  return {
    budget,
    spent,
    remaining,
    percentage,
    isOverBudget: spent > budget.amount,
    isWarning,
    activeAlerts,
    daysRemaining,
    totalDays,
    dailyBudget,
    dailyAverage,
    projectedSpending,
    projectedRemaining,
  };
}
