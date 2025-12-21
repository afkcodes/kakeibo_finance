/**
 * @fileoverview Default values and configuration constants
 * @module @kakeibo/core/constants
 *
 * Provides default values for user settings, budgets, colors, and other configurations.
 * These are used when creating new entities or initializing user accounts.
 *
 * Platform: Platform-agnostic (core)
 */

import type { BudgetTemplate } from '../types/budget';
import type { UserSettings } from '../types/user';

/**
 * Default user settings
 * Applied when a new user account is created
 */
export const defaultUserSettings: UserSettings = {
  currency: 'USD',
  dateFormat: 'MM/dd/yyyy',
  theme: 'system',
  language: 'en',
  financialMonthStart: 1,
  notifications: {
    budgetAlerts: true,
    billReminders: true,
    weeklyReports: true,
    unusualSpending: true,
  },
};

/**
 * Default budget alert thresholds
 * Users get notified when they reach 50%, 80%, and 100% of their budget
 */
export const DEFAULT_ALERT_THRESHOLDS = [50, 80, 100];

/**
 * Default color palette for categories, accounts, and goals
 * Handpicked colors that work well on both light and dark backgrounds
 */
export const defaultColors = [
  '#22c55e', // Green
  '#ef4444', // Red
  '#f97316', // Orange
  '#06b6d4', // Cyan
  '#eab308', // Yellow
  '#ec4899', // Pink
  '#6366f1', // Indigo
  '#9333ea', // Purple
  '#0ea5e9', // Sky Blue
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#8b5cf6', // Violet
  '#3b82f6', // Blue
  '#14b8a6', // Teal
  '#f43f5e', // Rose
  '#a855f7', // Fuchsia
];

/**
 * Predefined budget templates for quick setup
 * Based on popular budgeting methodologies
 */
export const defaultBudgetTemplates: Omit<BudgetTemplate, 'id'>[] = [
  {
    name: '50/30/20 Rule',
    description: '50% Needs, 30% Wants, 20% Savings',
    allocations: [
      { categoryId: 'needs', percentage: 50 },
      { categoryId: 'wants', percentage: 30 },
      { categoryId: 'savings', percentage: 20 },
    ],
  },
  {
    name: '60/20/20 Rule',
    description: '60% Essentials, 20% Financial Goals, 20% Flexible',
    allocations: [
      { categoryId: 'essentials', percentage: 60 },
      { categoryId: 'goals', percentage: 20 },
      { categoryId: 'flexible', percentage: 20 },
    ],
  },
  {
    name: 'Zero-Based Budget',
    description: 'Every dollar has a job',
    allocations: [],
  },
];

/**
 * Default date formats for different locales
 */
export const dateFormats = {
  'en-US': 'MM/dd/yyyy',
  'en-GB': 'dd/MM/yyyy',
  'de-DE': 'dd.MM.yyyy',
  'fr-FR': 'dd/MM/yyyy',
  'ja-JP': 'yyyy/MM/dd',
  'zh-CN': 'yyyy-MM-dd',
  'es-ES': 'dd/MM/yyyy',
  'pt-BR': 'dd/MM/yyyy',
  'it-IT': 'dd/MM/yyyy',
} as const;

/**
 * Date format options for UI select components
 * Derived from unique values in dateFormats
 *
 * @example
 * ```tsx
 * <Select options={dateFormatOptions} />
 * ```
 */
export const dateFormatOptions = Array.from(new Set(Object.values(dateFormats))).map((format) => ({
  value: format,
  label: format.toUpperCase(),
}));

/**
 * App version (should match package.json)
 */
export const APP_VERSION = '1.0.0';

/**
 * Database version for migrations
 */
export const DB_VERSION = 1;

/**
 * Maximum number of transactions to display per page
 */
export const TRANSACTIONS_PER_PAGE = 50;

/**
 * Maximum number of recent transactions to show on dashboard
 */
export const RECENT_TRANSACTIONS_LIMIT = 5;

/**
 * Maximum number of tags per transaction
 */
export const MAX_TAGS_PER_TRANSACTION = 10;

/**
 * Minimum password length for authentication
 */
export const MIN_PASSWORD_LENGTH = 8;

/**
 * Session timeout in milliseconds (30 days)
 */
export const SESSION_TIMEOUT_MS = 30 * 24 * 60 * 60 * 1000;

/**
 * Cache duration for calculations in milliseconds (5 minutes)
 */
export const CALC_CACHE_DURATION_MS = 5 * 60 * 1000;

/**
 * Default goal icon
 */
export const DEFAULT_GOAL_ICON = 'trending-up';

/**
 * Default goal color
 */
export const DEFAULT_GOAL_COLOR = '#10b981';

/**
 * Default account icon
 */
export const DEFAULT_ACCOUNT_ICON = 'wallet';

/**
 * Default account color
 */
export const DEFAULT_ACCOUNT_COLOR = '#6366f1';

/**
 * Supported languages
 */
export const supportedLanguages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'ja', name: '日本語' },
  { code: 'zh', name: '中文' },
  { code: 'pt', name: 'Português' },
  { code: 'it', name: 'Italiano' },
] as const;

/**
 * Financial month start day options (1-28)
 * Limited to 28 to avoid issues with February
 */
export const financialMonthStartOptions = Array.from({ length: 28 }, (_, i) => i + 1);
