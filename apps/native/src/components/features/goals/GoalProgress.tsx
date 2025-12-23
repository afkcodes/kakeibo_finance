/**
 * @fileoverview GoalProgress - Horizontal progress bar
 * @module @kakeibo/native/components/features/goals
 */

import { View } from 'react-native';

interface GoalProgressProps {
  percentage: number;
  isAlmostDone: boolean;
}

export const GoalProgress = ({ percentage, isAlmostDone }: GoalProgressProps) => {
  return (
    <View className="h-1.5 bg-surface-700/50 rounded-full overflow-hidden mb-1.5">
      <View
        className={`h-full rounded-full ${isAlmostDone ? 'bg-success-500' : 'bg-primary-500'}`}
        style={{ width: `${Math.min(percentage, 100)}%` }}
      />
    </View>
  );
};
