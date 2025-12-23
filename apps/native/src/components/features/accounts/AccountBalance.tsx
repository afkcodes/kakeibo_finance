/**
 * @fileoverview AccountBalance - Balance display with smart color coding
 * @module @kakeibo/native/components/features/accounts
 */

import type { AccountType } from '@kakeibo/core';
import { Text } from 'react-native';

interface AccountBalanceProps {
  type: AccountType;
  balance: number;
  formatCurrency: (amount: number) => string;
}

export const AccountBalance = ({ type, balance, formatCurrency }: AccountBalanceProps) => {
  const isNegative = balance < 0;
  const isCredit = type === 'credit';

  // Smart color logic:
  // Credit cards: negative balance = good (green), positive = bad (red)
  // Other accounts: negative balance = bad (red), positive = normal (white)
  const textColor = isCredit
    ? isNegative
      ? 'text-danger-400'
      : 'text-success-400'
    : isNegative
      ? 'text-danger-400'
      : 'text-surface-50';

  return <Text className={`font-bold text-[15px] ${textColor}`}>{formatCurrency(balance)}</Text>;
};
