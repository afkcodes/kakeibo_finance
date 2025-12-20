/**
 * @fileoverview Goal progress calculation services
 * @module @kakeibo/core/services/calculations
 *
 * Pure functions for calculating goal progress and required contributions.
 * These functions are platform-agnostic and can be used on both web and native.
 *
 * Platform: Platform-agnostic (core)
 */

import type { Goal, GoalProgress } from '../../types/goal';

/**
 * Calculate required monthly contribution to reach goal by deadline
 *
 * @param remaining - Remaining amount to reach target
 * @param daysUntilDeadline - Days until goal deadline
 * @returns Required monthly contribution amount
 *
 * @example
 * ```ts
 * calculateRequiredMonthlyContribution(3000, 90)
 * // Returns: 1000 (3000 / 3 months)
 * ```
 */
export function calculateRequiredMonthlyContribution(
  remaining: number,
  daysUntilDeadline: number
): number {
  const monthsRemaining = daysUntilDeadline / 30;
  if (monthsRemaining > 0) {
    return remaining / monthsRemaining;
  }
  return 0;
}

/**
 * Calculate goal progress with all metrics
 *
 * Calculates:
 * - Completion percentage
 * - Remaining amount
 * - Days until deadline (if applicable)
 * - Required monthly contribution (if deadline set)
 * - On-track status (within 10% of linear projection)
 *
 * @param goal - The goal to calculate progress for
 * @param now - Current date (defaults to new Date())
 * @returns Complete goal progress object
 *
 * @example
 * ```ts
 * const progress = calculateGoalProgress(goal);
 * console.log(progress.percentage); // 65
 * console.log(progress.isOnTrack); // true
 * console.log(progress.requiredMonthlyContribution); // 250
 * ```
 */
export function calculateGoalProgress(goal: Goal, now: Date = new Date()): GoalProgress {
  const percentage = (goal.currentAmount / goal.targetAmount) * 100;
  const remaining = goal.targetAmount - goal.currentAmount;

  let daysUntilDeadline: number | undefined;
  let requiredMonthlyContribution: number | undefined;
  let isOnTrack = true;

  if (goal.deadline) {
    const deadline = new Date(goal.deadline);

    // Calculate days until deadline
    daysUntilDeadline = Math.max(
      0,
      Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    );

    // Calculate required monthly contribution
    if (daysUntilDeadline > 0) {
      requiredMonthlyContribution = calculateRequiredMonthlyContribution(
        remaining,
        daysUntilDeadline
      );
    }

    // Calculate if on track (simple linear projection)
    const createdAt = new Date(goal.createdAt);
    const totalDays = Math.ceil((deadline.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
    const daysPassed = totalDays - daysUntilDeadline;

    if (daysPassed > 0) {
      const expectedProgress = (daysPassed / totalDays) * 100;
      // Within 10% of expected linear progress
      isOnTrack = percentage >= expectedProgress * 0.9;
    }
  }

  return {
    goal,
    percentage,
    remaining,
    daysUntilDeadline,
    requiredMonthlyContribution,
    isOnTrack,
  };
}
