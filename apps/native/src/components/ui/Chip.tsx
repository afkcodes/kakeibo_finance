/**
 * @fileoverview Chip component
 * @module @kakeibo/native/components/ui
 *
 * Chip component for tags and selectable items.
 */

import { tv, type VariantProps } from '@kakeibo/core';
import { X } from 'lucide-react-native';
import type React from 'react';
import { Pressable, Text, View } from 'react-native';

const chipVariants = tv({
  slots: {
    root: 'rounded-full flex-row items-center justify-center',
    text: 'font-medium',
    closeButton: 'ml-1 items-center justify-center',
  },
  variants: {
    variant: {
      primary: {
        root: 'bg-primary-500/20 border border-primary-500/30',
        text: 'text-primary-400',
      },
      success: {
        root: 'bg-success-500/20 border border-success-500/30',
        text: 'text-success-400',
      },
      danger: {
        root: 'bg-danger-500/20 border border-danger-500/30',
        text: 'text-danger-400',
      },
      warning: {
        root: 'bg-warning-500/20 border border-warning-500/30',
        text: 'text-warning-400',
      },
      neutral: {
        root: 'bg-surface-700/50 border border-surface-600',
        text: 'text-surface-300',
      },
    },
    size: {
      sm: {
        root: 'px-2 py-1',
        text: 'text-xs',
      },
      md: {
        root: 'px-3 py-1.5',
        text: 'text-sm',
      },
      lg: {
        root: 'px-4 py-2',
        text: 'text-base',
      },
    },
    clickable: {
      true: {
        root: 'active:opacity-70',
      },
    },
  },
  defaultVariants: {
    variant: 'neutral',
    size: 'md',
    clickable: false,
  },
});

export interface ChipProps extends VariantProps<typeof chipVariants> {
  /** Chip label */
  label: string;

  /** Click handler */
  onPress?: () => void;

  /** Close/remove handler */
  onClose?: () => void;

  /** Disabled state */
  disabled?: boolean;
}

/**
 * Chip component
 *
 * @example
 * <Chip label="Category" variant="primary" />
 *
 * @example
 * <Chip
 *   label="Selected"
 *   variant="success"
 *   onClose={() => console.log('remove')}
 * />
 */
export const Chip: React.FC<ChipProps> = ({
  label,
  variant,
  size,
  onPress,
  onClose,
  disabled = false,
}) => {
  const clickable = !!onPress;
  const styles = chipVariants({ variant, size, clickable });

  const getCloseIconSize = () => {
    switch (size) {
      case 'sm':
        return 12;
      case 'lg':
        return 18;
      default:
        return 14;
    }
  };

  const getCloseIconColor = () => {
    switch (variant) {
      case 'primary':
        return '#818cf8';
      case 'success':
        return '#4ade80';
      case 'danger':
        return '#f87171';
      case 'warning':
        return '#fbbf24';
      default:
        return '#94a3b8';
    }
  };

  const content = (
    <>
      <Text className={styles.text()}>{label}</Text>
      {onClose && (
        <Pressable
          className={styles.closeButton()}
          onPress={onClose}
          disabled={disabled}
          hitSlop={8}
        >
          <X size={getCloseIconSize()} color={getCloseIconColor()} strokeWidth={2.5} />
        </Pressable>
      )}
    </>
  );

  if (onPress) {
    return (
      <Pressable
        className={`${styles.root()} ${disabled ? 'opacity-50' : ''}`}
        onPress={onPress}
        disabled={disabled}
      >
        {content}
      </Pressable>
    );
  }

  return <View className={`${styles.root()} ${disabled ? 'opacity-50' : ''}`}>{content}</View>;
};

export { chipVariants };
