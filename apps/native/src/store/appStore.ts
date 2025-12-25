/**
 * @fileoverview Global app state store using Zustand
 * @module @kakeibo/native/store/appStore
 *
 * Manages global UI state, current user, and app settings.
 * Persisted to MMKV for fast, synchronous storage.
 *
 * Improvements over web version:
 * - Type-safe modal system with discriminated unions
 * - Consolidated editing state (single source of truth)
 * - Clear separation of persisted vs ephemeral state
 * - Granular selectors for performance
 */

import type { Account, Budget, Goal, Transaction, User } from '@kakeibo/core';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createMMKVStorage } from './storage';

/**
 * User settings interface
 */
export interface UserSettings {
  currency: string;
  dateFormat: string;
  theme: 'light' | 'dark' | 'system';
  language: string;
  financialMonthStart: number;
  biometricsEnabled: boolean;
  notifications: {
    budgetAlerts: boolean;
    billReminders: boolean;
    weeklyReports: boolean;
    unusualSpending: boolean;
  };
}

export const defaultUserSettings: UserSettings = {
  currency: 'USD',
  dateFormat: 'MM/DD/YYYY',
  theme: 'dark',
  language: 'en',
  financialMonthStart: 1,
  biometricsEnabled: false,
  notifications: {
    budgetAlerts: true,
    billReminders: true,
    weeklyReports: true,
    unusualSpending: true,
  },
};

/**
 * Type-safe modal system with discriminated unions
 */
export type ModalState =
  | { type: 'closed' }
  | { type: 'addTransaction' }
  | { type: 'editTransaction'; data: Transaction }
  | { type: 'addAccount' }
  | { type: 'editAccount'; data: Account }
  | { type: 'addBudget' }
  | { type: 'editBudget'; data: Budget }
  | { type: 'addGoal' }
  | { type: 'editGoal'; data: Goal }
  | { type: 'addCategory' }
  | { type: 'deleteConfirm'; entityType: string; entityId: string };

/**
 * App state interface
 */
export interface AppState {
  // ==================== PERSISTED STATE ====================
  // User session
  currentUser: User | null;
  isAuthenticated: boolean;

  // Onboarding flag
  hasCompletedOnboarding: boolean;

  // User settings
  settings: UserSettings;

  // Dashboard selected account (null = all accounts)
  selectedDashboardAccountId: string | null;

  // ==================== EPHEMERAL STATE (not persisted) ====================
  // Loading state
  isLoading: boolean;

  // Type-safe modal state
  modal: ModalState;

  // ==================== ACTIONS ====================
  setCurrentUser: (user: User | null) => void;
  setHasCompletedOnboarding: (completed: boolean) => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
  setSelectedDashboardAccountId: (accountId: string | null) => void;
  setLoading: (isLoading: boolean) => void;

  // Type-safe modal actions
  openModal: (modal: Exclude<ModalState, { type: 'closed' }>) => void;
  closeModal: () => void;

  resetStore: () => void;
}

/**
 * Initial state
 */
const initialState = {
  // Persisted state
  currentUser: null,
  isAuthenticated: false,
  hasCompletedOnboarding: false,
  settings: defaultUserSettings,
  selectedDashboardAccountId: null,

  // Ephemeral state
  isLoading: false,
  modal: { type: 'closed' } as ModalState,
};

/**
 * App store with MMKV persistence
 */
export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      ...initialState,

      setCurrentUser: (user) =>
        set({
          currentUser: user,
          isAuthenticated: !!user,
        }),

      setHasCompletedOnboarding: (completed) => set({ hasCompletedOnboarding: completed }),

      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),

      setSelectedDashboardAccountId: (accountId) => set({ selectedDashboardAccountId: accountId }),

      setLoading: (isLoading) => set({ isLoading }),

      // Type-safe modal actions
      openModal: (modal) => set({ modal }),
      closeModal: () => set({ modal: { type: 'closed' } }),

      resetStore: () =>
        set({
          ...initialState,
          modal: { type: 'closed' },
        }),
    }),
    {
      name: 'kakeibo-app-storage',
      storage: createMMKVStorage(),
      // Only persist critical state (modal is ephemeral)
      partialize: (state) => ({
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated,
        hasCompletedOnboarding: state.hasCompletedOnboarding,
        settings: state.settings,
        selectedDashboardAccountId: state.selectedDashboardAccountId,
      }),
    }
  )
);

/**
 * Selector hooks for better performance
 * Use these instead of full store access when possible
 */
export const useCurrentUser = () => useAppStore((state) => state.currentUser);
export const useSettings = () => useAppStore((state) => state.settings);
export const useModal = () => useAppStore((state) => state.modal);

/**
 * Type guards for modal state
 */
export const isEditModal = (modal: ModalState): modal is Extract<ModalState, { data: unknown }> => {
  return 'data' in modal;
};

export const isAddModal = (
  modal: ModalState
): modal is Exclude<ModalState, { type: 'closed' } | { data: unknown }> => {
  return modal.type !== 'closed' && !('data' in modal);
};
