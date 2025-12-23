/**
 * @fileoverview TransactionCard component
 * @module @kakeibo/native/components/features/transactions
 *
 * Displays transaction information with category icon, description, amount, and actions.
 * Refactored for modularity and maintainability.
 */

import type { TransactionType } from '@kakeibo/core';
import type React from 'react';
import { View } from 'react-native';
import { useTransactionMenu } from '../../../hooks/useTransactionMenu';
import { Card } from '../../ui';
import { TransactionAmount } from './TransactionAmount';
import { TransactionIcon } from './TransactionIcon';
import { TransactionInfo } from './TransactionInfo';
import { TransactionMenu } from './TransactionMenu';

export interface TransactionCardProps {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  date: string;
  category?: {
    name: string;
    icon?: string;
    color?: string;
  };
  subcategory?: {
    name: string;
  };
  goalName?: string;
  accountName?: string;
  toAccountName?: string;
  isEssential?: boolean;
  formatCurrency: (amount: number) => string;
  formatDate?: (date: string) => string;
  onEdit?: () => void;
  onDelete: () => void;
  variant?: 'default' | 'compact';
}

/**
 * TransactionCard component
 *
 * Modular component built from sub-components:
 * - TransactionIcon: Icon rendering
 * - TransactionInfo: Description and category
 * - TransactionAmount: Amount and date
 * - TransactionMenu: Edit/delete actions
 *
 * @example
 * <TransactionCard
 *   id="tr-123"
 *   description="Grocery shopping"
 *   amount={45.50}
 *   type="expense"
 *   date="2024-12-22"
 *   category={{ name: "Food", icon: "utensils", color: "#f59e0b" }}
 *   formatCurrency={(amt) => `$${amt.toFixed(2)}`}
 *   onDelete={() => {}}
 * />
 */
export const TransactionCard: React.FC<TransactionCardProps> = ({
  description,
  amount,
  type,
  date,
  category,
  subcategory,
  goalName,
  accountName,
  toAccountName,
  isEssential,
  formatCurrency,
  formatDate,
  onEdit,
  onDelete,
  variant = 'default',
}) => {
  const { menuOpen, toggleMenu, closeMenu } = useTransactionMenu();
  const isCompact = variant === 'compact';

  // Icon sizes based on variant
  const iconSize = isCompact ? 32 : 40;
  const iconInnerSize = isCompact ? 16 : 18;

  const hasMenu = onEdit !== undefined || onDelete !== undefined;

  return (
    <Card variant="default" padding={isCompact ? 'sm' : 'md'}>
      <View className={`flex-row items-center ${isCompact ? 'gap-2' : 'gap-2.5'}`}>
        {/* Icon */}
        <TransactionIcon
          type={type}
          category={category}
          iconSize={iconSize}
          iconInnerSize={iconInnerSize}
        />

        {/* Content */}
        <View className="flex-1 min-w-0">
          <View className="flex-row items-center justify-between gap-2">
            {/* Info */}
            <TransactionInfo
              type={type}
              description={description}
              category={category}
              subcategory={subcategory}
              goalName={goalName}
              accountName={accountName}
              toAccountName={toAccountName}
              isEssential={isEssential}
              isCompact={isCompact}
            />

            {/* Amount */}
            <TransactionAmount
              type={type}
              amount={amount}
              date={date}
              formatCurrency={formatCurrency}
              formatDate={formatDate}
              isCompact={isCompact}
            />
          </View>
        </View>

        {/* Menu */}
        {hasMenu && (
          <TransactionMenu
            menuOpen={menuOpen}
            onToggle={toggleMenu}
            onEdit={onEdit}
            onDelete={onDelete}
            onClose={closeMenu}
          />
        )}
      </View>
    </Card>
  );
};
