/**
 * @fileoverview Category hooks for web platform
 * @module @kakeibo/web/hooks
 */

import type { CreateCategoryInput, UpdateCategoryInput } from '@kakeibo/core';
import { useLiveQuery } from 'dexie-react-hooks';
import { adapter } from '../services/db/adapter';

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
      return adapter.createCategory(userId, input);
    },

    updateCategory: async (categoryId: string, updates: UpdateCategoryInput) => {
      return adapter.updateCategory(categoryId, updates);
    },

    deleteCategory: async (categoryId: string) => {
      return adapter.deleteCategory(categoryId);
    },
  };
};
