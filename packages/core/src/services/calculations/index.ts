/**
 * @fileoverview Calculation services exports
 * @module @kakeibo/core/services/calculations
 *
 * Pure functions for financial calculations used across platforms.
 *
 * Platform: Platform-agnostic (core)
 */

// Account balance calculations
export {
  calculateAccountBalance,
  calculateAccountBalanceWithTransfers,
  validateBalance,
} from './accountBalance';

// Budget progress calculations
export {
  calculateActiveAlerts,
  calculateBudgetProgress,
  calculateProjectedSpending,
} from './budgetProgress';

// Goal progress calculations
export {
  calculateGoalProgress,
  calculateRequiredMonthlyContribution,
} from './goalProgress';
export type {
  AccountBalances,
  CategorySpending,
  MonthlyStats,
} from './statistics';
// Statistics calculations
export {
  calculateAccountBalances,
  calculateAverageTransaction,
  calculateMonthlyStats,
  calculateSpendingByCategory,
  calculateTransactionCounts,
} from './statistics';
