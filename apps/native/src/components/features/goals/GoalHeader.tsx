/**
 * @fileoverview GoalHeader - Title and type badge
 * @module @kakeibo/native/components/features/goals
 */

import type { Goal } from '@kakeibo/core';
import { Text, View } from 'react-native';

interface GoalHeaderProps {
  goal: Goal;
}

export const GoalHeader = ({ goal }: GoalHeaderProps) => {
  const isSavings = goal.type === 'savings';

  return (
    <View className="flex-row items-center gap-2 mb-1">
      <Text className="text-surface-100 text-[14px] font-semibold flex-1" numberOfLines={1}>
        {goal.name}
      </Text>
      <View
        className={`px-1.5 py-0.5 rounded-md ${
          isSavings ? 'bg-success-500/15' : 'bg-danger-500/15'
        }`}
      >
        <Text
          className={`text-[10px] font-medium ${
            isSavings ? 'text-success-400' : 'text-danger-400'
          }`}
        >
          {isSavings ? 'Save' : 'Debt'}
        </Text>
      </View>
    </View>
  );
};
