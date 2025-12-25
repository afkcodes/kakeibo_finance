/**
 * @fileoverview Complex database operations
 * @module @kakeibo/core/services/database
 *
 * Provides higher-level database operations that use the IDatabaseAdapter interface.
 * These operations handle complex business logic that involves multiple tables
 * or calculations.
 *
 * Platform: Platform-agnostic (core)
 *
 * NOTE: Balance update functions removed with pure calculated balance implementation.
 * Balance is now calculated as: balance = initialBalance + sum(transactions)
 * See @kakeibo/core/services/calculations/accountBalance for balance calculations.
 */

import type { IDatabaseAdapter } from './IDatabaseAdapter';
import type { TransactionFilters } from './types';

/**
 * Calculate and update budget spent amounts
 *
 * Recalculates the spent amount for all budgets based on actual transactions.
 *
 * @param adapter - Database adapter
 * @param userId - User ID
 * @param startDate - Optional start date for filtering
 * @param endDate - Optional end date for filtering
 */
export async function recalculateBudgetSpent(
  adapter: IDatabaseAdapter,
  userId: string,
  startDate?: Date,
  endDate?: Date
): Promise<void> {
  const budgets = await adapter.getBudgets(userId, { isActive: true });

  for (const budget of budgets) {
    let totalSpent = 0;

    // Get transactions for each category in the budget
    for (const categoryId of budget.categoryIds) {
      const filters: TransactionFilters = {
        type: 'expense',
        categoryId,
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString(),
      };

      const transactions = await adapter.getTransactions(userId, filters);
      totalSpent += transactions.reduce((sum, t) => sum + t.amount, 0);
    }

    await adapter.updateBudgetSpent(budget.id, totalSpent);
  }
}

/**
 * Migrate categories for a user
 *
 * Useful when merging users or normalizing category data.
 *
 * @param adapter - Database adapter
 * @param userId - User ID
 * @param categoryMapping - Map of old category ID to new category ID
 */
export async function migrateCategories(
  adapter: IDatabaseAdapter,
  userId: string,
  categoryMapping: Record<string, string>
): Promise<void> {
  // Get all transactions for the user
  const transactions = await adapter.getTransactions(userId);

  // Update category IDs in transactions
  for (const transaction of transactions) {
    if (transaction.categoryId && categoryMapping[transaction.categoryId]) {
      await adapter.updateTransaction(transaction.id, {
        categoryId: categoryMapping[transaction.categoryId],
      });
    }
  }

  // Get all budgets for the user
  const budgets = await adapter.getBudgets(userId);

  // Update category IDs in budgets
  for (const budget of budgets) {
    const newCategoryIds = budget.categoryIds
      .map((id) => categoryMapping[id] ?? id)
      .filter((id, index, arr) => arr.indexOf(id) === index); // Remove duplicates

    if (JSON.stringify(newCategoryIds) !== JSON.stringify(budget.categoryIds)) {
      await adapter.updateBudget(budget.id, { categoryIds: newCategoryIds });
    }
  }
}

/**
 * Get spending statistics by category
 *
 * @param adapter - Database adapter
 * @param userId - User ID
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Map of category ID to total spent
 */
export async function getSpendingByCategory(
  adapter: IDatabaseAdapter,
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<Map<string, number>> {
  const filters: TransactionFilters = {
    type: 'expense',
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
  };

  const transactions = await adapter.getTransactions(userId, filters);
  const spendingMap = new Map<string, number>();

  for (const transaction of transactions) {
    if (transaction.categoryId) {
      const current = spendingMap.get(transaction.categoryId) ?? 0;
      spendingMap.set(transaction.categoryId, current + transaction.amount);
    }
  }

  return spendingMap;
}

/**
 * Get monthly income and expense totals
 *
 * @param adapter - Database adapter
 * @param userId - User ID
 * @param startDate - Month start date
 * @param endDate - Month end date
 * @returns Monthly totals
 */
export async function getMonthlyTotals(
  adapter: IDatabaseAdapter,
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<{
  income: number;
  expenses: number;
  savings: number;
  savingsRate: number;
}> {
  const incomeTransactions = await adapter.getTransactions(userId, {
    type: 'income',
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
  });

  const expenseTransactions = await adapter.getTransactions(userId, {
    type: 'expense',
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
  });

  const income = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
  const expenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
  const savings = income - expenses;
  const savingsRate = income > 0 ? (savings / income) * 100 : 0;

  return { income, expenses, savings, savingsRate };
}

/**
 * Archive old transactions
 *
 * Useful for performance optimization in apps with many transactions.
 *
 * @param adapter - Database adapter
 * @param userId - User ID
 * @param beforeDate - Archive transactions before this date
 * @returns Number of transactions archived
 */
export async function archiveOldTransactions(
  adapter: IDatabaseAdapter,
  userId: string,
  beforeDate: Date
): Promise<number> {
  const transactions = await adapter.getTransactions(userId, {
    endDate: beforeDate.toISOString(),
  });

  // In a real implementation, you might move these to an archive table
  // For now, we just return the count
  return transactions.length;
}
