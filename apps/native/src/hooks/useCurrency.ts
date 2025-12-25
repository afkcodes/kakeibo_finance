/**
 * @fileoverview Currency formatter hook
 * @module @kakeibo/native/hooks/useCurrency
 *
 * Provides currency formatting using @kakeibo/core utilities.
 * Reuses formatCurrency and getCurrencySymbol from core package (DRY principle).
 */

import { formatCurrency, getCurrencySymbol } from '@kakeibo/core';
import { useMemo } from 'react';
import { useSettings } from '../store/appStore';

interface UseCurrencyResult {
  formatCurrency: (amount: number) => string;
  currency: string;
  currencySymbol: string;
}

/**
 * Currency formatter hook
 *
 * Uses user's currency preference from app settings.
 * Delegates to @kakeibo/core utilities (formatCurrency, getCurrencySymbol).
 *
 * @example
 * ```tsx
 * const { formatCurrency, currency } = useCurrency();
 * <Text>{formatCurrency(1234.56)}</Text> // "$1,234.56"
 * ```
 */
export function useCurrency(): UseCurrencyResult {
  const settings = useSettings();

  const currencySymbol = useMemo(() => getCurrencySymbol(settings.currency), [settings.currency]);

  const formatter = useMemo(
    () => (amount: number) => formatCurrency(amount, settings.currency),
    [settings.currency]
  );

  return {
    formatCurrency: formatter,
    currency: settings.currency,
    currencySymbol,
  };
}
