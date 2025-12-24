/**
 * @fileoverview TransactionIcon component
 * @module @kakeibo/native/components/features/transactions
 */

import type { TransactionType } from '@kakeibo/core';
import { getGoalIconColor, isGoalTransaction } from '@kakeibo/core';
import { ArrowLeftRight, Target } from 'lucide-react-native';
import type React from 'react';
import { View } from 'react-native';
import { CategoryIcon } from '../../ui';

interface TransactionIconProps {
  type: TransactionType;
  category?: {
    icon?: string;
    color?: string;
  };
  iconSize: number;
  iconInnerSize: number;
}

export const TransactionIcon: React.FC<TransactionIconProps> = ({
  type,
  category,
  iconSize,
  iconInnerSize,
}) => {
  const isGoal = isGoalTransaction(type);
  const isTransfer = type === 'transfer';

  return (
    <View
      className="rounded-lg items-center justify-center shrink-0"
      style={{
        backgroundColor: `${category?.color || '#5B6EF5'}18`,
        width: iconSize,
        height: iconSize,
      }}
    >
      {isGoal ? (
        <Target size={iconInnerSize} color={getGoalIconColor(type)} />
      ) : isTransfer ? (
        <ArrowLeftRight size={iconInnerSize} color="#cbd5e1" />
      ) : (
        <CategoryIcon
          icon={category?.icon || 'circle-help'}
          color={category?.color || '#5B6EF5'}
          size={iconSize > 35 ? 'md' : 'sm'}
        />
      )}
    </View>
  );
};
