/**
 * @fileoverview BudgetHeader - Title, amount, and alert badge
 * @module @kakeibo/native/components/features/budgets
 */

import type { BudgetProgress } from '@kakeibo/core';
import { Text, View } from 'react-native';
import { Badge } from '../../ui';

interface BudgetHeaderProps {
  displayName: string;
  budgetProgress: BudgetProgress;
  formatCurrency: (amount: number) => string;
}

export const BudgetHeader = ({
  displayName,
  budgetProgress,
  formatCurrency,
}: BudgetHeaderProps) => {
  const { budget, spent, isOverBudget, isWarning } = budgetProgress;
  const hasAlert = isOverBudget || isWarning;

  return (
    <View className="flex-1 min-w-0">
      <View className="flex-row items-center gap-2 mb-0.5">
        <Text className="text-surface-100 text-[14px] font-semibold" numberOfLines={1}>
          {displayName}
        </Text>
        {hasAlert && (
          <Badge variant={isOverBudget ? 'danger' : 'warning'} size="sm">
            {isOverBudget ? 'Over' : 'Warning'}
          </Badge>
        )}
      </View>
      <Text className="font-mono text-[14px] font-bold text-surface-100">
        {formatCurrency(spent)}{' '}
        <Text className="text-surface-500 font-normal">/ {formatCurrency(budget.amount)}</Text>
      </Text>
    </View>
  );
};
