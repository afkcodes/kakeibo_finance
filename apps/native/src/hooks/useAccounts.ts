/**
 * @fileoverview Account hooks (query + mutations)
 * @module @kakeibo/native/hooks/useAccounts
 */

import type {
  Account,
  AccountFilters,
  CreateAccountInput,
  UpdateAccountInput,
} from '@kakeibo/core';
import { useEffect, useRef, useState } from 'react';
import { create } from 'zustand';
import { toast } from '../components/ui/Toast/toast';
import { adapter } from '../services/db/SQLiteAdapter';
import { useCurrentUser } from '../store/appStore';

// ==================== Invalidation Store ====================

interface AccountInvalidationState {
  accountVersion: number;
  invalidateAccounts: () => void;
}

export const useAccountInvalidation = create<AccountInvalidationState>((set) => ({
  accountVersion: 0,
  invalidateAccounts: () => set((state) => ({ accountVersion: state.accountVersion + 1 })),
}));

// ==================== Query Hooks ====================

interface UseAccountsResult {
  accounts: Account[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useAccounts(filters?: AccountFilters): UseAccountsResult {
  const currentUser = useCurrentUser();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Watch invalidation version for reactive updates
  const accountVersion = useAccountInvalidation((state) => state.accountVersion);

  // Use ref for filters to avoid JSON.stringify
  const filtersRef = useRef(filters);
  filtersRef.current = filters;

  const fetchAccounts = async () => {
    if (!currentUser?.id) {
      setAccounts([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = await adapter.getAccounts(currentUser.id, filtersRef.current);
      setAccounts(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch accounts'));
      setAccounts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, [currentUser?.id, accountVersion]);

  return { accounts, isLoading, error, refetch: fetchAccounts };
}

interface UseAccountResult {
  account: Account | null;
  isLoading: boolean;
  error: Error | null;
}

export function useAccount(accountId: string | undefined): UseAccountResult {
  const currentUser = useCurrentUser();
  const [account, setAccount] = useState<Account | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Watch invalidation version
  const accountVersion = useAccountInvalidation((state) => state.accountVersion);

  useEffect(() => {
    if (!currentUser?.id || !accountId) {
      setAccount(null);
      setIsLoading(false);
      return;
    }

    const fetchAccount = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await adapter.getAccount(accountId);
        setAccount(data ?? null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch account'));
        setAccount(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccount();
  }, [currentUser?.id, accountId, accountVersion]);

  return { account, isLoading, error };
}

// ==================== Mutation Hooks ====================

interface UseAccountActionsResult {
  createAccount: (input: CreateAccountInput) => Promise<Account>;
  updateAccount: (id: string, input: UpdateAccountInput) => Promise<Account>;
  deleteAccount: (id: string) => Promise<void>;
}

export function useAccountActions(): UseAccountActionsResult {
  const currentUser = useCurrentUser();
  const invalidateAccounts = useAccountInvalidation((state) => state.invalidateAccounts);

  const createAccount = async (input: CreateAccountInput): Promise<Account> => {
    if (!currentUser?.id) throw new Error('User not authenticated');

    try {
      const account = await adapter.createAccount(currentUser.id, input);
      invalidateAccounts();
      toast.success('Account created successfully');
      return account;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create account');
      toast.error(error.message);
      throw error;
    }
  };

  const updateAccount = async (id: string, input: UpdateAccountInput): Promise<Account> => {
    if (!currentUser?.id) throw new Error('User not authenticated');

    try {
      const account = await adapter.updateAccount(id, input);
      invalidateAccounts();
      toast.success('Account updated successfully');
      return account;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update account');
      toast.error(error.message);
      throw error;
    }
  };

  const deleteAccount = async (id: string): Promise<void> => {
    if (!currentUser?.id) throw new Error('User not authenticated');

    try {
      await adapter.deleteAccount(id);
      invalidateAccounts();
      toast.success('Account deleted successfully');
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to delete account');
      toast.error(error.message);
      throw error;
    }
  };

  return { createAccount, updateAccount, deleteAccount };
}
