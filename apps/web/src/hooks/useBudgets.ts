/**
 * @fileoverview Budget hooks for web platform
 * @module @kakeibo/web/hooks
 */

import type { Budget, CreateBudgetInput, UpdateBudgetInput } from '@kakeibo/core';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../services/db';
import { adapter } from '../services/db/adapter';

export interface BudgetProgress {
  budget: Budget;
  spent: number;
  remaining: number;
  percentage: number;
  isOverBudget: boolean;
  isWarning: boolean;
  activeAlerts: number[];
  daysRemaining: number;
  totalDays: number;
  dailyBudget: number;
  dailyAverage: number;
  projectedSpending: number;
  projectedRemaining: number;
}

const DEFAULT_ALERT_THRESHOLDS = [50, 75, 90, 100];

/**
 * Helper to normalize budget categoryIds for backward compatibility.
 */
const normalizeBudgetCategoryIds = (budget: Budget): string[] => {
  if (Array.isArray(budget.categoryIds) && budget.categoryIds.length > 0) {
    return budget.categoryIds;
  }
  return [];
};

/**
 * Calculate which alert thresholds have been exceeded
 */
const calculateActiveAlerts = (percentage: number, thresholds: number[]): number[] => {
  return thresholds.filter((threshold) => percentage >= threshold).sort((a, b) => b - a);
};

export const useBudgets = (userId: string, includeInactive = false) => {
  return useLiveQuery(
    async () => {
      if (!userId) return [];
      return adapter.getBudgets(userId, {
        isActive: includeInactive ? undefined : true,
      });
    },
    [userId, includeInactive],
    []
  );
};

export const useBudget = (budgetId: string) => {
  return useLiveQuery(
    async () => {
      if (!budgetId) return undefined;
      return adapter.getBudget(budgetId);
    },
    [budgetId],
    undefined
  );
};

export const useBudgetActions = () => {
  return {
    addBudget: async (userId: string, input: CreateBudgetInput) => {
      return adapter.createBudget(userId, input);
    },

    updateBudget: async (budgetId: string, updates: UpdateBudgetInput) => {
      return adapter.updateBudget(budgetId, updates);
    },

    deleteBudget: async (budgetId: string) => {
      return adapter.deleteBudget(budgetId);
    },
  };
};

/**
 * Hook to get budget progress with spending calculations
 */
export const useBudgetProgress = (userId?: string): BudgetProgress[] => {
  const budgetsWithProgress = useLiveQuery(async () => {
    const budgets = userId ? await adapter.getBudgets(userId, { isActive: true }) : [];

    const now = new Date();

    const progressList: BudgetProgress[] = await Promise.all(
      budgets.map(async (budget: Budget) => {
        const categoryIds = normalizeBudgetCategoryIds(budget);

        // Get all transactions for categories in this budget
        const allTransactions = await db.transactions.toArray();

        const periodStart = budget.startDate;
        const periodEnd = budget.endDate || now;

        // Filter transactions that match any of the budget's categories
        const relevantTransactions = allTransactions.filter((t) => {
          const tDate = t.date;
          const inPeriod = t.type === 'expense' && tDate >= periodStart && tDate <= periodEnd;

          if (!inPeriod) return false;

          return categoryIds.includes(t.categoryId);
        });

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
        const projectedSpending = dailyAverage * totalDays;
        const projectedRemaining = budget.amount - projectedSpending;

        // Alert calculations
        const alertThresholds = DEFAULT_ALERT_THRESHOLDS;
        const activeAlerts = calculateActiveAlerts(percentage, alertThresholds);
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
      })
    );

    return progressList;
  }, [userId]);

  return budgetsWithProgress ?? [];
};
