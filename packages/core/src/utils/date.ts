/**
 * @fileoverview Date utility functions
 * @module @kakeibo/core/utils
 *
 * Provides date manipulation utilities for financial month calculations,
 * period ranges, and date comparisons.
 *
 * Platform: Platform-agnostic (core)
 */

import {
  differenceInDays,
  endOfWeek,
  addDays as fnsAddDays,
  addMonths as fnsAddMonths,
  addYears as fnsAddYears,
  isSameDay as fnsIsSameDay,
  parseISO,
  startOfWeek,
} from 'date-fns';

/**
 * Calculate the start date of a financial month
 *
 * Financial months can start on any day (1-28). This is useful for users
 * who get paid mid-month or want to track budgets from a specific day.
 *
 * @param date - Reference date
 * @param startDay - Day of month to start (1-28, capped to avoid month overflow)
 * @returns Start date of the financial month containing the reference date
 *
 * @example
 * ```ts
 * // User's financial month starts on the 15th
 * const today = new Date('2024-12-20');
 * const start = financialMonthStartDate(today, 15);
 * // Returns: Dec 15, 2024 (current period)
 *
 * const earlyMonth = new Date('2024-12-10');
 * const start2 = financialMonthStartDate(earlyMonth, 15);
 * // Returns: Nov 15, 2024 (previous period, since Dec 10 < Dec 15)
 * ```
 */
export function financialMonthStartDate(date: Date, startDay: number): Date {
  // Validate and clamp startDay to 1-28
  const day = Math.max(1, Math.min(28, Math.floor(startDay)));

  const d = new Date(date.getTime());
  const year = d.getFullYear();
  const month = d.getMonth();

  // If startDay is 1, it's the calendar month
  if (day === 1) {
    return new Date(year, month, 1);
  }

  // If today's date is >= startDay, the financial month starts this calendar month
  if (d.getDate() >= day) {
    return new Date(year, month, day);
  }

  // Otherwise it started in the previous calendar month
  const prev = new Date(year, month - 1, 1);
  const prevYear = prev.getFullYear();
  const prevMonth = prev.getMonth();
  const lastDayPrevMonth = new Date(prevYear, prevMonth + 1, 0).getDate();

  // Handle edge case where previous month has fewer days
  const actualDay = Math.min(day, lastDayPrevMonth);
  return new Date(prevYear, prevMonth, actualDay);
}

/**
 * Calculate the end date of a financial month
 *
 * Returns the last day of the financial period (one day before next period starts).
 *
 * @param date - Reference date
 * @param startDay - Day of month to start (1-28)
 * @returns End date of the financial month containing the reference date
 *
 * @example
 * ```ts
 * const today = new Date('2024-12-20');
 * const end = financialMonthEndDate(today, 15);
 * // Returns: Jan 14, 2025 (day before next period starts)
 * ```
 */
export function financialMonthEndDate(date: Date, startDay: number): Date {
  const start = financialMonthStartDate(date, startDay);
  const day = Math.max(1, Math.min(28, Math.floor(startDay)));

  // Calculate next period start
  const nextPeriodStart = new Date(start.getFullYear(), start.getMonth() + 1, day === 1 ? 1 : day);

  // End is one day before next period starts
  const end = new Date(nextPeriodStart.getTime());
  end.setDate(end.getDate() - 1);

  return end;
}

/**
 * Get date range for a budget period
 *
 * @param period - Period type ('weekly', 'monthly', 'yearly')
 * @param referenceDate - Reference date (defaults to now)
 * @param financialMonthStart - Financial month start day (for monthly periods)
 * @returns Start and end dates for the period
 *
 * @example
 * ```ts
 * const { start, end } = getPeriodRange('weekly');
 * const { start, end } = getPeriodRange('monthly', new Date(), 15);
 * ```
 */
export function getPeriodRange(
  period: 'weekly' | 'monthly' | 'yearly',
  referenceDate: Date = new Date(),
  financialMonthStart: number = 1
): { start: Date; end: Date } {
  const date = new Date(referenceDate.getTime());

  switch (period) {
    case 'weekly': {
      // Week starts on Monday
      const start = startOfWeek(date, { weekStartsOn: 1 });
      const end = endOfWeek(date, { weekStartsOn: 1 });

      return { start, end };
    }

    case 'monthly': {
      const start = financialMonthStartDate(date, financialMonthStart);
      start.setHours(0, 0, 0, 0);

      const end = financialMonthEndDate(date, financialMonthStart);
      end.setHours(23, 59, 59, 999);

      return { start, end };
    }

    case 'yearly': {
      const start = new Date(date.getFullYear(), 0, 1, 0, 0, 0, 0);
      const end = new Date(date.getFullYear(), 11, 31, 23, 59, 59, 999);

      return { start, end };
    }
  }
}

/**
 * Check if a date is within a period
 *
 * @param date - Date to check
 * @param start - Period start
 * @param end - Period end
 * @returns True if date is within the period (inclusive)
 */
export function isDateInPeriod(date: Date, start: Date, end: Date): boolean {
  const time = date.getTime();
  return time >= start.getTime() && time <= end.getTime();
}

/**
 * Get days remaining in a period
 *
 * @param endDate - Period end date
 * @param referenceDate - Reference date (defaults to now)
 * @returns Number of days remaining (0 if past end date)
 */
export function getDaysRemaining(endDate: Date, referenceDate: Date = new Date()): number {
  const days = differenceInDays(endDate, referenceDate);
  return Math.max(0, days + 1); // +1 to include end date
}

/**
 * Get days elapsed in a period
 *
 * @param startDate - Period start date
 * @param referenceDate - Reference date (defaults to now)
 * @returns Number of days elapsed (minimum 1)
 */
export function getDaysElapsed(startDate: Date, referenceDate: Date = new Date()): number {
  const days = differenceInDays(referenceDate, startDate);
  return Math.max(1, days + 1); // +1 to include start day
}

/**
 * Add days to a date
 *
 * @param date - Starting date
 * @param days - Number of days to add (can be negative)
 * @returns New date with days added
 */
export function addDays(date: Date, days: number): Date {
  return fnsAddDays(date, days);
}

/**
 * Add months to a date
 *
 * @param date - Starting date
 * @param months - Number of months to add (can be negative)
 * @returns New date with months added
 */
export function addMonths(date: Date, months: number): Date {
  return fnsAddMonths(date, months);
}

/**
 * Add years to a date
 *
 * @param date - Starting date
 * @param years - Number of years to add (can be negative)
 * @returns New date with years added
 */
export function addYears(date: Date, years: number): Date {
  return fnsAddYears(date, years);
}

/**
 * Check if two dates are on the same day
 *
 * @param date1 - First date
 * @param date2 - Second date
 * @returns True if both dates are on the same day
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return fnsIsSameDay(date1, date2);
}

/**
 * Parse ISO date string to Date object
 *
 * @param isoString - ISO date string
 * @returns Date object or null if invalid
 */
export function parseISODate(isoString: string): Date | null {
  try {
    return parseISO(isoString);
  } catch {
    return null;
  }
}
