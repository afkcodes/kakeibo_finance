/**
 * @fileoverview Account hooks for web platform
 * @module @kakeibo/web/hooks
 */

import type { CreateAccountInput, UpdateAccountInput } from '@kakeibo/core';
import { useLiveQuery } from 'dexie-react-hooks';
import { adapter } from '../services/db/adapter';
import { toastHelpers } from '../utils';

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
      try {
        const account = await adapter.createAccount(userId, input);
        toastHelpers.success('Account created', `${input.name} added successfully`);
        return account;
      } catch (error) {
        toastHelpers.error(
          'Failed to create account',
          error instanceof Error ? error.message : 'Unknown error'
        );
        throw error;
      }
    },

    updateAccount: async (accountId: string, updates: UpdateAccountInput) => {
      try {
        const account = await adapter.updateAccount(accountId, updates);
        toastHelpers.success('Account updated', 'Changes saved successfully');
        return account;
      } catch (error) {
        toastHelpers.error(
          'Failed to update account',
          error instanceof Error ? error.message : 'Unknown error'
        );
        throw error;
      }
    },

    deleteAccount: async (accountId: string) => {
      try {
        await adapter.deleteAccount(accountId);
        toastHelpers.success('Account deleted', 'Account removed successfully');
      } catch (error) {
        toastHelpers.error(
          'Failed to delete account',
          error instanceof Error ? error.message : 'Unknown error'
        );
        throw error;
      }
    },
  };
};
