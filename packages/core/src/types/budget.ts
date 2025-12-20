/**
 * @fileoverview Budget type definitions and utilities
 * @module @kakeibo/core/types
 *
 * Defines the Budget entity for tracking spending limits across categories.
 * Supports multi-category budgets, rollover, and alert thresholds.
 *
 * Platform: Platform-agnostic (core)
 */

/**
 * Budget time periods
 */
export type BudgetPeriod = 'weekly' | 'monthly' | 'yearly';

/**
 * Alert threshold configuration
 * Defines at what spending percentages the user should be notified
 */
export interface BudgetAlertConfig {
  /** Alert thresholds as percentages (e.g., [50, 80, 100]) */
  thresholds: number[];

  /** Whether alerts are enabled */
  enabled: boolean;
}

/**
 * Budget entity representing a spending limit
 *
 * Multi-category support:
 * - categoryIds: array of category IDs to track together
 * - Useful for grouping related spending (e.g., "Entertainment" budget covering Movies, Games, Streaming)
 */
export interface Budget {
  /** Unique identifier */
  id: string;

  /** Owner user ID */
  userId: string;

  // Identification
  /** User-defined budget name (required) */
  name: string;

  // Category targeting (supports multiple categories)
  /** Array of category IDs to track together */
  categoryIds: string[];

  // Budget configuration
  /** Budget limit amount */
  amount: number;

  /** Current spent amount (cached for performance, recalculated) */
  spent: number;

  /** Budget time period */
  period: BudgetPeriod;

  /** Budget start date */
  startDate: Date;

  /** Optional budget end date */
  endDate?: Date;

  // Features
  /** Carry unused amount to next period */
  rollover: boolean;

  /** Alert configuration */
  alerts: BudgetAlertConfig;

  /** Enable/disable budget tracking */
  isActive: boolean;

  // Metadata
  /** Creation timestamp */
  createdAt: Date;

  /** Last update timestamp */
  updatedAt: Date;
}

/**
 * Budget progress calculation result
 * Contains all calculated metrics for displaying budget status
 */
export interface BudgetProgress {
  /** The budget being tracked */
  budget: Budget;

  /** Amount spent so far */
  spent: number;

  /** Amount remaining */
  remaining: number;

  /** Percentage spent (0-100+) */
  percentage: number;

  /** Whether budget is exceeded */
  isOverBudget: boolean;

  /** Whether any warning threshold is exceeded */
  isWarning: boolean;

  /** List of exceeded alert thresholds */
  activeAlerts: number[];

  /** Days remaining in period */
  daysRemaining: number;

  /** Total days in period */
  totalDays: number;

  /** Daily budget allowance */
  dailyBudget: number;

  /** Average daily spending so far */
  dailyAverage: number;

  /** Projected total spending at current rate */
  projectedSpending: number;

  /** Projected remaining at end of period */
  projectedRemaining: number;
}

/**
 * Budget template for quick budget creation
 */
export interface BudgetTemplate {
  /** Template ID */
  id: string;

  /** Template name */
  name: string;

  /** Template description */
  description: string;

  /** Category allocations */
  allocations: {
    /** Category ID */
    categoryId: string;

    /** Percentage of total budget */
    percentage: number;
  }[];
}
