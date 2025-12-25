/**
 * @fileoverview Transaction query hook
 * @module @kakeibo/native/hooks/useTransactions
 *
 * Provides reactive transaction data from SQLite with automatic refetching.
 * Uses Zustand store for query invalidation signals.
 *
 * Improvements over basic implementation:
 * - Zustand-based invalidation (no custom event emitter)
 * - Stable dependency tracking (no JSON.stringify)
 * - Automatic cleanup on unmount
 * - Integrates with existing state management
 */

import type { QueryOptions, Transaction, TransactionFilters } from '@kakeibo/core';
import { useCallback, useEffect, useRef, useState } from 'react';
import { create } from 'zustand';
import { adapter } from '../services/db/SQLiteAdapter';
import { useCurrentUser } from '../store/appStore';

/**
 * Query invalidation store
 * When mutations occur, increment the counter to trigger refetches
 */
interface InvalidationState {
  transactionVersion: number;
  invalidateTransactions: () => void;
}

export const useInvalidation = create<InvalidationState>((set) => ({
  transactionVersion: 0,
  invalidateTransactions: () =>
    set((state) => ({ transactionVersion: state.transactionVersion + 1 })),
}));

interface UseTransactionsResult {
  transactions: Transaction[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Query hook for transactions with filters and pagination
 *
 * @param filters - Transaction filters (type, category, account, date range, etc.)
 * @param options - Query options (sorting, pagination)
 * @returns Transaction data, loading state, error, and refetch function
 *
 * @example
 * ```tsx
 * const { transactions, isLoading } = useTransactions(
 *   { type: 'expense', startDate: monthStart },
 *   { sortBy: 'date', sortOrder: 'desc', limit: 50 }
 * );
 * ```
 */
export function useTransactions(
  filters?: TransactionFilters,
  options?: QueryOptions
): UseTransactionsResult {
  const currentUser = useCurrentUser();
  const transactionVersion = useInvalidation((state) => state.transactionVersion);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Use ref to store latest filters/options to avoid dependency issues
  const filtersRef = useRef(filters);
  const optionsRef = useRef(options);
  filtersRef.current = filters;
  optionsRef.current = options;

  const fetchTransactions = useCallback(async () => {
    if (!currentUser?.id) {
      setTransactions([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = await adapter.getTransactions(
        currentUser.id,
        filtersRef.current,
        optionsRef.current
      );
      setTransactions(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch transactions'));
      setTransactions([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser?.id]);

  // Refetch when user changes or when invalidated (transactionVersion changes)
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions, transactionVersion]);

  return {
    transactions,
    isLoading,
    error,
    refetch: fetchTransactions,
  };
}

/**
 * Get a single transaction by ID with reactive updates
 */
export function useTransaction(transactionId: string | undefined) {
  const currentUser = useCurrentUser();
  const transactionVersion = useInvalidation((state) => state.transactionVersion);
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTransaction = useCallback(async () => {
    if (!currentUser?.id || !transactionId) {
      setTransaction(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = await adapter.getTransaction(transactionId);
      setTransaction(data ?? null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch transaction'));
      setTransaction(null);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser?.id, transactionId]);

  // Refetch when user/id changes or when invalidated
  useEffect(() => {
    fetchTransaction();
  }, [fetchTransaction, transactionVersion]);

  return { transaction, isLoading, error, refetch: fetchTransaction };
}
