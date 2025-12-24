/**
 * @fileoverview TransactionAmount component
 * @module @kakeibo/native/components/features/transactions
 */

import type { TransactionType } from '@kakeibo/core';
import { getTransactionAmountColor, getTransactionAmountPrefix } from '@kakeibo/core';
import type React from 'react';
import { Text, View } from 'react-native';

interface TransactionAmountProps {
  type: TransactionType;
  amount: number;
  date: string;
  formatCurrency: (amount: number) => string;
  formatDate?: (date: string) => string;
  isCompact: boolean;
}

export const TransactionAmount: React.FC<TransactionAmountProps> = ({
  type,
  amount,
  date,
  formatCurrency,
  formatDate,
  isCompact,
}) => {
  const displayDate = formatDate ? formatDate(date) : new Date(date).toLocaleDateString();
  const amountColor = getTransactionAmountColor(type);
  const amountPrefix = getTransactionAmountPrefix(type);

  return (
    <View className="items-end shrink-0 ml-2">
      <Text
        className={`font-semibold ${isCompact ? 'text-[15px]' : 'text-base'}`}
        style={{ color: amountColor }}
      >
        {amountPrefix}
        {formatCurrency(Math.abs(amount))}
      </Text>
      <Text className="text-surface-500 text-[11px] mt-0.5">{displayDate}</Text>
    </View>
  );
};
