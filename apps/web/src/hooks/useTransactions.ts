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
import { toastHelpers } from '../utils';

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
      try {
        const transaction = await adapter.createTransaction(userId, input);
        toastHelpers.success(
          'Transaction added',
          `${input.type} of ${input.amount} saved successfully`
        );
        return transaction;
      } catch (error) {
        toastHelpers.error(
          'Failed to add transaction',
          error instanceof Error ? error.message : 'Unknown error'
        );
        throw error;
      }
    },

    updateTransaction: async (transactionId: string, updates: UpdateTransactionInput) => {
      try {
        const transaction = await adapter.updateTransaction(transactionId, updates);
        toastHelpers.success('Transaction updated', 'Changes saved successfully');
        return transaction;
      } catch (error) {
        toastHelpers.error(
          'Failed to update transaction',
          error instanceof Error ? error.message : 'Unknown error'
        );
        throw error;
      }
    },

    deleteTransaction: async (transactionId: string) => {
      try {
        await adapter.deleteTransaction(transactionId);
        toastHelpers.success('Transaction deleted', 'Transaction removed successfully');
      } catch (error) {
        toastHelpers.error(
          'Failed to delete transaction',
          error instanceof Error ? error.message : 'Unknown error'
        );
        throw error;
      }
    },
  };
};
