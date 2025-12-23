/**
 * @fileoverview ProgressBar component with UniWind styling
 * @module @kakeibo/native/components/ui
 *
 * Progress indicator for budgets and goals.
 * Uses tailwind-variants for variant management.
 */

import { tv, type VariantProps } from '@kakeibo/core';
import type React from 'react';
import { Text, View, type ViewProps } from 'react-native';

const progressBarVariants = tv({
  slots: {
    container: 'w-full',
    track: 'w-full bg-surface-700/50 rounded-full overflow-hidden',
    fill: 'h-full rounded-full',
    label: 'text-surface-400 mt-1',
  },
  variants: {
    size: {
      sm: {
        track: 'h-1',
        label: 'text-xs',
      },
      md: {
        track: 'h-2',
        label: 'text-sm',
      },
      lg: {
        track: 'h-3',
        label: 'text-base',
      },
    },
    color: {
      primary: { fill: 'bg-primary-500' },
      success: { fill: 'bg-success-500' },
      danger: { fill: 'bg-danger-500' },
      warning: { fill: 'bg-warning-500' },
    },
  },
  defaultVariants: {
    size: 'md',
    color: 'primary',
  },
});

export interface ProgressBarProps
  extends Omit<ViewProps, 'style'>,
    VariantProps<typeof progressBarVariants> {
  /** Progress value (0-100) */
  progress: number;

  /** Optional label to show below progress bar */
  label?: string;

  /** Show percentage label */
  showPercentage?: boolean;
}

/**
 * ProgressBar component
 *
 * @example
 * <ProgressBar progress={65} color="success" />
 *
 * @example
 * <ProgressBar
 *   progress={80}
 *   color="warning"
 *   label="Budget Used"
 *   showPercentage
 * />
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  label,
  showPercentage = false,
  size,
  color,
  ...props
}) => {
  const styles = progressBarVariants({ size, color });
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <View className={styles.container()} {...props}>
      <View className={styles.track()}>
        <View className={styles.fill()} style={{ width: `${clampedProgress}%` }} />
      </View>
      {(label || showPercentage) && (
        <Text className={styles.label()}>
          {label}
          {label && showPercentage && ' • '}
          {showPercentage && `${clampedProgress}%`}
        </Text>
      )}
    </View>
  );
};

export { progressBarVariants };
