import type { ReactNode } from 'react';
import { Pressable, Text } from 'react-native';

interface TestButtonProps {
  children: ReactNode;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
}

export function TestButton({ children, onPress, variant = 'primary' }: TestButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`rounded-lg px-6 py-3 active:opacity-80 ${
        variant === 'primary' ? 'bg-primary-600' : 'bg-gray-200'
      }`}
    >
      <Text
        className={`text-center font-semibold text-base ${
          variant === 'primary' ? 'text-white' : 'text-gray-900'
        }`}
      >
        {children}
      </Text>
    </Pressable>
  );
}
