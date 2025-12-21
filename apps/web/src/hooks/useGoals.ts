/**
 * @fileoverview Goal hooks for web platform
 * @module @kakeibo/web/hooks
 */

import type { CreateGoalInput, Goal, UpdateGoalInput } from '@kakeibo/core';
import { useLiveQuery } from 'dexie-react-hooks';
import { adapter } from '../services/db/adapter';

export interface GoalProgress {
  goal: Goal;
  percentage: number;
  remaining: number;
  daysUntilDeadline?: number;
  requiredMonthlyContribution?: number;
  isOnTrack: boolean;
}

export const useGoals = (userId: string, includeCompleted = false) => {
  return useLiveQuery(
    async () => {
      if (!userId) return [];
      return adapter.getGoals(userId, {
        isCompleted: includeCompleted ? undefined : false,
        isArchived: includeCompleted ? undefined : false,
      });
    },
    [userId, includeCompleted],
    []
  );
};

export const useGoal = (goalId: string) => {
  return useLiveQuery(
    async () => {
      if (!goalId) return undefined;
      return adapter.getGoal(goalId);
    },
    [goalId],
    undefined
  );
};

export const useGoalActions = () => {
  return {
    addGoal: async (userId: string, input: CreateGoalInput) => {
      return adapter.createGoal(userId, input);
    },

    updateGoal: async (goalId: string, updates: UpdateGoalInput) => {
      return adapter.updateGoal(goalId, updates);
    },

    deleteGoal: async (goalId: string) => {
      return adapter.deleteGoal(goalId);
    },

    updateGoalAmount: async (goalId: string, amount: number) => {
      return adapter.updateGoalAmount(goalId, amount);
    },

    contributeToGoal: async (
      goalId: string,
      amount: number,
      accountId: string,
      description?: string
    ) => {
      return adapter.contributeToGoal(goalId, amount, accountId, description);
    },

    withdrawFromGoal: async (
      goalId: string,
      amount: number,
      accountId: string,
      description?: string
    ) => {
      return adapter.withdrawFromGoal(goalId, amount, accountId, description);
    },
  };
};

export const useGoalProgress = (userId?: string): GoalProgress[] => {
  const goalsWithProgress = useLiveQuery(async () => {
    const goals = userId
      ? await adapter.getGoals(userId, {
          isArchived: false,
        })
      : [];

    const now = new Date();

    const progressList: GoalProgress[] = goals.map((goal: Goal) => {
      const percentage = (goal.currentAmount / goal.targetAmount) * 100;
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

    return progressList;
  }, [userId]);

  return goalsWithProgress ?? [];
};
