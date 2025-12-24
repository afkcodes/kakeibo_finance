/**
 * AccountsScreen - Manage financial accounts
 *
 * Displays all user accounts with net worth overview.
 * Features: Add/Edit/Delete accounts, Active/Archived filter.
 */

import type { Account, AccountType } from '@kakeibo/core';
import { useState } from 'react';
import { Pressable, ScrollView, StatusBar, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/ui/Button';
import { SquircleView } from '../components/ui/SquircleView';

// Mock data for now - will connect to SQLiteAdapter later
const mockAccounts: Account[] = [
  {
    id: 'acc-1',
    userId: 'user-1',
    name: 'Main Checking',
    type: 'bank',
    balance: 5420.5,
    currency: 'USD',
    color: '#3b82f6',
    isActive: true,
    isDefault: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'acc-2',
    userId: 'user-1',
    name: 'Credit Card',
    type: 'credit',
    balance: -1250.0,
    currency: 'USD',
    color: '#8b5cf6',
    isActive: true,
    isDefault: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'acc-3',
    userId: 'user-1',
    name: 'Savings',
    type: 'bank',
    balance: 15000.0,
    currency: 'USD',
    color: '#10b981',
    isActive: true,
    isDefault: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const getAccountIcon = (type: AccountType) => {
  // Will use Icon.tsx components later
  const icons: Record<AccountType, string> = {
    bank: '🏦',
    credit: '💳',
    cash: '💵',
    investment: '📈',
    wallet: '👛',
  };
  return icons[type] || '💰';
};

const getAccountTypeLabel = (type: AccountType) => {
  const labels: Record<AccountType, string> = {
    bank: 'Bank Account',
    credit: 'Credit Card',
    cash: 'Cash',
    investment: 'Investment',
    wallet: 'Digital Wallet',
  };
  return labels[type] || 'Account';
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const AccountsScreen = () => {
  const [showArchived, setShowArchived] = useState(false);

  // Calculate stats
  const accounts = mockAccounts.filter((a) => (showArchived ? !a.isActive : a.isActive));

  const totalAssets = accounts
    .filter((a) => a.type !== 'credit')
    .reduce((sum, a) => sum + Math.max(a.balance, 0), 0);

  const totalLiabilities = accounts
    .filter((a) => a.type === 'credit')
    .reduce((sum, a) => sum + Math.abs(Math.min(a.balance, 0)), 0);

  const netWorth = totalAssets - totalLiabilities;

  const assetsPercentage =
    totalAssets > 0 ? (totalAssets / (totalAssets + Math.abs(totalLiabilities))) * 100 : 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#09090b' }} edges={['top']}>
      <StatusBar barStyle="light-content" />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 pt-4 pb-6" style={{ gap: 24 }}>
          {/* Page Header */}
          <View>
            <Text className="text-xl font-semibold text-surface-50">Accounts</Text>
            <Text className="text-sm text-surface-400 mt-0.5">Manage your financial accounts</Text>
          </View>

          {/* Net Worth Overview Card */}
          <SquircleView
            backgroundColor="rgba(39, 39, 42, 0.6)"
            borderRadius={16}
            borderWidth={1}
            borderColor="rgba(63, 63, 70, 0.5)"
            style={{ padding: 20, gap: 16 }}
          >
            {/* Net Worth Header */}
            <View className="flex-row items-start justify-between">
              <View>
                <Text className="text-sm text-surface-400">Net Worth</Text>
                <Text
                  className={`text-3xl font-bold font-mono mt-1 ${
                    netWorth >= 0 ? 'text-surface-50' : 'text-danger-400'
                  }`}
                >
                  {formatCurrency(netWorth)}
                </Text>
              </View>
              <SquircleView
                backgroundColor={
                  netWorth >= 0 ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)'
                }
                borderRadius={8}
                style={{ paddingHorizontal: 8, paddingVertical: 4, flexDirection: 'row', gap: 4 }}
              >
                <Text
                  className="text-xs font-medium"
                  style={{ color: netWorth >= 0 ? '#4ade80' : '#f87171' }}
                >
                  {netWorth >= 0 ? '↗ Positive' : '↘ Negative'}
                </Text>
              </SquircleView>
            </View>

            {/* Progress Bar */}
            <View style={{ gap: 8 }}>
              <View
                className="h-2 bg-surface-700 rounded-full overflow-hidden"
                style={{ flexDirection: 'row' }}
              >
                <View className="h-full bg-success-500" style={{ width: `${assetsPercentage}%` }} />
                <View
                  className="h-full bg-danger-500"
                  style={{ width: `${100 - assetsPercentage}%` }}
                />
              </View>

              {/* Assets vs Liabilities */}
              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center" style={{ gap: 6 }}>
                  <View className="w-2 h-2 rounded-full bg-success-500" />
                  <Text className="text-xs text-surface-400">Assets</Text>
                  <Text className="text-xs font-semibold text-success-400">
                    {formatCurrency(totalAssets)}
                  </Text>
                </View>
                <View className="flex-row items-center" style={{ gap: 6 }}>
                  <Text className="text-xs font-semibold text-danger-400">
                    {formatCurrency(totalLiabilities)}
                  </Text>
                  <Text className="text-xs text-surface-400">Liabilities</Text>
                  <View className="w-2 h-2 rounded-full bg-danger-500" />
                </View>
              </View>
            </View>
          </SquircleView>

          {/* Filter Toggle */}
          <View className="flex-row items-center justify-between">
            <Text className="text-base font-medium text-surface-50">
              {showArchived ? 'Archived Accounts' : 'All Accounts'}
            </Text>
            <Pressable onPress={() => setShowArchived(!showArchived)}>
              <Text className="text-sm text-primary-400 font-medium">
                {showArchived ? 'Show Active' : 'Show Archived'}
              </Text>
            </Pressable>
          </View>

          {/* Accounts List */}
          <View style={{ gap: 8 }}>
            {accounts.length === 0 ? (
              <SquircleView
                backgroundColor="rgba(39, 39, 42, 0.4)"
                borderRadius={16}
                borderWidth={1}
                borderColor="rgba(63, 63, 70, 0.3)"
                style={{ padding: 32, alignItems: 'center' }}
              >
                <View className="w-16 h-16 bg-surface-700/50 rounded-xl items-center justify-center mb-4">
                  <Text className="text-4xl">👛</Text>
                </View>
                <Text className="text-lg font-medium text-surface-50 mb-2">No accounts yet</Text>
                <Text className="text-surface-400 text-sm text-center mb-4 max-w-sm">
                  Add your bank accounts, credit cards, and other financial accounts to track your
                  complete financial picture.
                </Text>
                <Button variant="primary" size="md">
                  <Text className="text-white font-semibold">Add Your First Account</Text>
                </Button>
              </SquircleView>
            ) : (
              <>
                {accounts.map((account) => {
                  const isNegative = account.balance < 0;
                  const isCredit = account.type === 'credit';

                  return (
                    <SquircleView
                      key={account.id}
                      backgroundColor="rgba(39, 39, 42, 0.4)"
                      borderRadius={12}
                      borderWidth={1}
                      borderColor="rgba(63, 63, 70, 0.3)"
                      style={{ padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12 }}
                    >
                      {/* Icon */}
                      <SquircleView
                        backgroundColor={`${account.color}18`}
                        borderRadius={12}
                        style={{
                          width: 40,
                          height: 40,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Text className="text-xl">{getAccountIcon(account.type)}</Text>
                      </SquircleView>

                      {/* Name & Type */}
                      <View className="flex-1">
                        <Text className="text-sm font-semibold text-surface-100">
                          {account.name}
                        </Text>
                        <Text className="text-xs text-surface-500 mt-0.5">
                          {getAccountTypeLabel(account.type)}
                        </Text>
                      </View>

                      {/* Balance */}
                      <Text
                        className={`text-base font-bold ${
                          isCredit
                            ? isNegative
                              ? 'text-danger-400'
                              : 'text-success-400'
                            : isNegative
                              ? 'text-danger-400'
                              : 'text-surface-50'
                        }`}
                      >
                        {formatCurrency(account.balance)}
                      </Text>
                    </SquircleView>
                  );
                })}

                {/* Add Account Button */}
                <Pressable>
                  <SquircleView
                    backgroundColor="transparent"
                    borderRadius={16}
                    borderWidth={2}
                    borderColor="rgba(63, 63, 70, 0.7)"
                    style={{
                      padding: 24,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 12,
                    }}
                  >
                    <View className="w-10 h-10 bg-surface-700/50 rounded-xl items-center justify-center">
                      <Text className="text-2xl text-surface-400">+</Text>
                    </View>
                    <Text className="font-medium text-surface-400">Add New Account</Text>
                  </SquircleView>
                </Pressable>
              </>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
