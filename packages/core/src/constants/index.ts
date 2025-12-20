/**
 * @fileoverview Constants barrel export
 * @module @kakeibo/core/constants
 *
 * Central export point for all constants in the core package.
 *
 * Platform: Platform-agnostic (core)
 *
 * @example
 * ```ts
 * // Import specific constants
 * import { defaultExpenseCategories, DEFAULT_ALERT_THRESHOLDS } from '@kakeibo/core/constants';
 *
 * // Or import everything
 * import * as constants from '@kakeibo/core/constants';
 * ```
 */

// Category constants
export * from './categories';

// Currency constants
export * from './currencies';
// Default values and configuration
export * from './defaults';
// Icon constants
export * from './icons';
