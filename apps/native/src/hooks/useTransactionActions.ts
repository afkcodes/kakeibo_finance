/**
 * @fileoverview Transaction mutation hook
 * @module @kakeibo/native/hooks/useTransactionActions
 *
 * Provides transaction mutations (create, update, delete).
 *
 * Improvements:
 * - Emits events to trigger reactive refetches in query hooks
 * - Toast notifications for user feedback
 * - Returns created/updated entities
 */

import type { CreateTransactionInput, Transaction, UpdateTransactionInput } from '@kakeibo/core';
import { useState } from 'react';
import { toast } from '../components/ui/Toast/toast';
import { adapter } from '../services/db/SQLiteAdapter';
import { useCurrentUser } from '../store/appStore';
import { useInvalidation } from './useTransactions';

interface UseTransactionActionsResult {
  createTransaction: (input: CreateTransactionInput) => Promise<Transaction>;
  updateTransaction: (id: string, input: UpdateTransactionInput) => Promise<Transaction>;
  deleteTransaction: (id: string) => Promise<void>;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Mutation hook for transaction actions
 *
 * @returns Transaction action functions with loading/error states
 *
 * @example
 * ```tsx
 * const { createTransaction, isLoading } = useTransactionActions();
 *
 * const handleSubmit = async (data) => {
 *   await createTransaction(data);
 *   // Refetch in parent component
 * };
 * ```
 */
export function useTransactionActions(): UseTransactionActionsResult {
  const currentUser = useCurrentUser();
  const invalidateTransactions = useInvalidation((state) => state.invalidateTransactions);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createTransaction = async (input: CreateTransactionInput) => {
    if (!currentUser?.id) {
      throw new Error('User not authenticated');
    }

    try {
      setIsLoading(true);
      setError(null);
      const transaction = await adapter.createTransaction(currentUser.id, input);

      // Invalidate queries to trigger refetch
      invalidateTransactions();

      // Show success feedback
      toast.success(`${input.type} of ${input.amount} saved successfully`);

      return transaction;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create transaction');
      setError(error);

      toast.error(`Failed to add transaction: ${error.message}`);

      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateTransaction = async (id: string, input: UpdateTransactionInput) => {
    if (!currentUser?.id) {
      throw new Error('User not authenticated');
    }

    try {
      setIsLoading(true);
      setError(null);
      const transaction = await adapter.updateTransaction(id, input);

      // Invalidate queries to trigger refetch
      invalidateTransactions();

      toast.success('Transaction updated successfully');

      return transaction;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update transaction');
      setError(error);

      toast.error(`Failed to update transaction: ${error.message}`);

      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTransaction = async (id: string) => {
    if (!currentUser?.id) {
      throw new Error('User not authenticated');
    }

    try {
      setIsLoading(true);
      setError(null);
      await adapter.deleteTransaction(id);

      // Invalidate queries to trigger refetch
      invalidateTransactions();

      toast.success('Transaction deleted successfully');
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to delete transaction');
      setError(error);

      toast.error(`Failed to delete transaction: ${error.message}`);

      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createTransaction,
    updateTransaction,
    deleteTransaction,
    isLoading,
    error,
  };
}
