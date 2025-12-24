/**
 * @fileoverview Input component with UniWind styling
 * @module @kakeibo/native/components/ui
 *
 * Text input component with label, error state, and various keyboard types.
 * Uses HeroUI Native TextField with compound component pattern.
 */

import { tv } from '@kakeibo/core';
import type React from 'react';
import { Text, TextInput, type TextInputProps, View } from 'react-native';
import Squircle from 'react-native-fast-squircle';

const inputVariants = tv({
  slots: {
    container: 'w-full',
    label: 'text-surface-200 text-sm font-medium mb-1',
    input: 'bg-surface-800/60 border px-3 py-2.5 text-surface-100 text-base',
    helperText: 'text-surface-400 text-xs mt-1',
    errorText: 'text-danger-400 text-xs mt-1',
  },
  variants: {
    hasError: {
      true: {
        input: 'border-danger-500',
      },
      false: {
        input: 'border-surface-700',
      },
    },
    disabled: {
      true: {
        input: 'opacity-50',
      },
    },
  },
  defaultVariants: {
    hasError: false,
    disabled: false,
  },
});

export interface InputProps extends Omit<TextInputProps, 'className'> {
  /** Input label */
  label?: string;

  /** Error message */
  error?: string;

  /** Helper text */
  helperText?: string;

  /** Disabled state */
  disabled?: boolean;
}

/**
 * Input component
 *
 * @example
 * <Input
 *   label="Email"
 *   placeholder="Enter your email"
 *   keyboardType="email-address"
 *   value={email}
 *   onChangeText={setEmail}
 * />
 *
 * @example
 * <Input
 *   label="Password"
 *   error="Password is required"
 *   secureTextEntry
 *   value={password}
 *   onChangeText={setPassword}
 * />
 */
export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  disabled = false,
  ...props
}) => {
  const hasError = !!error;
  const styles = inputVariants({ hasError, disabled });

  return (
    <View className={styles.container()}>
      {label && <Text className={styles.label()}>{label}</Text>}
      <Squircle
        cornerSmoothing={1}
        style={{ backgroundColor: 'rgba(39, 39, 42, 0.6)', borderRadius: 12 }}
      >
        <TextInput
          className={styles.input()}
          placeholderTextColor="#737373"
          editable={!disabled}
          {...props}
        />
      </Squircle>
      {error && <Text className={styles.errorText()}>{error}</Text>}
      {!error && helperText && <Text className={styles.helperText()}>{helperText}</Text>}
    </View>
  );
};

export { inputVariants };
