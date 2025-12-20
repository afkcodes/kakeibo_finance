/**
 * @fileoverview Financial calculation utilities
 * @module @kakeibo/core/utils
 *
 * Provides primitive calculation functions for budgets, goals, savings rates, and financial metrics.
 * For entity-based calculations with full Business Logic, use the calculation services instead.
 *
 * Platform: Platform-agnostic (core)
 */

/**
 * Calculate budget progress percentage
 *
 * @param spent - Amount spent
 * @param budgetAmount - Total budget amount
 * @returns Percentage (0-100+)
 *
 * @example
 * ```ts
 * calculateBudgetPercentage(750, 1000); // 75
 * calculateBudgetPercentage(1200, 1000); // 120 (over budget)
 * ```
 */
export function calculateBudgetPercentage(spent: number, budgetAmount: number): number {
  if (budgetAmount <= 0) return 0;
  return (spent / budgetAmount) * 100;
}

/**
 * Calculate remaining budget amount
 *
 * @param spent - Amount spent
 * @param budgetAmount - Total budget amount
 * @returns Remaining amount (negative if over budget)
 */
export function calculateBudgetRemaining(spent: number, budgetAmount: number): number {
  return budgetAmount - spent;
}

/**
 * Calculate daily average spending in a period
 *
 * @param spent - Total amount spent
 * @param daysElapsed - Number of days in period
 * @returns Daily average
 *
 * @example
 * ```ts
 * calculateDailyAverage(750, 15); // 50
 * ```
 */
export function calculateDailyAverage(spent: number, daysElapsed: number): number {
  if (daysElapsed <= 0) return 0;
  return spent / daysElapsed;
}

/**
 * Check if budget is at risk of overspending
 *
 * @param spent - Amount spent
 * @param budgetAmount - Total budget
 * @param daysElapsed - Days elapsed
 * @param totalDays - Total days in period
 * @returns True if projected to exceed budget
 */
export function isBudgetAtRisk(
  spent: number,
  budgetAmount: number,
  daysElapsed: number,
  totalDays: number
): boolean {
  if (daysElapsed <= 0 || totalDays <= 0) return false;
  const dailyAvg = calculateDailyAverage(spent, daysElapsed);
  const projected = dailyAvg * totalDays;
  return projected > budgetAmount;
}

/**
 * Calculate remaining amount to reach goal
 *
 * @param current - Current amount
 * @param target - Target amount
 * @returns Remaining amount (0 if goal reached)
 */
export function calculateGoalRemaining(current: number, target: number): number {
  return Math.max(0, target - current);
}

/**
 * Check if goal is on track
 *
 * Compares actual progress to expected progress based on timeline.
 *
 * @param current - Current amount
 * @param target - Target amount
 * @param startDate - Goal start date
 * @param deadline - Goal deadline
 * @param referenceDate - Reference date (defaults to now)
 * @returns True if on track or ahead
 */
export function isGoalOnTrack(
  current: number,
  target: number,
  startDate: Date,
  deadline: Date,
  referenceDate: Date = new Date()
): boolean {
  const totalDuration = deadline.getTime() - startDate.getTime();
  if (totalDuration <= 0) return current >= target;

  const elapsed = referenceDate.getTime() - startDate.getTime();
  const expectedProgress = (elapsed / totalDuration) * target;

  return current >= expectedProgress;
}

/**
 * Calculate savings rate
 *
 * @param saved - Amount saved
 * @param income - Total income
 * @returns Savings rate percentage (0-100)
 *
 * @example
 * ```ts
 * calculateSavingsRate(1500, 5000); // 30
 * ```
 */
export function calculateSavingsRate(saved: number, income: number): number {
  if (income <= 0) return 0;
  return (saved / income) * 100;
}

/**
 * Calculate net worth
 *
 * @param assets - Total assets (account balances)
 * @param liabilities - Total liabilities (debts)
 * @returns Net worth
 */
export function calculateNetWorth(assets: number, liabilities: number): number {
  return assets - liabilities;
}

/**
 * Calculate percentage change
 *
 * @param oldValue - Previous value
 * @param newValue - Current value
 * @returns Percentage change
 *
 * @example
 * ```ts
 * calculatePercentageChange(1000, 1200); // 20 (20% increase)
 * calculatePercentageChange(1000, 800); // -20 (20% decrease)
 * ```
 */
export function calculatePercentageChange(oldValue: number, newValue: number): number {
  if (oldValue === 0) return newValue === 0 ? 0 : 100;
  return ((newValue - oldValue) / Math.abs(oldValue)) * 100;
}

/**
 * Round to specified decimal places
 *
 * @param num - Number to round
 * @param decimals - Number of decimal places
 * @returns Rounded number
 */
export function roundTo(num: number, decimals = 2): number {
  const factor = 10 ** decimals;
  return Math.round(num * factor) / factor;
}
