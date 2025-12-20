/**
 * @fileoverview Statistics calculation services
 * @module @kakeibo/core/services/calculations
 *
 * Pure functions for calculating financial statistics and aggregations.
 * These functions are platform-agnostic and can be used on both web and native.
 *
 * Platform: Platform-agnostic (core)
 */

import type { Account, Transaction } from '../../types';

/**
 * Monthly statistics result
 */
export interface MonthlyStats {
  /** Total income for the period */
  income: number;
  /** Total expenses for the period */
  expenses: number;
  /** Net savings (income - expenses) */
  savings: number;
  /** Savings rate percentage (0-100) */
  savingsRate: number;
  /** Number of transactions in period */
  transactionCount: number;
}

/**
 * Category spending data
 */
export interface CategorySpending {
  /** Category ID */
  categoryId: string;
  /** Category name */
  name: string;
  /** Total amount spent */
  amount: number;
  /** Number of transactions */
  count: number;
  /** Percentage of total spending */
  percentage: number;
}

/**
 * Account balance summary
 */
export interface AccountBalances {
  /** Total assets (positive balances) */
  totalAssets: number;
  /** Total liabilities (negative balances) */
  totalLiabilities: number;
  /** Net worth (assets - liabilities) */
  netWorth: number;
  /** Balances by account type */
  byType: Record<string, number>;
}

/**
 * Calculate monthly statistics from transactions
 *
 * @param transactions - All transactions in the period
 * @param periodStart - Start of period
 * @param periodEnd - End of period
 * @returns Monthly statistics
 *
 * @example
 * ```ts
 * const stats = calculateMonthlyStats(transactions, monthStart, monthEnd);
 * console.log(stats.income);      // 5000
 * console.log(stats.expenses);    // 3500
 * console.log(stats.savings);     // 1500
 * console.log(stats.savingsRate); // 30
 * ```
 */
export function calculateMonthlyStats(
  transactions: Transaction[],
  periodStart: Date,
  periodEnd: Date
): MonthlyStats {
  // Filter transactions within period
  const periodTransactions = transactions.filter((t) => {
    const tDate = new Date(t.date);
    return tDate >= periodStart && tDate <= periodEnd;
  });

  // Calculate income and expenses
  const income = periodTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const expenses = periodTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const savings = income - expenses;
  const savingsRate = income > 0 ? (savings / income) * 100 : 0;

  return {
    income,
    expenses,
    savings,
    savingsRate,
    transactionCount: periodTransactions.length,
  };
}

/**
 * Calculate spending by category
 *
 * Groups expense transactions by category and calculates totals.
 *
 * @param transactions - All transactions
 * @param periodStart - Start of period
 * @param periodEnd - End of period
 * @param categoryMap - Map of category IDs to names
 * @returns Array of category spending data, sorted by amount (descending)
 *
 * @example
 * ```ts
 * const categoryMap = { 'cat1': 'Food', 'cat2': 'Transport' };
 * const spending = calculateSpendingByCategory(
 *   transactions,
 *   monthStart,
 *   monthEnd,
 *   categoryMap
 * );
 * // Returns: [
 * //   { categoryId: 'cat1', name: 'Food', amount: 500, count: 15, percentage: 60 },
 * //   { categoryId: 'cat2', name: 'Transport', amount: 333, count: 8, percentage: 40 }
 * // ]
 * ```
 */
export function calculateSpendingByCategory(
  transactions: Transaction[],
  periodStart: Date,
  periodEnd: Date,
  categoryMap: Record<string, string>
): CategorySpending[] {
  // Filter expense transactions within period
  const expenseTransactions = transactions.filter((t) => {
    const tDate = new Date(t.date);
    return t.type === 'expense' && tDate >= periodStart && tDate <= periodEnd;
  });

  // Group by category
  const categorySpending: Record<string, { amount: number; count: number; name: string }> = {};

  for (const transaction of expenseTransactions) {
    const categoryId = transaction.categoryId;
    const categoryName = categoryMap[categoryId] || 'Other';

    if (!categorySpending[categoryId]) {
      categorySpending[categoryId] = {
        amount: 0,
        count: 0,
        name: categoryName,
      };
    }

    categorySpending[categoryId].amount += Math.abs(transaction.amount);
    categorySpending[categoryId].count += 1;
  }

  // Calculate total for percentages
  const totalSpent = Object.values(categorySpending).reduce((sum, cat) => sum + cat.amount, 0);

  // Convert to array and add percentages
  const result: CategorySpending[] = Object.entries(categorySpending).map(([categoryId, data]) => ({
    categoryId,
    name: data.name,
    amount: data.amount,
    count: data.count,
    percentage: totalSpent > 0 ? (data.amount / totalSpent) * 100 : 0,
  }));

  // Sort by amount descending
  return result.sort((a, b) => b.amount - a.amount);
}

/**
 * Calculate account balances and net worth
 *
 * @param accounts - All accounts
 * @returns Account balance summary
 *
 * @example
 * ```ts
 * const balances = calculateAccountBalances(accounts);
 * console.log(balances.netWorth);     // 12500
 * console.log(balances.totalAssets);  // 15000
 * console.log(balances.byType.bank);  // 10000
 * ```
 */
export function calculateAccountBalances(accounts: Account[]): AccountBalances {
  let totalAssets = 0;
  let totalLiabilities = 0;
  const byType: Record<string, number> = {};

  for (const account of accounts) {
    const balance = account.balance;

    // Add to assets or liabilities
    if (balance >= 0) {
      totalAssets += balance;
    } else {
      totalLiabilities += Math.abs(balance);
    }

    // Add to type totals
    if (!byType[account.type]) {
      byType[account.type] = 0;
    }
    byType[account.type] += balance;
  }

  return {
    totalAssets,
    totalLiabilities,
    netWorth: totalAssets - totalLiabilities,
    byType,
  };
}

/**
 * Calculate average transaction amount
 *
 * @param transactions - Transactions to analyze
 * @param type - Filter by transaction type (optional)
 * @returns Average amount
 *
 * @example
 * ```ts
 * const avgExpense = calculateAverageTransaction(transactions, 'expense');
 * // Returns: 125.50
 * ```
 */
export function calculateAverageTransaction(
  transactions: Transaction[],
  type?: 'income' | 'expense' | 'transfer'
): number {
  const filtered = type ? transactions.filter((t) => t.type === type) : transactions;

  if (filtered.length === 0) return 0;

  const total = filtered.reduce((sum, t) => sum + Math.abs(t.amount), 0);
  return total / filtered.length;
}

/**
 * Calculate transaction count by type
 *
 * @param transactions - Transactions to analyze
 * @param periodStart - Start of period
 * @param periodEnd - End of period
 * @returns Count by type
 *
 * @example
 * ```ts
 * const counts = calculateTransactionCounts(transactions, start, end);
 * // Returns: { income: 12, expense: 45, transfer: 3 }
 * ```
 */
export function calculateTransactionCounts(
  transactions: Transaction[],
  periodStart: Date,
  periodEnd: Date
): Record<string, number> {
  const periodTransactions = transactions.filter((t) => {
    const tDate = new Date(t.date);
    return tDate >= periodStart && tDate <= periodEnd;
  });

  const counts: Record<string, number> = {
    income: 0,
    expense: 0,
    transfer: 0,
  };

  for (const transaction of periodTransactions) {
    counts[transaction.type] = (counts[transaction.type] || 0) + 1;
  }

  return counts;
}
