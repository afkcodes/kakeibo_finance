/**
 * @fileoverview Button component with Squircle styling
 * @module @kakeibo/native/components/ui
 *
 * Reusable button component with multiple variants, sizes, and states.
 * Uses SquircleView for premium iOS-style rounded corners.
 */

import type React from 'react';
import { ActivityIndicator, Pressable, type PressableProps, View } from 'react-native';
import { SquircleView } from './SquircleView';

// Color mappings for variants (can't use Tailwind with Squircle)
const variantColors = {
  primary: {
    background: '#5b6ef5',
    backgroundPressed: '#4c5dd6',
    border: 'transparent',
  },
  secondary: {
    background: '#3f3f46',
    backgroundPressed: '#52525b',
    border: 'transparent',
  },
  danger: {
    background: '#ef4444',
    backgroundPressed: '#dc2626',
    border: 'transparent',
  },
  success: {
    background: '#22c55e',
    backgroundPressed: '#16a34a',
    border: 'transparent',
  },
  ghost: {
    background: 'transparent',
    backgroundPressed: 'rgba(24, 24, 27, 0.5)',
    border: 'transparent',
  },
  outline: {
    background: 'rgba(24, 24, 27, 0.8)',
    backgroundPressed: 'rgba(24, 24, 27, 0.6)',
    border: '#3f3f46',
  },
};

// Size mappings
const sizeStyles = {
  sm: {
    height: 32,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  md: {
    height: 44,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  lg: {
    height: 56,
    paddingHorizontal: 24,
    borderRadius: 14,
  },
};

export interface ButtonProps extends Omit<PressableProps, 'children'> {
  /** Button content */
  children: React.ReactNode;

  /** Button variant */
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost' | 'outline';

  /** Button size */
  size?: 'sm' | 'md' | 'lg';

  /** Full width */
  fullWidth?: boolean;

  /** Loading state (shows spinner) */
  loading?: boolean;
}

/**
 * Button component with Squircle styling
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
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  ...props
}) => {
  const isDisabled = disabled || loading;
  const colors = variantColors[variant];
  const sizeStyle = sizeStyles[size];

  return (
    <Pressable disabled={isDisabled} style={{ opacity: isDisabled ? 0.5 : 1 }} {...props}>
      {({ pressed }) => (
        <SquircleView
          backgroundColor={pressed ? colors.backgroundPressed : colors.background}
          borderRadius={sizeStyle.borderRadius}
          borderWidth={variant === 'outline' ? 1 : 0}
          borderColor={colors.border}
          style={{
            height: sizeStyle.height,
            paddingHorizontal: sizeStyle.paddingHorizontal,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: fullWidth ? '100%' : undefined,
          }}
        >
          {loading && (
            <ActivityIndicator
              size="small"
              color={variant === 'ghost' || variant === 'outline' ? '#5B6EF5' : '#ffffff'}
              style={{ marginRight: 8 }}
            />
          )}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>{children}</View>
        </SquircleView>
      )}
    </Pressable>
  );
};
