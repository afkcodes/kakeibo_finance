/**
 * @fileoverview TransactionInfo component
 * @module @kakeibo/native/components/features/transactions
 */

import type { TransactionType } from '@kakeibo/core';
import { isGoalTransaction } from '@kakeibo/core';
import { ArrowRight, ShieldCheck, Target } from 'lucide-react-native';
import type React from 'react';
import { Text, View } from 'react-native';

interface TransactionInfoProps {
  type: TransactionType;
  description: string;
  category?: {
    name: string;
  };
  subcategory?: {
    name: string;
  };
  goalName?: string;
  accountName?: string;
  toAccountName?: string;
  isEssential?: boolean;
  isCompact: boolean;
}

export const TransactionInfo: React.FC<TransactionInfoProps> = ({
  type,
  description,
  category,
  subcategory,
  goalName,
  accountName,
  toAccountName,
  isEssential,
  isCompact,
}) => {
  const isGoal = isGoalTransaction(type);
  const isTransfer = type === 'transfer';

  return (
    <View className="flex-1 min-w-0">
      {/* Description */}
      <View className="flex-row items-center gap-1.5 mb-1">
        <Text
          className={`text-surface-100 font-semibold ${isCompact ? 'text-[13px]' : 'text-sm'} shrink`}
          numberOfLines={1}
          style={{ flexShrink: 1 }}
        >
          {description}
        </Text>
        {isEssential && <ShieldCheck size={16} color="#818cf8" className="shrink-0" />}
      </View>

      {/* Category/Goal/Transfer Info */}
      <View className="flex-row items-center gap-1.5">
        {isGoal ? (
          <>
            <Target size={14} color="#64748b" />
            <Text className="text-surface-400 text-xs" numberOfLines={1}>
              {goalName}
            </Text>
          </>
        ) : isTransfer ? (
          <>
            <Text className="text-surface-400 text-xs" numberOfLines={1}>
              {accountName}
            </Text>
            <ArrowRight size={12} color="#64748b" />
            <Text className="text-surface-400 text-xs" numberOfLines={1}>
              {toAccountName}
            </Text>
          </>
        ) : (
          <Text className="text-surface-400 text-xs" numberOfLines={1}>
            {category?.name}
            {subcategory && ` • ${subcategory.name}`}
          </Text>
        )}
      </View>
    </View>
  );
};
