/**
 * NetWorthCard - Display total net worth summary
 */

import { Text, View } from 'react-native';
import { SquircleView } from '../ui/SquircleView';

interface NetWorthCardProps {
  netWorth: number;
  accountsCount: number;
  monthlyChange: string;
}

export const NetWorthCard = ({ netWorth, accountsCount, monthlyChange }: NetWorthCardProps) => {
  return (
    <SquircleView
      backgroundColor="#141416"
      borderRadius={12}
      borderWidth={1}
      borderColor="#27272a"
      style={{ padding: 20 }}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-sm text-surface-400 mb-1">Total Net Worth</Text>
          <Text className="text-2xl font-bold text-surface-50">
            $
            {netWorth.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Text>
        </View>
        <View className="items-end" style={{ gap: 4 }}>
          <View className="flex-row items-center" style={{ gap: 6 }}>
            <Text className="text-xs text-surface-500">{accountsCount} accounts</Text>
          </View>
          <View className="flex-row items-center" style={{ gap: 6 }}>
            <Text className="text-xs text-emerald-400">{monthlyChange} this month</Text>
          </View>
        </View>
      </View>
    </SquircleView>
  );
};
