/**
 * SectionHeader - Reusable section header for settings
 */

import { Text, View } from 'react-native';

interface SectionHeaderProps {
  title: string;
}

export const SectionHeader = ({ title }: SectionHeaderProps) => {
  return (
    <View className="px-5 mb-6">
      <Text className="text-xs font-semibold text-surface-400 uppercase tracking-wide mb-3 px-1">
        {title}
      </Text>
    </View>
  );
};
