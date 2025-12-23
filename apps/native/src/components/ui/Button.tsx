/**
 * @fileoverview Button component with UniWind styling
 * @module @kakeibo/native/components/ui
 *
 * Reusable button component with multiple variants, sizes, and states.
 * Uses HeroUI Native Button as base with custom variants.
 */

import { tv, type VariantProps } from '@kakeibo/core';
import type React from 'react';
import { ActivityIndicator, Pressable, type PressableProps, Text } from 'react-native';

const buttonVariants = tv({
  base: 'rounded-xl flex-row items-center justify-center',
  variants: {
    variant: {
      primary: 'bg-primary-500 active:bg-primary-600',
      secondary: 'bg-surface-700 active:bg-surface-600',
      danger: 'bg-danger-500 active:bg-danger-600',
      success: 'bg-success-500 active:bg-success-600',
      ghost: 'bg-transparent active:bg-surface-800/50',
      outline: 'bg-transparent border border-surface-600 active:bg-surface-800/30',
    },
    size: {
      sm: 'px-3 py-2 min-h-8',
      md: 'px-4 py-3 min-h-11',
      lg: 'px-6 py-4 min-h-13',
    },
    fullWidth: {
      true: 'w-full',
      false: 'self-start',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
    fullWidth: false,
  },
});

const textVariants = tv({
  base: '',
  variants: {
    variant: {
      primary: 'text-white',
      secondary: 'text-surface-100',
      danger: 'text-white',
      success: 'text-white',
      ghost: 'text-primary-400',
      outline: 'text-surface-100',
    },
    size: {
      sm: 'text-sm font-medium',
      md: 'text-base font-semibold',
      lg: 'text-lg font-bold',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});

export interface ButtonProps
  extends Omit<PressableProps, 'children'>,
    VariantProps<typeof buttonVariants> {
  /** Button content */
  children: React.ReactNode;

  /** Loading state (shows spinner) */
  loading?: boolean;
}

/**
 * Button component
 *
 * @example
 * <Button variant="primary" size="md" onPress={handlePress}>
 *   Save Changes
 * </Button>
 *
 * @example
 * <Button variant="danger" loading>
 *   Deleting...
 * </Button>
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  variant,
  size,
  disabled = false,
  loading = false,
  fullWidth,
  ...props
}) => {
  const isDisabled = disabled || loading;
  const buttonClass = buttonVariants({ variant, size, fullWidth });
  const textClass = textVariants({ variant, size });

  return (
    <Pressable
      className={`${buttonClass} ${isDisabled ? 'opacity-50' : ''}`}
      disabled={isDisabled}
      {...props}
    >
      {loading && (
        <ActivityIndicator
          size="small"
          color={variant === 'ghost' || variant === 'outline' ? '#5B6EF5' : '#ffffff'}
          style={{ marginRight: 8 }}
        />
      )}
      <Text className={textClass}>{children}</Text>
    </Pressable>
  );
};

export { buttonVariants };
