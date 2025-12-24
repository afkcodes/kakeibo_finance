/**
 * @fileoverview BudgetCard - Main composition component
 * @module @kakeibo/native/components/features/budgets
 *
 * Modular architecture with sub-components:
 * - BudgetIcon: Icon rendering (single/multi category)
 * - BudgetHeader: Title, amount, alert badge
 * - BudgetCategoryChips: Multi-category chip display
 * - BudgetProgress: Progress bar and footer stats
 * - BudgetMenu: Edit/delete dropdown
 */

import type { BudgetProgress, Category } from '@kakeibo/core';
import { View } from 'react-native';
import { BudgetCategoryChips } from './BudgetCategoryChips';
import { BudgetHeader } from './BudgetHeader';
import { BudgetIcon } from './BudgetIcon';
import { BudgetMenu } from './BudgetMenu';
import { BudgetProgress as BudgetProgressComponent } from './BudgetProgress';

export interface BudgetCardProps {
  budgetProgress: BudgetProgress;
  categories: Category[];
  formatCurrency: (amount: number) => string;
  onEdit?: () => void;
  onDelete: () => void;
}

export const BudgetCard = ({
  budgetProgress,
  categories,
  formatCurrency,
  onEdit,
  onDelete,
}: BudgetCardProps) => {
  const displayName = budgetProgress.budget.name || getBudgetDisplayName(categories);

  return (
    <View className="bg-surface-800/40 border border-surface-700/30 rounded-xl p-3.5">
      {/* Header */}
      <View className="flex-row items-center gap-3 mb-3">
        <BudgetIcon categories={categories} />
        <BudgetHeader
          displayName={displayName}
          budgetProgress={budgetProgress}
          formatCurrency={formatCurrency}
        />
        <BudgetMenu onEdit={onEdit} onDelete={onDelete} />
      </View>

      {/* Category Chips */}
      <BudgetCategoryChips categories={categories} />

      {/* Progress */}
      <BudgetProgressComponent budgetProgress={budgetProgress} formatCurrency={formatCurrency} />
    </View>
  );
};

// Helper: Get budget display name
const getBudgetDisplayName = (categories: Category[]): string => {
  if (categories.length === 0) return 'Unknown';
  if (categories.length === 1) return categories[0].name;
  if (categories.length === 2) return categories.map((c) => c.name).join(' & ');
  return `${categories[0].name} +${categories.length - 1} more`;
};
