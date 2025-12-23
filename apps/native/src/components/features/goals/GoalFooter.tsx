/**
 * @fileoverview GoalFooter - Amount stats and percentage
 * @module @kakeibo/native/components/features/goals
 */

import type { Goal } from '@kakeibo/core';
import { Text, View } from 'react-native';

interface GoalFooterProps {
  goal: Goal;
  percentage: number;
  isAlmostDone: boolean;
  formatCurrency: (amount: number) => string;
  daysUntilDeadline?: number;
  formatDate?: (date: string) => string;
}

export const GoalFooter = ({
  goal,
  percentage,
  isAlmostDone,
  formatCurrency,
  daysUntilDeadline,
  formatDate,
}: GoalFooterProps) => {
  const isNearDeadline = daysUntilDeadline !== undefined && daysUntilDeadline < 30;

  return (
    <View className="flex-row items-center justify-between">
      <Text className="text-surface-400 text-[11px]">
        <Text className={`font-semibold ${isAlmostDone ? 'text-success-400' : 'text-surface-200'}`}>
          {formatCurrency(goal.currentAmount)}
        </Text>
        <Text className="text-surface-500"> / {formatCurrency(goal.targetAmount)}</Text>
      </Text>
      <Text className="text-surface-500 text-[11px]">
        {percentage.toFixed(0)}%
        {goal.deadline && daysUntilDeadline !== undefined && (
          <Text className={isNearDeadline ? 'text-danger-400' : 'text-surface-500'}>
            {' • '}
            {isNearDeadline
              ? `${daysUntilDeadline}d`
              : formatDate
                ? formatDate(goal.deadline.toISOString())
                : goal.deadline.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </Text>
        )}
      </Text>
    </View>
  );
};
