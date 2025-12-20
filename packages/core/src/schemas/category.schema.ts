/**
 * @fileoverview Category validation schemas
 * @module @kakeibo/core/schemas
 *
 * Zod schemas for validating category creation and updates.
 * Supports both expense and income categories with subcategories.
 *
 * Platform: Platform-agnostic (core)
 */

import { z } from 'zod';

/**
 * Schema for creating a new category
 *
 * Validates all required fields for custom categories.
 */
export const createCategorySchema = z.object({
  /** Category name */
  name: z.string().min(1, 'Name is required'),

  /** Category type */
  type: z.enum(['expense', 'income']),

  /** Category color (hex) */
  color: z.string(),

  /** Category icon name */
  icon: z.string(),

  /** Whether this is a default category */
  isDefault: z.boolean().optional(),

  /** Display order */
  order: z.number().optional(),

  /** Parent category ID (for subcategories) */
  parentId: z.string().optional(),
});

/**
 * Inferred TypeScript type from create schema
 */
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;

/**
 * Schema for updating an existing category
 * All fields are optional
 */
export const updateCategorySchema = createCategorySchema.partial().extend({
  // Prevent changing type after creation
  type: z.enum(['expense', 'income']).optional(),
});

/**
 * Inferred TypeScript type from update schema
 */
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;

/**
 * Schema for category filters/queries
 */
export const categoryFiltersSchema = z.object({
  /** Filter by category type */
  type: z.enum(['expense', 'income']).optional(),

  /** Filter by default status */
  isDefault: z.boolean().optional(),

  /** Filter by parent category ID (get subcategories) */
  parentId: z.string().optional(),

  /** Search in category name */
  search: z.string().optional(),

  /** Sort field */
  sortBy: z.enum(['name', 'type', 'order']).optional(),

  /** Sort direction */
  sortDirection: z.enum(['asc', 'desc']).optional(),
});

/**
 * Inferred TypeScript type from filters schema
 */
export type CategoryFilters = z.infer<typeof categoryFiltersSchema>;
