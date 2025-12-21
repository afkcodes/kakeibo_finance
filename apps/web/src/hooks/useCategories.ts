/**
 * @fileoverview Category hooks for web platform
 * @module @kakeibo/web/hooks
 */

import type { CreateCategoryInput, UpdateCategoryInput } from '@kakeibo/core';
import { useLiveQuery } from 'dexie-react-hooks';
import { adapter } from '../services/db/adapter';
import { toastHelpers } from '../utils';

export const useCategories = (userId: string, type?: 'expense' | 'income') => {
  return useLiveQuery(
    async () => {
      if (!userId) return [];
      return adapter.getCategories(userId, { type });
    },
    [userId, type],
    []
  );
};

export const useCategory = (categoryId: string) => {
  return useLiveQuery(
    async () => {
      if (!categoryId) return undefined;
      return adapter.getCategory(categoryId);
    },
    [categoryId],
    undefined
  );
};

export const useCategoryActions = () => {
  return {
    addCategory: async (userId: string, input: CreateCategoryInput) => {
      try {
        const category = await adapter.createCategory(userId, input);
        toastHelpers.success('Category created', `${input.name} added successfully`);
        return category;
      } catch (error) {
        toastHelpers.error(
          'Failed to create category',
          error instanceof Error ? error.message : 'Unknown error'
        );
        throw error;
      }
    },

    updateCategory: async (categoryId: string, updates: UpdateCategoryInput) => {
      try {
        const category = await adapter.updateCategory(categoryId, updates);
        toastHelpers.success('Category updated', 'Changes saved successfully');
        return category;
      } catch (error) {
        toastHelpers.error(
          'Failed to update category',
          error instanceof Error ? error.message : 'Unknown error'
        );
        throw error;
      }
    },

    deleteCategory: async (categoryId: string) => {
      try {
        await adapter.deleteCategory(categoryId);
        toastHelpers.success('Category deleted', 'Category removed successfully');
      } catch (error) {
        toastHelpers.error(
          'Failed to delete category',
          error instanceof Error ? error.message : 'Unknown error'
        );
        throw error;
      }
    },
  };
};
