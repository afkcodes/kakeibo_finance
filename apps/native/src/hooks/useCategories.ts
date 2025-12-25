/**
 * @fileoverview Category hooks (query + mutations)
 * @module @kakeibo/native/hooks/useCategories
 */

import type {
  Category,
  CategoryFilters,
  CreateCategoryInput,
  UpdateCategoryInput,
} from '@kakeibo/core';
import { useEffect, useRef, useState } from 'react';
import { create } from 'zustand';
import { toast } from '../components/ui/Toast/toast';
import { adapter } from '../services/db/SQLiteAdapter';
import { useCurrentUser } from '../store/appStore';

// ==================== Invalidation Store ====================

interface CategoryInvalidationState {
  categoryVersion: number;
  invalidateCategories: () => void;
}

export const useCategoryInvalidation = create<CategoryInvalidationState>((set) => ({
  categoryVersion: 0,
  invalidateCategories: () => set((state) => ({ categoryVersion: state.categoryVersion + 1 })),
}));

// ==================== Query Hooks ====================

interface UseCategoriesResult {
  categories: Category[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useCategories(filters?: CategoryFilters): UseCategoriesResult {
  const currentUser = useCurrentUser();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Watch invalidation version for reactive updates
  const categoryVersion = useCategoryInvalidation((state) => state.categoryVersion);

  // Use ref for filters to avoid JSON.stringify
  const filtersRef = useRef(filters);
  filtersRef.current = filters;

  const fetchCategories = async () => {
    if (!currentUser?.id) {
      setCategories([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = await adapter.getCategories(currentUser.id, filtersRef.current);
      setCategories(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch categories'));
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [currentUser?.id, categoryVersion]);

  return { categories, isLoading, error, refetch: fetchCategories };
}

interface UseCategoryResult {
  category: Category | null;
  isLoading: boolean;
  error: Error | null;
}

export function useCategory(categoryId: string | undefined): UseCategoryResult {
  const currentUser = useCurrentUser();
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Watch invalidation version
  const categoryVersion = useCategoryInvalidation((state) => state.categoryVersion);

  useEffect(() => {
    if (!currentUser?.id || !categoryId) {
      setCategory(null);
      setIsLoading(false);
      return;
    }

    const fetchCategory = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await adapter.getCategory(categoryId);
        setCategory(data ?? null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch category'));
        setCategory(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategory();
  }, [currentUser?.id, categoryId, categoryVersion]);

  return { category, isLoading, error };
}

// ==================== Mutation Hooks ====================

interface UseCategoryActionsResult {
  createCategory: (input: CreateCategoryInput) => Promise<Category>;
  updateCategory: (id: string, input: UpdateCategoryInput) => Promise<Category>;
  deleteCategory: (id: string) => Promise<void>;
}

export function useCategoryActions(): UseCategoryActionsResult {
  const currentUser = useCurrentUser();
  const invalidateCategories = useCategoryInvalidation((state) => state.invalidateCategories);

  const createCategory = async (input: CreateCategoryInput): Promise<Category> => {
    if (!currentUser?.id) throw new Error('User not authenticated');

    try {
      const category = await adapter.createCategory(currentUser.id, input);
      invalidateCategories();
      toast.success('Category created successfully');
      return category;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create category');
      toast.error(error.message);
      throw error;
    }
  };

  const updateCategory = async (id: string, input: UpdateCategoryInput): Promise<Category> => {
    if (!currentUser?.id) throw new Error('User not authenticated');

    try {
      const category = await adapter.updateCategory(id, input);
      invalidateCategories();
      toast.success('Category updated successfully');
      return category;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update category');
      toast.error(error.message);
      throw error;
    }
  };

  const deleteCategory = async (id: string): Promise<void> => {
    if (!currentUser?.id) throw new Error('User not authenticated');

    try {
      await adapter.deleteCategory(id);
      invalidateCategories();
      toast.success('Category deleted successfully');
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to delete category');
      toast.error(error.message);
      throw error;
    }
  };

  return { createCategory, updateCategory, deleteCategory };
}
