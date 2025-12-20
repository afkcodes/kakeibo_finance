/**
 * @fileoverview User and UserSettings type definitions
 * @module @kakeibo/core/types
 *
 * Defines the User entity and user preferences/settings.
 * Settings control app behavior, localization, and notification preferences.
 *
 * Platform: Platform-agnostic (core)
 */

/**
 * User settings and preferences
 * Controls app behavior and personalization
 */
export interface UserSettings {
  /** Preferred currency code (e.g., "USD", "EUR", "INR") */
  currency: string;

  /** Preferred date format (e.g., "MM/dd/yyyy", "dd/MM/yyyy") */
  dateFormat: string;

  /** Theme preference */
  theme: 'light' | 'dark' | 'system';

  /** Language code (e.g., "en", "es", "fr") */
  language: string;

  /** Financial month start day (1-31) for custom month calculations */
  financialMonthStart: number;

  /** Notification preferences */
  notifications: {
    /** Budget threshold alerts */
    budgetAlerts: boolean;

    /** Upcoming bill reminders */
    billReminders: boolean;

    /** Weekly summary reports */
    weeklyReports: boolean;

    /** Unusual spending pattern alerts */
    unusualSpending: boolean;
  };
}

/**
 * User entity
 * Represents a user of the application (guest or authenticated)
 */
export interface User {
  /** Unique identifier */
  id: string;

  /** User email (may be empty for guest users) */
  email: string;

  /** Display name */
  displayName: string;

  /** Profile photo URL (optional) */
  photoURL?: string;

  /** User preferences and settings */
  settings: UserSettings;

  /** Account creation timestamp */
  createdAt: Date;

  /** Last update timestamp */
  updatedAt: Date;
}

/**
 * Default settings for new users
 * Applied when a new user account is created
 */
