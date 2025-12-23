/**
 * @fileoverview AccountIcon - Icon rendering for account cards
 * @module @kakeibo/native/components/features/accounts
 */

import type { AccountType } from '@kakeibo/core';
import { CreditCard, Wallet } from 'lucide-react-native';
import { View } from 'react-native';

interface AccountIconProps {
  type: AccountType;
  color?: string;
}

export const AccountIcon = ({ type, color = '#5B6EF5' }: AccountIconProps) => {
  const Icon = type === 'credit' ? CreditCard : Wallet;

  // Convert hex color to RGBA with ~10% opacity for background
  const backgroundColor = `${color}18`;

  return (
    <View className="w-10 h-10 rounded-lg items-center justify-center" style={{ backgroundColor }}>
      <Icon size={20} color={color} />
    </View>
  );
};
