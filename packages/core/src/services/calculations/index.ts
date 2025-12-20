/**
 * @fileoverview Calculation services exports
 * @module @kakeibo/core/services/calculations
 *
 * Pure functions for financial calculations used across platforms.
 *
 * Platform: Platform-agnostic (core)
 */

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
