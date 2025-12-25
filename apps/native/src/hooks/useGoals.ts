/**
 * @fileoverview Goal hooks (query + mutations)
 * @module @kakeibo/native/hooks/useGoals
 *
 * Improvements:
 * - Zustand-based invalidation for reactive updates
 * - Toast notifications for user feedback
 * - Returns created/updated entities
 * - Progress calculation hook
 * - Stable dependency tracking
 */

import type { CreateGoalInput, Goal, GoalFilters, UpdateGoalInput } from '@kakeibo/core';
import { useCallback, useEffect, useRef, useState } from 'react';
import { create } from 'zustand';
import { toast } from '../components/ui/Toast/toast';
import { adapter } from '../services/db/SQLiteAdapter';
import { useCurrentUser } from '../store/appStore';

/**
 * Goal invalidation store
 */
interface GoalInvalidationState {
  goalVersion: number;
  invalidateGoals: () => void;
}

export const useGoalInvalidation = create<GoalInvalidationState>((set) => ({
  goalVersion: 0,
  invalidateGoals: () => set((state) => ({ goalVersion: state.goalVersion + 1 })),
}));

export interface GoalProgress {
  goal: Goal;
  percentage: number;
  remaining: number;
  daysUntilDeadline?: number;
  requiredMonthlyContribution?: number;
  isOnTrack: boolean;
}

interface UseGoalsResult {
  goals: Goal[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useGoals(filters?: GoalFilters): UseGoalsResult {
  const currentUser = useCurrentUser();
  const goalVersion = useGoalInvalidation((state) => state.goalVersion);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Use ref for stable dependencies
  const filtersRef = useRef(filters);
  filtersRef.current = filters;

  const fetchGoals = useCallback(async () => {
    if (!currentUser?.id) {
      setGoals([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = await adapter.getGoals(currentUser.id, filtersRef.current);
      setGoals(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch goals'));
      setGoals([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser?.id]);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals, goalVersion]);

  return { goals, isLoading, error, refetch: fetchGoals };
}

export function useGoal(goalId: string | undefined) {
  const currentUser = useCurrentUser();
  const goalVersion = useGoalInvalidation((state) => state.goalVersion);
  const [goal, setGoal] = useState<Goal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchGoal = useCallback(async () => {
    if (!currentUser?.id || !goalId) {
      setGoal(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = await adapter.getGoal(goalId);
      setGoal(data ?? null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch goal'));
      setGoal(null);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser?.id, goalId]);

  useEffect(() => {
    fetchGoal();
  }, [fetchGoal, goalVersion]);

  return { goal, isLoading, error, refetch: fetchGoal };
}

interface UseGoalActionsResult {
  createGoal: (input: CreateGoalInput) => Promise<Goal>;
  updateGoal: (id: string, input: UpdateGoalInput) => Promise<Goal>;
  updateGoalAmount: (id: string, amount: number) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  contributeToGoal: (
    id: string,
    amount: number,
    accountId: string,
    description?: string
  ) => Promise<void>;
  withdrawFromGoal: (
    id: string,
    amount: number,
    accountId: string,
    description?: string
  ) => Promise<void>;
  isLoading: boolean;
  error: Error | null;
}

export function useGoalActions(): UseGoalActionsResult {
  const currentUser = useCurrentUser();
  const invalidateGoals = useGoalInvalidation((state) => state.invalidateGoals);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createGoal = async (input: CreateGoalInput) => {
    if (!currentUser?.id) throw new Error('User not authenticated');

    try {
      setIsLoading(true);
      setError(null);
      const goal = await adapter.createGoal(currentUser.id, input);
      invalidateGoals();
      toast.success(`Goal "${input.name}" created successfully`);
      return goal;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create goal');
      setError(error);
      toast.error(`Failed to create goal: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateGoal = async (id: string, input: UpdateGoalInput) => {
    if (!currentUser?.id) throw new Error('User not authenticated');

    try {
      setIsLoading(true);
      setError(null);
      const goal = await adapter.updateGoal(id, input);
      invalidateGoals();
      toast.success('Goal updated successfully');
      return goal;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update goal');
      setError(error);
      toast.error(`Failed to update goal: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateGoalAmount = async (id: string, amount: number) => {
    if (!currentUser?.id) throw new Error('User not authenticated');

    try {
      setIsLoading(true);
      setError(null);
      await adapter.updateGoalAmount(id, amount);
      invalidateGoals();
      toast.success('Goal target amount updated');
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update goal amount');
      setError(error);
      toast.error(`Failed to update amount: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteGoal = async (id: string) => {
    if (!currentUser?.id) throw new Error('User not authenticated');

    try {
      setIsLoading(true);
      setError(null);
      await adapter.deleteGoal(id);
      invalidateGoals();
      toast.success('Goal deleted successfully');
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to delete goal');
      setError(error);
      toast.error(`Failed to delete goal: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const contributeToGoal = async (
    id: string,
    amount: number,
    accountId: string,
    description?: string
  ) => {
    if (!currentUser?.id) throw new Error('User not authenticated');

    try {
      setIsLoading(true);
      setError(null);
      // Creates a transaction and updates goal amount
      await adapter.contributeToGoal(id, amount, accountId, description);
      invalidateGoals();
      toast.success(`Contributed ${amount} to goal`);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to contribute to goal');
      setError(error);
      toast.error(`Failed to contribute: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const withdrawFromGoal = async (
    id: string,
    amount: number,
    accountId: string,
    description?: string
  ) => {
    if (!currentUser?.id) throw new Error('User not authenticated');

    try {
      setIsLoading(true);
      setError(null);
      // Creates a transaction and updates goal amount
      await adapter.withdrawFromGoal(id, amount, accountId, description);
      invalidateGoals();
      toast.success(`Withdrew ${amount} from goal`);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to withdraw from goal');
      setError(error);
      toast.error(`Failed to withdraw: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createGoal,
    updateGoal,
    updateGoalAmount,
    deleteGoal,
    contributeToGoal,
    withdrawFromGoal,
    isLoading,
    error,
  };
}

/**
 * Calculate progress for all active goals
 * Returns goals with progress metrics (percentage, remaining, days until deadline, etc.)
 */
export function useGoalProgress(): GoalProgress[] {
  const currentUser = useCurrentUser();
  const { goals, isLoading } = useGoals({
    isArchived: false,
  });

  if (isLoading || !currentUser) return [];

  const now = new Date();

  return goals.map((goal) => {
    const percentage = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
    const remaining = goal.targetAmount - goal.currentAmount;

    let daysUntilDeadline: number | undefined;
    let requiredMonthlyContribution: number | undefined;
    let isOnTrack = true;

    if (goal.deadline) {
      const deadline = goal.deadline;
      daysUntilDeadline = Math.max(
        0,
        Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      );

      const monthsRemaining = daysUntilDeadline / 30;
      if (monthsRemaining > 0) {
        requiredMonthlyContribution = remaining / monthsRemaining;
      }

      // Calculate if on track (simple linear projection)
      const totalDays = Math.ceil(
        (deadline.getTime() - goal.createdAt.getTime()) / (1000 * 60 * 60 * 24)
      );
      const daysPassed = totalDays - daysUntilDeadline;
      const expectedProgress = daysPassed > 0 ? (daysPassed / totalDays) * 100 : 0;
      isOnTrack = percentage >= expectedProgress * 0.9; // Within 10% of expected
    }

    return {
      goal,
      percentage,
      remaining,
      daysUntilDeadline,
      requiredMonthlyContribution,
      isOnTrack,
    };
  });
}
