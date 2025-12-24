/**
 * @fileoverview AccountCard - Compact inline account display
 * @module @kakeibo/native/components/features/accounts
 *
 * Modular architecture with sub-components:
 * - AccountIcon: Bank/credit icon with custom color
 * - AccountHeader: Name and type label
 * - AccountBalance: Balance with smart color coding
 * - AccountMenu: Transfer/edit/delete dropdown
 */

import type { Account } from '@kakeibo/core';
import { View } from 'react-native';
import { AccountBalance } from './AccountBalance';
import { AccountHeader } from './AccountHeader';
import { AccountIcon } from './AccountIcon';
import { AccountMenu } from './AccountMenu';

export interface AccountCardProps {
  account: Account;
  formatCurrency: (amount: number) => string;
  getTypeLabel: (type: Account['type']) => string;
  onTransfer: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const AccountCard = ({
  account,
  formatCurrency,
  getTypeLabel,
  onTransfer,
  onEdit,
  onDelete,
}: AccountCardProps) => {
  return (
    <View className="bg-surface-800/40 border border-surface-700/30 rounded-xl p-3.5 flex-row items-center gap-3">
      <AccountIcon type={account.type} color={account.color} />
      <AccountHeader name={account.name} type={account.type} getTypeLabel={getTypeLabel} />
      <AccountBalance
        type={account.type}
        balance={account.balance}
        formatCurrency={formatCurrency}
      />
      <AccountMenu onTransfer={onTransfer} onEdit={onEdit} onDelete={onDelete} />
    </View>
  );
};
