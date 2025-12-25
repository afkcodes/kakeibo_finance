/**
 * @fileoverview Centralized hook exports
 * @module @kakeibo/native/hooks
 *
 * Single entry point for all hooks.
 * Makes imports cleaner and more maintainable.
 */

// Store hooks
export { useAppStore, useCurrentUser, useModals, useSettings } from '../store/appStore';

// Auth
export { useAuth } from './useAuth';

// Transactions
export { useTransactionActions } from './useTransactionActions';
export { useTransaction, useTransactions } from './useTransactions';

// Accounts
export { useAccount, useAccountActions, useAccounts } from './useAccounts';

// Budgets
export { useBudget, useBudgetActions, useBudgets } from './useBudgets';

// Goals
export { useGoal, useGoalActions, useGoals } from './useGoals';

// Categories
export { useCategories, useCategory, useCategoryActions } from './useCategories';

// Utilities
export { useCurrency } from './useCurrency';
