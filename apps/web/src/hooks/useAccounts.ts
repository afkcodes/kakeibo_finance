/**
 * @fileoverview Account hooks for web platform
 * @module @kakeibo/web/hooks
 */

import type { CreateAccountInput, UpdateAccountInput } from '@kakeibo/core';
import { useLiveQuery } from 'dexie-react-hooks';
import { adapter } from '../services/db/adapter';

export const useAccounts = (userId: string, includeArchived = false) => {
  return useLiveQuery(
    async () => {
      if (!userId) return [];
      return adapter.getAccounts(userId, { isArchived: includeArchived });
    },
    [userId, includeArchived],
    []
  );
};

export const useAccountsWithBalance = (userId: string, includeArchived = false) => {
  return useAccounts(userId, includeArchived);
};

export const useAccount = (accountId: string) => {
  return useLiveQuery(
    async () => {
      if (!accountId) return undefined;
      return adapter.getAccount(accountId);
    },
    [accountId],
    undefined
  );
};

export const useAccountActions = () => {
  return {
    addAccount: async (userId: string, input: CreateAccountInput) => {
      return adapter.createAccount(userId, input);
    },

    updateAccount: async (accountId: string, updates: UpdateAccountInput) => {
      return adapter.updateAccount(accountId, updates);
    },

    deleteAccount: async (accountId: string) => {
      return adapter.deleteAccount(accountId);
    },
  };
};
