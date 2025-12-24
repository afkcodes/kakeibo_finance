/**
 * @fileoverview AccountHeader - Name and type label
 * @module @kakeibo/native/components/features/accounts
 */

import type { AccountType } from '@kakeibo/core';
import { Text, View } from 'react-native';

interface AccountHeaderProps {
  name: string;
  type: AccountType;
  getTypeLabel: (type: AccountType) => string;
}

export const AccountHeader = ({ name, type, getTypeLabel }: AccountHeaderProps) => {
  return (
    <View className="flex-1 min-w-0">
      <Text className="text-surface-100 font-semibold text-[14px] mb-0.5" numberOfLines={1}>
        {name}
      </Text>
      <Text className="text-surface-500 text-[12px]">{getTypeLabel(type)}</Text>
    </View>
  );
};
