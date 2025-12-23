/**
 * @fileoverview BudgetCategoryChips - Multi-category chip display
 * @module @kakeibo/native/components/features/budgets
 */

import type { Category } from '@kakeibo/core';
import { Text, View } from 'react-native';

interface BudgetCategoryChipsProps {
  categories: Category[];
}

export const BudgetCategoryChips = ({ categories }: BudgetCategoryChipsProps) => {
  if (categories.length <= 1) return null;

  return (
    <View className="flex-row items-center gap-1 mb-3 flex-wrap">
      {categories.slice(0, 3).map((cat) => (
        <View
          key={cat.id}
          className="flex-row items-center gap-1 px-1.5 py-0.5 rounded-md bg-surface-700/50"
        >
          <View className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cat.color }} />
          <Text className="text-[10px]" style={{ color: cat.color }}>
            {cat.name}
          </Text>
        </View>
      ))}
      {categories.length > 3 && (
        <Text className="text-surface-500 text-[10px]">+{categories.length - 3} more</Text>
      )}
    </View>
  );
};
