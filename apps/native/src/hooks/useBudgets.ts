/**
 * @fileoverview Budget hooks (query + mutations)
 * @module @kakeibo/native/hooks/useBudgets
 */

import type { Budget, BudgetFilters, CreateBudgetInput, UpdateBudgetInput } from '@kakeibo/core';
import { useEffect, useRef, useState } from 'react';
import { create } from 'zustand';
import { toast } from '../components/ui/Toast/toast';
import { adapter } from '../services/db/SQLiteAdapter';
import { useCurrentUser } from '../store/appStore';

// ==================== Invalidation Store ====================

interface BudgetInvalidationState {
  budgetVersion: number;
  invalidateBudgets: () => void;
}

export const useBudgetInvalidation = create<BudgetInvalidationState>((set) => ({
  budgetVersion: 0,
  invalidateBudgets: () => set((state) => ({ budgetVersion: state.budgetVersion + 1 })),
}));

// ==================== Query Hooks ====================

interface UseBudgetsResult {
  budgets: Budget[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useBudgets(filters?: BudgetFilters): UseBudgetsResult {
  const currentUser = useCurrentUser();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Watch invalidation version for reactive updates
  const budgetVersion = useBudgetInvalidation((state) => state.budgetVersion);

  // Use ref for filters to avoid JSON.stringify
  const filtersRef = useRef(filters);
  filtersRef.current = filters;

  const fetchBudgets = async () => {
    if (!currentUser?.id) {
      setBudgets([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = await adapter.getBudgets(currentUser.id, filtersRef.current);
      setBudgets(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch budgets'));
      setBudgets([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, [currentUser?.id, budgetVersion]);

  return { budgets, isLoading, error, refetch: fetchBudgets };
}

interface UseBudgetResult {
  budget: Budget | null;
  isLoading: boolean;
  error: Error | null;
}

export function useBudget(budgetId: string | undefined): UseBudgetResult {
  const currentUser = useCurrentUser();
  const [budget, setBudget] = useState<Budget | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Watch invalidation version
  const budgetVersion = useBudgetInvalidation((state) => state.budgetVersion);

  useEffect(() => {
    if (!currentUser?.id || !budgetId) {
      setBudget(null);
      setIsLoading(false);
      return;
    }

    const fetchBudget = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await adapter.getBudget(budgetId);
        setBudget(data ?? null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch budget'));
        setBudget(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBudget();
  }, [currentUser?.id, budgetId, budgetVersion]);

  return { budget, isLoading, error };
}

// ==================== Mutation Hooks ====================

interface UseBudgetActionsResult {
  createBudget: (input: CreateBudgetInput) => Promise<Budget>;
  updateBudget: (id: string, input: UpdateBudgetInput) => Promise<Budget>;
  deleteBudget: (id: string) => Promise<void>;
}

export function useBudgetActions(): UseBudgetActionsResult {
  const currentUser = useCurrentUser();
  const invalidateBudgets = useBudgetInvalidation((state) => state.invalidateBudgets);

  const createBudget = async (input: CreateBudgetInput): Promise<Budget> => {
    if (!currentUser?.id) throw new Error('User not authenticated');

    try {
      const budget = await adapter.createBudget(currentUser.id, input);
      invalidateBudgets();
      toast.success('Budget created successfully');
      return budget;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create budget');
      toast.error(error.message);
      throw error;
    }
  };

  const updateBudget = async (id: string, input: UpdateBudgetInput): Promise<Budget> => {
    if (!currentUser?.id) throw new Error('User not authenticated');

    try {
      const budget = await adapter.updateBudget(id, input);
      invalidateBudgets();
      toast.success('Budget updated successfully');
      return budget;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update budget');
      toast.error(error.message);
      throw error;
    }
  };

  const deleteBudget = async (id: string): Promise<void> => {
    if (!currentUser?.id) throw new Error('User not authenticated');

    try {
      await adapter.deleteBudget(id);
      invalidateBudgets();
      toast.success('Budget deleted successfully');
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to delete budget');
      toast.error(error.message);
      throw error;
    }
  };

  return { createBudget, updateBudget, deleteBudget };
}
