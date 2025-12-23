/**
 * @fileoverview BudgetProgress - Progress bar and footer stats
 * @module @kakeibo/native/components/features/budgets
 */

import type { BudgetProgress as BudgetProgressType } from '@kakeibo/core';
import { Text, View } from 'react-native';
import { ProgressBar } from '../../ui';

interface BudgetProgressProps {
  budgetProgress: BudgetProgressType;
  formatCurrency: (amount: number) => string;
}

export const BudgetProgress = ({ budgetProgress, formatCurrency }: BudgetProgressProps) => {
  const { remaining, percentage, isOverBudget, isWarning } = budgetProgress;

  return (
    <>
      <ProgressBar
        progress={percentage}
        color={isOverBudget ? 'danger' : isWarning ? 'warning' : 'primary'}
        size="sm"
      />

      {/* Footer */}
      <View className="flex-row items-center justify-between mt-2.5">
        <Text
          className={`text-[11px] font-medium ${
            isOverBudget ? 'text-danger-400' : isWarning ? 'text-warning-400' : 'text-surface-400'
          }`}
        >
          {percentage.toFixed(0)}% used
        </Text>
        <Text className="text-surface-500 text-[11px]">
          {formatCurrency(Math.abs(remaining))} {remaining < 0 ? 'over' : 'left'}
        </Text>
      </View>
    </>
  );
};
