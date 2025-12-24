/**
 * @fileoverview EmptyState component
 * @module @kakeibo/native/components/common
 *
 * Empty state component for lists with no data.
 */

import type { LucideIcon } from 'lucide-react-native';
import type React from 'react';
import { Text, View } from 'react-native';
import { Button } from '../ui/Button';

export interface EmptyStateProps {
  /** Icon component from lucide-react-native */
  icon: LucideIcon;

  /** Title text */
  title: string;

  /** Description text */
  description?: string;

  /** Optional action button */
  action?: {
    label: string;
    onPress: () => void;
  };
}

/**
 * EmptyState component
 *
 * @example
 * <EmptyState
 *   icon={Inbox}
 *   title="No transactions yet"
 *   description="Add your first transaction to get started"
 *   action={{ label: "Add Transaction", onPress: handleAdd }}
 * />
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  action,
}) => {
  return (
    <View className="flex-1 items-center justify-center p-8">
      <View className="w-16 h-16 rounded-full bg-surface-800/60 items-center justify-center mb-4">
        <Icon size={32} color="#64748b" />
      </View>
      <Text className="text-surface-100 text-lg font-semibold text-center mb-2">{title}</Text>
      {description && (
        <Text className="text-surface-400 text-sm text-center mb-6">{description}</Text>
      )}
      {action && (
        <Button variant="primary" onPress={action.onPress}>
          {action.label}
        </Button>
      )}
    </View>
  );
};
