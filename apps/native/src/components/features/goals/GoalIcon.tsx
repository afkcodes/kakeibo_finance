/**
 * @fileoverview GoalIcon - Icon rendering for goal cards
 * @module @kakeibo/native/components/features/goals
 */

import type { Goal } from '@kakeibo/core';
import { CreditCard, PiggyBank } from 'lucide-react-native';
import { View } from 'react-native';

interface GoalIconProps {
  goal: Goal;
}

export const GoalIcon = ({ goal }: GoalIconProps) => {
  const isSavings = goal.type === 'savings';
  const iconColor = goal.color || '#5B6EF5';

  return (
    <View
      className="w-10 h-10 rounded-xl items-center justify-center"
      style={{ backgroundColor: `${iconColor}18` }}
    >
      {isSavings ? (
        <PiggyBank size={20} color={iconColor} />
      ) : (
        <CreditCard size={20} color={iconColor} />
      )}
    </View>
  );
};
