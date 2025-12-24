/**
 * @fileoverview Select component with bottom sheet
 * @module @kakeibo/native/components/ui
 *
 * Select dropdown using bottom sheet for mobile.
 */

import { Check, ChevronDown } from 'lucide-react-native';
import type React from 'react';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Modal } from './Modal';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  /** Current selected value */
  value?: string;

  /** Change handler */
  onValueChange: (value: string) => void;

  /** Available options */
  options: SelectOption[];

  /** Label text */
  label?: string;

  /** Placeholder when no value selected */
  placeholder?: string;

  /** Error message */
  error?: string;

  /** Disabled state */
  disabled?: boolean;
}

/**
 * Select component
 *
 * @example
 * <Select
 *   label="Category"
 *   value={categoryId}
 *   onValueChange={setCategoryId}
 *   options={categories.map(c => ({ value: c.id, label: c.name }))}
 *   placeholder="Select category"
 * />
 */
export const Select: React.FC<SelectProps> = ({
  value,
  onValueChange,
  options,
  label,
  placeholder = 'Select...',
  error,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find((opt) => opt.value === value);

  const handleSelect = (optionValue: string) => {
    onValueChange(optionValue);
    setIsOpen(false);
  };

  return (
    <View className="w-full">
      {label && <Text className="text-surface-200 text-sm font-medium mb-1">{label}</Text>}

      <Pressable
        className={`bg-surface-800/60 border rounded-lg px-3 py-2.5 flex-row items-center justify-between ${
          error ? 'border-danger-500' : 'border-surface-700'
        } ${disabled ? 'opacity-50' : ''}`}
        onPress={() => !disabled && setIsOpen(true)}
        disabled={disabled}
      >
        <Text
          className={`text-base flex-1 ${selectedOption ? 'text-surface-100' : 'text-surface-500'}`}
        >
          {selectedOption?.label || placeholder}
        </Text>
        <ChevronDown size={20} color="#64748b" />
      </Pressable>

      {error && <Text className="text-danger-400 text-xs mt-1">{error}</Text>}

      <Modal visible={isOpen} onClose={() => setIsOpen(false)} title={label || 'Select option'}>
        <ScrollView className="max-h-96">
          {options.map((option) => (
            <Pressable
              key={option.value}
              className="flex-row items-center justify-between py-3 px-4 border-b border-surface-800 active:bg-surface-800/50"
              onPress={() => handleSelect(option.value)}
            >
              <Text className="text-surface-100 text-base flex-1">{option.label}</Text>
              {option.value === value && <Check size={20} color="#5B6EF5" />}
            </Pressable>
          ))}
        </ScrollView>
      </Modal>
    </View>
  );
};
