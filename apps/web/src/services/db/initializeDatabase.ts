/**
 * @fileoverview Database initialization utilities
 * @module @kakeibo/web/services/db
 *
 * Handles initial database seeding including default categories.
 * Improvements over v1:
 * - Deterministic IDs prevent duplicates
 * - Idempotent (safe to call multiple times)
 * - Auto-updates existing categories with new icons/colors
 * - Better error handling and logging
 * - Modular functions with low complexity
 */

import type { Category } from '@kakeibo/core';
import { allDefaultCategories } from '@kakeibo/core';
import { db } from './index';

// Track which users have been initialized to prevent duplicate initialization
const initializedUsers = new Set<string>();

/**
 * Generate deterministic category ID from name and type
 * Format: {type}-{name-slug}
 * Example: "expense-groceries", "income-salary"
 *
 * This prevents duplicates and makes debugging easier
 */
const generateCategoryId = (type: string, name: string): string => {
  const slug = name
    .toLowerCase()
    .replace(/\s+/g, '-') // spaces to hyphens
    .replace(/&/g, 'and') // & to 'and'
    .replace(/[^a-z0-9-]/g, ''); // remove special chars
  return `${type}-${slug}`;
};

/**
 * Check if a category needs updating
 */
const needsCategoryUpdate = (
  existing: Category,
  defaultCat: Omit<Category, 'id' | 'userId'>
): boolean => {
  return (
    existing.icon !== defaultCat.icon ||
    existing.color !== defaultCat.color ||
    existing.order !== defaultCat.order
  );
};

/**
 * Find and remove duplicate categories
 * Keeps default categories over custom ones when duplicates exist
 */
const removeDuplicateCategories = async (userId: string): Promise<void> => {
  const allCats = await db.categories.where('userId').equals(userId).toArray();
  const seen = new Map<string, string>(); // detId -> first occurrence ID
  const duplicateIds: string[] = [];

  for (const cat of allCats) {
    const detId = generateCategoryId(cat.type, cat.name);
    const firstId = seen.get(detId);

    if (firstId) {
      const first = allCats.find((c) => c.id === firstId);
      const duplicateId = selectDuplicateToRemove(first, cat, firstId);

      if (duplicateId) {
        duplicateIds.push(duplicateId);
        if (duplicateId === firstId) {
          seen.set(detId, cat.id);
        }
      }
    } else {
      seen.set(detId, cat.id);
    }
  }

  if (duplicateIds.length > 0) {
    await db.categories.bulkDelete(duplicateIds);
    console.log(`[DB Init] Removed ${duplicateIds.length} duplicate categories`);
  }
};

/**
 * Determine which duplicate category to remove
 * Returns the ID to remove, or undefined if neither should be removed
 */
const selectDuplicateToRemove = (
  first: Category | undefined,
  duplicate: Category,
  firstId: string
): string | undefined => {
  if (first?.isDefault && !duplicate.isDefault) {
    return duplicate.id;
  }

  if (!first?.isDefault && duplicate.isDefault) {
    return firstId;
  }

  return duplicate.id;
};

/**
 * Process default categories and prepare add/update lists
 */
const processDefaultCategories = (
  existingMap: Map<string, Category>
): {
  toAdd: Category[];
  toUpdate: Array<{ id: string; updates: Partial<Category> }>;
} => {
  const toAdd: Category[] = [];
  const toUpdate: Array<{ id: string; updates: Partial<Category> }> = [];

  for (const defaultCat of allDefaultCategories) {
    const detId = generateCategoryId(defaultCat.type, defaultCat.name);
    const existing = existingMap.get(detId);

    if (existing?.isDefault && needsCategoryUpdate(existing, defaultCat)) {
      toUpdate.push({
        id: existing.id,
        updates: {
          icon: defaultCat.icon,
          color: defaultCat.color,
          order: defaultCat.order,
        },
      });
    } else if (!existing) {
      toAdd.push({
        ...defaultCat,
        id: detId,
        userId: '', // Will be set by caller
      });
    }
  }

  return { toAdd, toUpdate };
};

/**
 * Build a map of existing categories by deterministic ID
 */
const buildCategoryMap = (categories: Category[]): Map<string, Category> => {
  const map = new Map<string, Category>();
  for (const cat of categories) {
    const detId = generateCategoryId(cat.type, cat.name);
    map.set(detId, cat);
  }
  return map;
};

/**
 * Apply category updates in a transaction
 */
const applyUpdates = async (
  toAdd: Category[],
  toUpdate: Array<{ id: string; updates: Partial<Category> }>
): Promise<void> => {
  if (toAdd.length > 0) {
    // Use bulkPut instead of bulkAdd to handle existing keys gracefully
    await db.categories.bulkPut(toAdd);
    console.log(`[DB Init] Added ${toAdd.length} new default categories`);
  }

  for (const { id, updates } of toUpdate) {
    await db.categories.update(id, updates);
  }

  if (toUpdate.length > 0) {
    console.log(`[DB Init] Updated ${toUpdate.length} default categories`);
  }
};

/**
 * Initialize default categories for a user
 *
 * This function is idempotent - safe to call multiple times.
 * It will:
 * 1. Add missing default categories
 * 2. Update existing default categories with latest icons/colors
 * 3. Preserve custom user categories
 * 4. Remove any duplicates
 *
 * @param userId - User ID to initialize categories for
 */
export const initializeDefaultCategories = async (userId: string): Promise<void> => {
  // Skip if already initialized in this session
  if (initializedUsers.has(userId)) {
    return;
  }

  try {
    const existingCategories = await db.categories.where('userId').equals(userId).toArray();

    // If categories exist, mark as initialized and skip
    if (existingCategories.length > 0) {
      initializedUsers.add(userId);
      return;
    }

    const existingMap = buildCategoryMap(existingCategories);
    const { toAdd, toUpdate } = processDefaultCategories(existingMap);

    // Set userId for new categories
    for (const cat of toAdd) {
      cat.userId = userId;
    }

    // Execute updates and additions in a transaction
    await db.transaction('rw', db.categories, async () => {
      await applyUpdates(toAdd, toUpdate);
      await removeDuplicateCategories(userId);
    });

    // Mark user as initialized
    initializedUsers.add(userId);

    if (toAdd.length > 0) {
      console.log(`[DB Init] Initialized user ${userId} with ${toAdd.length} default categories`);
    }
  } catch (error) {
    console.error('[DB Init] Error initializing default categories:', error);
    // Don't throw - app can still function without default categories
    // User can create their own or we'll retry on next load
  }
};

/**
 * Ensure database is initialized with default data for a user
 * Call this when the app first loads or when a new user is created
 *
 * This is the main entry point for database initialization
 *
 * @param userId - User ID to initialize for
 */
export const ensureDatabaseInitialized = async (userId: string): Promise<void> => {
  if (!userId) {
    console.warn('[DB Init] No userId provided, skipping initialization');
    return;
  }

  try {
    await initializeDefaultCategories(userId);
  } catch (error) {
    console.error('[DB Init] Failed to initialize database:', error);
    // Continue anyway - app can still function
  }
};
