/**
 * @fileoverview Checkbox component using HeroUI Checkbox
 * @module @kakeibo/native/components/ui
 *
 * Checkbox input with label support.
 * Uses HeroUI Checkbox as base.
 */

import { Check } from 'lucide-react-native';
import type React from 'react';
import { Pressable, Text, View } from 'react-native';

export interface CheckboxProps {
  /** Checked state */
  checked?: boolean;

  /** Change handler */
  onCheckedChange?: (checked: boolean) => void;

  /** Label text */
  label?: string;

  /** Disabled state */
  disabled?: boolean;

  /** Invalid state */
  invalid?: boolean;
}

/**
 * Checkbox component
 *
 * @example
 * <Checkbox
 *   checked={isChecked}
 *   onCheckedChange={setIsChecked}
 *   label="Accept terms"
 * />
 */
export const Checkbox: React.FC<CheckboxProps> = ({
  checked = false,
  onCheckedChange,
  label,
  disabled = false,
  invalid = false,
}) => {
  const handlePress = () => {
    if (!disabled && onCheckedChange) {
      onCheckedChange(!checked);
    }
  };

  const boxClasses = `w-5 h-5 rounded border-2 items-center justify-center ${
    checked
      ? invalid
        ? 'bg-danger-500 border-danger-500'
        : 'bg-primary-500 border-primary-500'
      : invalid
        ? 'bg-transparent border-danger-500'
        : 'bg-transparent border-surface-600'
  }`;

  if (!label) {
    return (
      <Pressable onPress={handlePress} disabled={disabled} className={disabled ? 'opacity-50' : ''}>
        <View className={boxClasses}>
          {checked && <Check size={14} color="#ffffff" strokeWidth={3} />}
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable
      className={`flex-row items-center gap-2 ${disabled ? 'opacity-50' : ''}`}
      onPress={handlePress}
      disabled={disabled}
    >
      <View className={boxClasses}>
        {checked && <Check size={14} color="#ffffff" strokeWidth={3} />}
      </View>
      <Text className="text-surface-200 text-sm flex-1">{label}</Text>
    </Pressable>
  );
};
