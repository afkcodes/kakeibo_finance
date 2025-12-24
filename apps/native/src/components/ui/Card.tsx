/**
 * @fileoverview Card component with UniWind styling
 * @module @kakeibo/native/components/ui
 *
 * Container component with elevation and padding variants.
 * Uses HeroUI Native Card as base with custom variants.
 */

import { tv, type VariantProps } from '@kakeibo/core';
import type React from 'react';
import { Pressable, type PressableProps, type ViewProps } from 'react-native';
import Squircle from 'react-native-fast-squircle';

const cardVariants = tv({
  base: 'bg-surface-900 border border-surface-800',
  variants: {
    variant: {
      default: '',
      elevated: 'shadow-lg',
      outlined: 'border-surface-700',
    },
    padding: {
      none: '',
      sm: 'p-2',
      md: 'p-4',
      lg: 'p-6',
    },
  },
  defaultVariants: {
    variant: 'default',
    padding: 'md',
  },
});

export interface CardProps extends Omit<ViewProps, 'children'>, VariantProps<typeof cardVariants> {
  /** Card content */
  children: React.ReactNode;

  /** Optional press handler - makes card pressable */
  onPress?: () => void;
}

/**
 * Card component
 *
 * @example
 * <Card variant="elevated" padding="lg">
 *   <Text>Card content</Text>
 * </Card>
 *
 * @example
 * <Card variant="outlined" padding="none" onPress={() => console.log('pressed')}>
 *   <Text>Pressable card</Text>
 * </Card>
 */
export const Card: React.FC<CardProps> = ({
  children,
  variant,
  padding,
  onPress,
  className,
  ...props
}) => {
  const cardClass = cardVariants({ variant, padding });

  if (onPress) {
    return (
      <Pressable onPress={onPress} {...(props as PressableProps)}>
        <Squircle
          cornerSmoothing={1}
          style={{ backgroundColor: '#18181b', borderRadius: 16 }}
          className={`${cardClass} active:opacity-80`}
        >
          {children}
        </Squircle>
      </Pressable>
    );
  }

  return (
    <Squircle
      cornerSmoothing={1}
      style={{ backgroundColor: '#18181b', borderRadius: 16 }}
      className={cardClass}
      {...props}
    >
      {children}
    </Squircle>
  );
};

export { cardVariants };
