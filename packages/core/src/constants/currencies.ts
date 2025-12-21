/**
 * @fileoverview Currency codes and symbols
 * @module @kakeibo/core/constants
 *
 * Provides currency codes, symbols, and formatting information.
 * Supports major global currencies.
 *
 * Platform: Platform-agnostic (core)
 */

/**
 * Currency information
 */
export interface CurrencyInfo {
  /** Currency code (ISO 4217) */
  code: string;

  /** Currency symbol */
  symbol: string;

  /** Currency name */
  name: string;

  /** Number of decimal places */
  decimals: number;

  /** Symbol position ('before' | 'after') */
  symbolPosition: 'before' | 'after';
}

/**
 * Supported currencies with their display information
 *
 * Covers major global currencies:
 * - US Dollar, Euro, British Pound
 * - Japanese Yen, Chinese Yuan, Indian Rupee
 * - Canadian Dollar, Australian Dollar
 * - Swiss Franc, Brazilian Real
 */
export const currencies: Record<string, CurrencyInfo> = {
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    decimals: 2,
    symbolPosition: 'before',
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    decimals: 2,
    symbolPosition: 'before',
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    decimals: 2,
    symbolPosition: 'before',
  },
  JPY: {
    code: 'JPY',
    symbol: '¥',
    name: 'Japanese Yen',
    decimals: 0,
    symbolPosition: 'before',
  },
  CNY: {
    code: 'CNY',
    symbol: '¥',
    name: 'Chinese Yuan',
    decimals: 2,
    symbolPosition: 'before',
  },
  INR: {
    code: 'INR',
    symbol: '₹',
    name: 'Indian Rupee',
    decimals: 2,
    symbolPosition: 'before',
  },
  CAD: {
    code: 'CAD',
    symbol: 'C$',
    name: 'Canadian Dollar',
    decimals: 2,
    symbolPosition: 'before',
  },
  AUD: {
    code: 'AUD',
    symbol: 'A$',
    name: 'Australian Dollar',
    decimals: 2,
    symbolPosition: 'before',
  },
  CHF: {
    code: 'CHF',
    symbol: 'CHF',
    name: 'Swiss Franc',
    decimals: 2,
    symbolPosition: 'before',
  },
  BRL: {
    code: 'BRL',
    symbol: 'R$',
    name: 'Brazilian Real',
    decimals: 2,
    symbolPosition: 'before',
  },
  MXN: {
    code: 'MXN',
    symbol: '$',
    name: 'Mexican Peso',
    decimals: 2,
    symbolPosition: 'before',
  },
  ZAR: {
    code: 'ZAR',
    symbol: 'R',
    name: 'South African Rand',
    decimals: 2,
    symbolPosition: 'before',
  },
};

/**
 * Currency codes array for dropdowns
 * Sorted alphabetically by code
 */
export const currencyCodes = Object.keys(currencies).sort();

/**
 * Currency options for UI select components
 * Formatted as { value, label } pairs with symbols
 *
 * @example
 * ```tsx
 * <Select options={currencyOptions} />
 * ```
 */
export const currencyOptions = currencyCodes.map((code) => ({
  value: code,
  label: `${code} (${currencies[code].symbol})`,
}));

/**
 * Get currency symbol by code
 *
 * @param code - Currency code (e.g., 'USD', 'EUR')
 * @returns Currency symbol or code if not found
 *
 * @example
 * ```ts
 * getCurrencySymbol('USD'); // Returns: '$'
 * getCurrencySymbol('EUR'); // Returns: '€'
 * getCurrencySymbol('XYZ'); // Returns: 'XYZ' (fallback)
 * ```
 */
export function getCurrencySymbol(code: string): string {
  return currencies[code]?.symbol || code;
}

/**
 * Get currency info by code
 *
 * @param code - Currency code
 * @returns Currency info object or undefined
 *
 * @example
 * ```ts
 * const info = getCurrencyInfo('USD');
 * console.log(info?.name); // 'US Dollar'
 * console.log(info?.decimals); // 2
 * ```
 */
export function getCurrencyInfo(code: string): CurrencyInfo | undefined {
  return currencies[code];
}

/**
 * Check if a currency code is supported
 *
 * @param code - Currency code to check
 * @returns True if currency is supported
 */
export function isSupportedCurrency(code: string): boolean {
  return code in currencies;
}
