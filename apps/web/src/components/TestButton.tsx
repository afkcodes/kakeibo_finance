import type { ReactNode } from 'react';

interface TestButtonProps {
  children: ReactNode;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
}

export function TestButton({ children, onPress, variant = 'primary' }: TestButtonProps) {
  return (
    <button
      type="button"
      onClick={onPress}
      className={`rounded-lg px-6 py-3 font-semibold text-base transition-opacity hover:opacity-90 active:opacity-80 ${
        variant === 'primary' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-900'
      }`}
    >
      {children}
    </button>
  );
}
