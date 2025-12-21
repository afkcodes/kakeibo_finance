import { useAppStore } from '../store/appStore';

/**
 * Hook for currency formatting
 */
export const useCurrency = () => {
  const { settings } = useAppStore();
  const currency = settings?.currency || 'USD';

  const getCurrencySymbol = (code: string): string => {
    const symbols: Record<string, string> = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      JPY: '¥',
      INR: '₹',
    };
    return symbols[code] || '$';
  };

  const currencySymbol = getCurrencySymbol(currency);

  const formatCurrency = (amount: number): string => {
    const formatted = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Math.abs(amount));

    return `${currencySymbol}${formatted}`;
  };

  const formatCurrencyCompact = (amount: number): string => {
    const abs = Math.abs(amount);

    if (abs >= 1000000) {
      return `${currencySymbol}${(abs / 1000000).toFixed(1)}M`;
    }
    if (abs >= 1000) {
      return `${currencySymbol}${(abs / 1000).toFixed(1)}k`;
    }

    return formatCurrency(amount);
  };

  return {
    formatCurrency,
    formatCurrencyCompact,
    currencySymbol,
    currency,
  };
};
