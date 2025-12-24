/**
 * @fileoverview SquircleView component - Reusable Squircle wrapper
 * @module @kakeibo/native/components/ui
 *
 * A wrapper around react-native-fast-squircle with sensible defaults.
 * Use this instead of raw Squircle for consistent styling across the app.
 *
 * IMPORTANT: Squircle only supports inline styles, NOT Tailwind className.
 */

import type React from 'react';
import type { ViewStyle } from 'react-native';
import Squircle from 'react-native-fast-squircle';

export interface SquircleViewProps {
  /** Child elements */
  children?: React.ReactNode;

  /** Corner smoothing (0-1, default: 1 for maximum smoothing) */
  cornerSmoothing?: number;

  /** Border radius in pixels (default: 16) */
  borderRadius?: number;

  /** Background color (default: transparent) */
  backgroundColor?: string;

  /** Border width (default: 0) */
  borderWidth?: number;

  /** Border color (default: transparent) */
  borderColor?: string;

  /** Additional inline styles (merged with defaults) */
  style?: ViewStyle;

  /** Additional Squircle props */
  [key: string]: unknown;
}

/**
 * SquircleView - Reusable Squircle wrapper with defaults
 *
 * @example
 * <SquircleView backgroundColor="#5b6ef5" borderRadius={12}>
 *   <Text>Content</Text>
 * </SquircleView>
 *
 * @example
 * <SquircleView
 *   backgroundColor="rgba(24, 24, 27, 0.8)"
 *   borderWidth={1}
 *   borderColor="rgba(63, 63, 70, 1)"
 *   style={{ padding: 16, gap: 8 }}
 * >
 *   <Icon />
 *   <Text>Label</Text>
 * </SquircleView>
 */
export const SquircleView: React.FC<SquircleViewProps> = ({
  children,
  cornerSmoothing = 1,
  borderRadius = 12,
  backgroundColor = 'transparent',
  borderWidth = 0,
  borderColor = 'transparent',
  style,
  ...props
}) => {
  return (
    <Squircle
      cornerSmoothing={cornerSmoothing}
      style={{
        backgroundColor,
        borderRadius,
        borderWidth,
        borderColor,
        ...style,
      }}
      {...props}
    >
      {children}
    </Squircle>
  );
};
