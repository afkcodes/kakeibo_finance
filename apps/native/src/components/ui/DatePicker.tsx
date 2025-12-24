/**
 * @fileoverview DatePicker component
 * @module @kakeibo/native/components/ui
 *
 * Date picker using @react-native-community/datetimepicker
 */

import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar } from 'lucide-react-native';
import type React from 'react';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

export interface DatePickerProps {
  /** Current selected date */
  value: Date | null;

  /** Change handler */
  onChange: (date: Date | null) => void;

  /** Label text */
  label?: string;

  /** Error message */
  error?: string;

  /** Disabled state */
  disabled?: boolean;

  /** Minimum date */
  minimumDate?: Date;

  /** Maximum date */
  maximumDate?: Date;
}

/**
 * DatePicker component
 *
 * @example
 * <DatePicker
 *   label="Date"
 *   value={date}
 *   onChange={setDate}
 * />
 */
export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  label,
  error,
  disabled = false,
  minimumDate,
  maximumDate,
}) => {
  const [show, setShow] = useState(false);

  const formatDate = (date: Date | null) => {
    if (!date) return 'Select date';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleChange = (_event: unknown, selectedDate?: Date) => {
    setShow(false);
    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  return (
    <View className="w-full">
      {label && <Text className="text-surface-200 text-sm font-medium mb-1.5">{label}</Text>}

      <Pressable
        className={`bg-surface-800 border rounded-lg px-3.5 py-3 flex-row items-center justify-between ${
          error ? 'border-danger-500' : 'border-surface-700'
        } ${disabled ? 'opacity-50' : 'active:opacity-70'}`}
        onPress={() => !disabled && setShow(true)}
        disabled={disabled}
      >
        <Text className={`text-base flex-1 ${value ? 'text-surface-100' : 'text-surface-400'}`}>
          {formatDate(value)}
        </Text>
        <Calendar size={20} color="#94a3b8" strokeWidth={2} />
      </Pressable>

      {error && <Text className="text-danger-400 text-xs mt-1.5">{error}</Text>}

      {show && (
        <DateTimePicker
          value={value || new Date()}
          mode="date"
          display="default"
          design="material"
          onChange={handleChange}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
        />
      )}
    </View>
  );
};
