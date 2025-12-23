/**
 * @fileoverview Badge component with UniWind styling
 * @module @kakeibo/native/components/ui
 *
 * Status badge component for displaying labels with semantic colors.
 * Uses tailwind-variants for variant management.
 */

import { tv, type VariantProps } from '@kakeibo/core';
import type React from 'react';
import { Text, View, type ViewProps } from 'react-native';

const badgeVariants = tv({
  slots: {
    root: 'rounded-full px-2 py-1 flex-row items-center justify-center',
    text: 'font-medium',
  },
  variants: {
    variant: {
      primary: {
        root: 'bg-primary-500/20',
        text: 'text-primary-400',
      },
      success: {
        root: 'bg-success-500/20',
        text: 'text-success-400',
      },
      danger: {
        root: 'bg-danger-500/20',
        text: 'text-danger-400',
      },
      warning: {
        root: 'bg-warning-500/20',
        text: 'text-warning-400',
      },
      neutral: {
        root: 'bg-surface-700',
        text: 'text-surface-300',
      },
    },
    size: {
      sm: {
        root: 'px-2 py-0.5',
        text: 'text-xs',
      },
      md: {
        root: 'px-2.5 py-1',
        text: 'text-sm',
      },
      lg: {
        root: 'px-3 py-1.5',
        text: 'text-base',
      },
    },
  },
  defaultVariants: {
    variant: 'neutral',
    size: 'md',
  },
});

export interface BadgeProps extends Omit<ViewProps, 'style'>, VariantProps<typeof badgeVariants> {
  /** Badge label text */
  children: React.ReactNode;
}

/**
 * Badge component
 *
 * @example
 * <Badge variant="success">Active</Badge>
 *
 * @example
 * <Badge variant="danger" size="sm">Overbudget</Badge>
 */
export const Badge: React.FC<BadgeProps> = ({ children, variant, size, ...props }) => {
  const styles = badgeVariants({ variant, size });

  return (
    <View className={styles.root()} {...props}>
      <Text className={styles.text()}>{children}</Text>
    </View>
  );
};

export { badgeVariants };
