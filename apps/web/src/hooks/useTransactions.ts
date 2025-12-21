/**
 * @fileoverview Transaction hooks for web platform
 * @module @kakeibo/web/hooks
 *
 * Uses Dexie's useLiveQuery for reactive, truly live updates.
 * No refetching needed - UI updates automatically when DB changes.
 */

import type {
  CreateTransactionInput,
  TransactionFilters,
  UpdateTransactionInput,
} from '@kakeibo/core';
import { useLiveQuery } from 'dexie-react-hooks';
import { adapter } from '../services/db/adapter';

/**
 * Get all transactions for a user with optional filters
 * Live-updating - automatically refetches when DB changes
 */
export const useTransactions = (userId: string, filters?: TransactionFilters) => {
  return useLiveQuery(
    async () => {
      if (!userId) return [];
      return adapter.getTransactions(userId, filters);
    },
    [userId, JSON.stringify(filters)],
    []
  );
};

/**
 * Get a single transaction by ID
 * Live-updating
 */
export const useTransaction = (transactionId: string) => {
  return useLiveQuery(
    async () => {
      if (!transactionId) return undefined;
      return adapter.getTransaction(transactionId);
    },
    [transactionId],
    undefined
  );
};

/**
 * Transaction mutation actions
 * These directly call the adapter and UI updates automatically via useLiveQuery
 */
export const useTransactionActions = () => {
  return {
    addTransaction: async (userId: string, input: CreateTransactionInput) => {
      return adapter.createTransaction(userId, input);
    },

    updateTransaction: async (transactionId: string, updates: UpdateTransactionInput) => {
      return adapter.updateTransaction(transactionId, updates);
    },

    deleteTransaction: async (transactionId: string) => {
      return adapter.deleteTransaction(transactionId);
    },
  };
};
