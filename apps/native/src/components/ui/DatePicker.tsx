/**
 * @fileoverview DatePicker component
 * @module @kakeibo/native/components/ui
 *
 * Date picker with modal trigger using @s77rt/react-native-date-picker
 */

import type { DatePickerHandle } from '@s77rt/react-native-date-picker';
import { DatePicker as NativeDatePicker } from '@s77rt/react-native-date-picker';
import { Calendar } from 'lucide-react-native';
import type React from 'react';
import { useMemo, useRef } from 'react';
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
  const pickerRef = useRef<DatePickerHandle>(null);

  const formatDate = (date: Date | null) => {
    if (!date) return 'Select date';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Dark theme styles
  const pickerStyles = useMemo(
    () => ({
      accentColor: '#5B6EF5', // primary-500 for selected dates and buttons
      containerColor: '#303030', // surface-950
      titleContentColor: '#e2e8f0', // surface-100
      headlineContentColor: '#e2e8f0', // surface-100
      weekdayContentColor: '#94a3b8', // surface-400
      subheadContentColor: '#cbd5e1', // surface-200
      navigationContentColor: '#e2e8f0', // surface-100
      yearContentColor: '#e2e8f0', // surface-100
      currentYearContentColor: '#5B6EF5', // primary-500
      selectedYearContentColor: '#ffffff', // white
      selectedYearContainerColor: '#5B6EF5', // primary-500
      dayContentColor: '#e2e8f0', // surface-100
      disabledDayContentColor: '#64748b', // surface-500
      selectedDayContentColor: '#ffffff', // white
      selectedDayContainerColor: '#5B6EF5', // primary-500
      todayContentColor: '#5B6EF5', // primary-500
      todayDateBorderColor: '#5B6EF5', // primary-500
      dividerColor: '#454545', // surface-700
    }),
    []
  );

  const pickerOptions = useMemo(
    () => ({
      confirmText: 'OK',
      cancelText: 'Cancel',
    }),
    []
  );

  return (
    <View className="w-full">
      {label && <Text className="text-surface-200 text-sm font-medium mb-1.5">{label}</Text>}

      <Pressable
        className={`bg-surface-800 border rounded-lg px-3.5 py-3 flex-row items-center justify-between ${
          error ? 'border-danger-500' : 'border-surface-700'
        } ${disabled ? 'opacity-50' : 'active:opacity-70'}`}
        onPress={() => !disabled && pickerRef.current?.showPicker()}
        disabled={disabled}
      >
        <Text className={`text-base flex-1 ${value ? 'text-surface-100' : 'text-surface-400'}`}>
          {formatDate(value)}
        </Text>
        <Calendar size={20} color="#94a3b8" strokeWidth={2} />
      </Pressable>

      {error && <Text className="text-danger-400 text-xs mt-1.5">{error}</Text>}

      <NativeDatePicker
        ref={pickerRef}
        type="date"
        value={value}
        onChange={onChange}
        min={minimumDate}
        max={maximumDate}
        styles={pickerStyles}
        options={pickerOptions}
      />
    </View>
  );
};
