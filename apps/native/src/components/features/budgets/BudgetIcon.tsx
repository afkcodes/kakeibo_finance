/**
 * @fileoverview BudgetIcon - Icon rendering for budget cards
 * @module @kakeibo/native/components/features/budgets
 */

import type { Category } from '@kakeibo/core';
import { PieChart } from 'lucide-react-native';
import { View } from 'react-native';
import { CategoryIcon } from '../../ui';

interface BudgetIconProps {
  categories: Category[];
}

export const BudgetIcon = ({ categories }: BudgetIconProps) => {
  const primaryCategory = categories[0];
  const isMultiCategory = categories.length > 1;

  return (
    <View
      className="w-10 h-10 rounded-xl items-center justify-center"
      style={{ backgroundColor: `${primaryCategory?.color || '#6b7280'}18` }}
    >
      {isMultiCategory ? (
        <PieChart size={20} color={primaryCategory?.color || '#6b7280'} />
      ) : (
        <CategoryIcon
          icon={primaryCategory?.icon || 'more-horizontal'}
          color={primaryCategory?.color}
          size="sm"
        />
      )}
    </View>
  );
};
