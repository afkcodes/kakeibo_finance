/**
 * @fileoverview Financial calculation utilities
 * @module @kakeibo/core/utils
 *
 * Provides calculation functions for budgets, goals, savings rates, and financial metrics.
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
 * Calculate projected spending for a period
 *
 * Based on daily average spending rate.
 *
 * @param spent - Amount spent so far
 * @param daysElapsed - Days elapsed
 * @param totalDays - Total days in period
 * @returns Projected total spending
 *
 * @example
 * ```ts
 * // Spent $750 in 15 days of a 30-day month
 * calculateProjectedSpending(750, 15, 30); // 1500
 * ```
 */
export function calculateProjectedSpending(
  spent: number,
  daysElapsed: number,
  totalDays: number
): number {
  if (daysElapsed <= 0 || totalDays <= 0) return spent;
  const dailyAvg = calculateDailyAverage(spent, daysElapsed);
  return dailyAvg * totalDays;
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
  const projected = calculateProjectedSpending(spent, daysElapsed, totalDays);
  return projected > budgetAmount;
}

/**
 * Calculate goal progress percentage
 *
 * @param current - Current amount saved/paid
 * @param target - Target amount
 * @returns Percentage (0-100)
 *
 * @example
 * ```ts
 * calculateGoalProgress(7500, 10000); // 75
 * calculateGoalProgress(12000, 10000); // 100 (capped)
 * ```
 */
export function calculateGoalProgress(current: number, target: number): number {
  if (target <= 0) return 0;
  const percentage = (current / target) * 100;
  return Math.min(100, Math.max(0, percentage));
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
 * Calculate required monthly contribution to reach goal
 *
 * @param current - Current amount
 * @param target - Target amount
 * @param deadline - Goal deadline
 * @param referenceDate - Reference date (defaults to now)
 * @returns Required monthly contribution
 *
 * @example
 * ```ts
 * // Need $10,000, have $2,000, 10 months until deadline
 * const deadline = new Date(Date.now() + 10 * 30 * 24 * 60 * 60 * 1000);
 * calculateRequiredMonthlyContribution(2000, 10000, deadline); // ~800
 * ```
 */
export function calculateRequiredMonthlyContribution(
  current: number,
  target: number,
  deadline: Date,
  referenceDate: Date = new Date()
): number {
  const remaining = calculateGoalRemaining(current, target);
  if (remaining <= 0) return 0;

  const diffMs = deadline.getTime() - referenceDate.getTime();
  const monthsRemaining = Math.max(1, diffMs / (1000 * 60 * 60 * 24 * 30));

  return remaining / monthsRemaining;
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
export function roundTo(num: number, decimals: number = 2): number {
  const factor = 10 ** decimals;
  return Math.round(num * factor) / factor;
}
