/**
 * @fileoverview Category type definitions and default categories
 * @module @kakeibo/core/types
 *
 * Defines the Category entity used for classifying transactions.
 * Includes comprehensive default category sets for both expenses and income.
 *
 * Platform: Platform-agnostic (core)
 */

/**
 * Category types - determines if category is for expenses or income
 */
export type CategoryType = 'expense' | 'income';

/**
 * Category entity for transaction classification
 *
 * Categories help organize and analyze spending/income patterns.
 * Supports hierarchical structure via parentId.
 */
export interface Category {
  /** Unique identifier */
  id: string;

  /** Owner user ID */
  userId: string;

  /** Category name */
  name: string;

  /** Type - expense or income */
  type: CategoryType;

  /** Display color (hex format) */
  color: string;

  /** Icon name for UI display */
  icon: string;

  /** Parent category ID for hierarchical structure */
  parentId?: string;

  /** Whether this is a default category (cannot be deleted) */
  isDefault: boolean;

  /** Display order */
  order: number;
}

/**
 * Input for creating a new category
 */
