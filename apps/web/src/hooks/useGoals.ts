/**
 * @fileoverview Goal hooks for web platform
 * @module @kakeibo/web/hooks
 */

import type { CreateGoalInput, Goal, UpdateGoalInput } from '@kakeibo/core';
import { useLiveQuery } from 'dexie-react-hooks';
import { adapter } from '../services/db/adapter';
import { toastHelpers } from '../utils';

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
      try {
        const goal = await adapter.createGoal(userId, input);
        toastHelpers.success('Goal created', `${input.name} created successfully`);
        return goal;
      } catch (error) {
        toastHelpers.error(
          'Failed to create goal',
          error instanceof Error ? error.message : 'Unknown error'
        );
        throw error;
      }
    },

    updateGoal: async (goalId: string, updates: UpdateGoalInput) => {
      try {
        const goal = await adapter.updateGoal(goalId, updates);
        toastHelpers.success('Goal updated', 'Changes saved successfully');
        return goal;
      } catch (error) {
        toastHelpers.error(
          'Failed to update goal',
          error instanceof Error ? error.message : 'Unknown error'
        );
        throw error;
      }
    },

    deleteGoal: async (goalId: string) => {
      try {
        await adapter.deleteGoal(goalId);
        toastHelpers.success('Goal deleted', 'Goal removed successfully');
      } catch (error) {
        toastHelpers.error(
          'Failed to delete goal',
          error instanceof Error ? error.message : 'Unknown error'
        );
        throw error;
      }
    },

    updateGoalAmount: async (goalId: string, amount: number) => {
      try {
        const goal = await adapter.updateGoalAmount(goalId, amount);
        toastHelpers.success('Goal amount updated', 'Target amount changed successfully');
        return goal;
      } catch (error) {
        toastHelpers.error(
          'Failed to update amount',
          error instanceof Error ? error.message : 'Unknown error'
        );
        throw error;
      }
    },

    contributeToGoal: async (
      goalId: string,
      amount: number,
      accountId: string,
      description?: string
    ) => {
      try {
        const result = await adapter.contributeToGoal(goalId, amount, accountId, description);
        toastHelpers.success('Contribution added', `Contributed ${amount} to goal`);
        return result;
      } catch (error) {
        toastHelpers.error(
          'Failed to contribute',
          error instanceof Error ? error.message : 'Unknown error'
        );
        throw error;
      }
    },

    withdrawFromGoal: async (
      goalId: string,
      amount: number,
      accountId: string,
      description?: string
    ) => {
      try {
        const result = await adapter.withdrawFromGoal(goalId, amount, accountId, description);
        toastHelpers.success('Withdrawal recorded', `Withdrew ${amount} from goal`);
        return result;
      } catch (error) {
        toastHelpers.error(
          'Failed to withdraw',
          error instanceof Error ? error.message : 'Unknown error'
        );
        throw error;
      }
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
