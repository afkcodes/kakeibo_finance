/**
 * @fileoverview Formatting utility functions
 * @module @kakeibo/core/utils
 *
 * Provides formatting utilities for currency, numbers, dates, percentages, and text.
 * Uses Intl API for locale-aware formatting and date-fns for date formatting.
 *
 * Platform: Platform-agnostic (core)
 */

import { format, formatDistance, isToday, isYesterday } from 'date-fns';
import { financialMonthEndDate, financialMonthStartDate } from './date';

/**
 * Format a number as currency
 *
 * @param amount - Amount to format
 * @param currency - Currency code (ISO 4217)
 * @param locale - Locale for formatting (defaults to en-US)
 * @returns Formatted currency string
 *
 * @example
 * ```ts
 * formatCurrency(1234.56, 'USD'); // "$1,234.56"
 * formatCurrency(1234.56, 'EUR', 'de-DE'); // "1.234,56 €"
 * formatCurrency(1234.56, 'INR'); // "₹1,234.56"
 * ```
 */
export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (_error) {
    // Fallback if currency/locale is invalid
    return `${currency} ${amount.toFixed(2)}`;
  }
}

/**
 * Format currency with compact notation for large numbers
 *
 * Shows full number up to 7 digits, then abbreviates (K, M, B, etc.)
 *
 * @param amount - Amount to format
 * @param currency - Currency code
 * @param locale - Locale for formatting
 * @returns Formatted currency string
 *
 * @example
 * ```ts
 * formatCurrencyCompact(1234.56, 'USD'); // "$1,234.56"
 * formatCurrencyCompact(12345678, 'USD'); // "$12.3M"
 * formatCurrencyCompact(1500000, 'USD'); // "$1.5M"
 * ```
 */
export function formatCurrencyCompact(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  const absAmount = Math.abs(amount);

  // If less than 10 million (7 digits), show full number
  if (absAmount < 10000000) {
    return formatCurrency(amount, currency, locale);
  }

  // For larger numbers, use compact notation
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      notation: 'compact',
      compactDisplay: 'short',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(amount);
  } catch (_error) {
    // Fallback
    return formatCurrency(amount, currency, locale);
  }
}

/**
 * Format a number with compact notation
 *
 * @param num - Number to format
 * @param locale - Locale for formatting
 * @returns Formatted number string
 *
 * @example
 * ```ts
 * formatCompactNumber(1234); // "1.2K"
 * formatCompactNumber(1234567); // "1.2M"
 * formatCompactNumber(1234567890); // "1.2B"
 * ```
 */
export function formatCompactNumber(num: number, locale: string = 'en-US'): string {
  try {
    return new Intl.NumberFormat(locale, {
      notation: 'compact',
      compactDisplay: 'short',
    }).format(num);
  } catch (_error) {
    return num.toString();
  }
}

/**
 * Format a percentage
 *
 * @param value - Percentage value (e.g., 75 for 75%)
 * @param decimals - Number of decimal places
 * @returns Formatted percentage string
 *
 * @example
 * ```ts
 * formatPercentage(75); // "75.0%"
 * formatPercentage(75.456, 2); // "75.46%"
 * formatPercentage(100); // "100.0%"
 * ```
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format a number with thousands separator
 *
 * @param num - Number to format
 * @param locale - Locale for formatting
 * @returns Formatted number string
 *
 * @example
 * ```ts
 * formatNumber(1234567); // "1,234,567"
 * formatNumber(1234567, 'de-DE'); // "1.234.567"
 * ```
 */
export function formatNumber(num: number, locale: string = 'en-US'): string {
  try {
    return new Intl.NumberFormat(locale).format(num);
  } catch (_error) {
    return num.toString();
  }
}

/**
 * Format a financial month range
 *
 * Returns a string like "Nov 28 - Dec 27" for the current financial period.
 *
 * @param now - Reference date
 * @param startDay - Financial month start day
 * @param locale - Locale for month names
 * @returns Formatted range string
 *
 * @example
 * ```ts
 * formatFinancialMonthRange(new Date('2024-12-20'), 15);
 * // Returns: "Dec 15 - Jan 14"
 * ```
 */
export function formatFinancialMonthRange(
  now: Date = new Date(),
  startDay: number = 1,
  locale?: string
): string {
  const start = financialMonthStartDate(now, startDay);
  const end = financialMonthEndDate(now, startDay);

  const fmt = (d: Date) => {
    const month = d.toLocaleString(locale || undefined, { month: 'short' });
    return `${month} ${d.getDate()}`;
  };

  return `${fmt(start)} - ${fmt(end)}`;
}

/**
 * Truncate text with ellipsis
 *
 * @param text - Text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text
 *
 * @example
 * ```ts
 * truncateText('Hello World', 5); // "Hello..."
 * truncateText('Hi', 10); // "Hi"
 * ```
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

/**
 * Capitalize first letter of a string
 *
 * @param str - String to capitalize
 * @returns Capitalized string
 *
 * @example
 * ```ts
 * capitalize('hello'); // "Hello"
 * capitalize('WORLD'); // "WORLD"
 * ```
 */
export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Format transaction amount with proper sign
 *
 * @param amount - Transaction amount
 * @param type - Transaction type
 * @param currency - Currency code
 * @param locale - Locale for formatting
 * @returns Formatted amount with sign
 *
 * @example
 * ```ts
 * formatTransactionAmount(100, 'expense', 'USD'); // "−$100.00"
 * formatTransactionAmount(100, 'income', 'USD'); // "+$100.00"
 * formatTransactionAmount(100, 'transfer', 'USD'); // "$100.00"
 * ```
 */
export function formatTransactionAmount(
  amount: number,
  type: 'expense' | 'income' | 'transfer' | 'goal-contribution' | 'goal-withdrawal',
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  const absAmount = Math.abs(amount);
  const formatted = formatCurrency(absAmount, currency, locale);

  switch (type) {
    case 'expense':
    case 'goal-contribution':
      return `−${formatted}`; // Minus sign (U+2212)
    case 'income':
    case 'goal-withdrawal':
      return `+${formatted}`;
    default:
      return formatted;
  }
}

/**
 * Format a relative time string
 *
 * Uses date-fns for smart relative formatting.
 *
 * @param date - Date to format
 * @param now - Reference date (defaults to current time)
 * @returns Relative time string
 *
 * @example
 * ```ts
 * formatRelativeTime(new Date(Date.now() - 60000)); // "1 minute ago"
 * formatRelativeTime(new Date(Date.now() + 86400000)); // "in 1 day"
 * ```
 */
export function formatRelativeTime(date: Date, now: Date = new Date()): string {
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  return formatDistance(date, now, { addSuffix: true });
}

/**
 * Format a date string
 *
 * Uses date-fns for consistent formatting.
 *
 * @param date - Date to format
 * @param formatType - Format type ('short', 'medium', 'long')
 * @returns Formatted date string
 *
 * @example
 * ```ts
 * formatDate(new Date('2024-12-20'), 'short'); // "12/20/2024"
 * formatDate(new Date('2024-12-20'), 'medium'); // "Dec 20, 2024"
 * formatDate(new Date('2024-12-20'), 'long'); // "December 20, 2024"
 * ```
 */
export function formatDate(date: Date, formatType: 'short' | 'medium' | 'long' = 'medium'): string {
  switch (formatType) {
    case 'short':
      return format(date, 'MM/dd/yyyy');
    case 'medium':
      return format(date, 'MMM d, yyyy');
    case 'long':
      return format(date, 'MMMM d, yyyy');
  }
}
