import type { Account, Budget, Goal, Transaction } from '@kakeibo/core';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Default user ID for offline-first single-user mode
const DEFAULT_USER_ID = 'default-user';

// User settings interface
export interface UserSettings {
  currency: string;
  dateFormat: string;
  theme: 'light' | 'dark' | 'system';
  language: string;
  financialMonthStart: number;
  notifications: {
    budgetAlerts: boolean;
    billReminders: boolean;
    weeklyReports: boolean;
    unusualSpending: boolean;
  };
}

export const defaultUserSettings: UserSettings = {
  currency: 'USD',
  dateFormat: 'MM/dd/yyyy',
  theme: 'system',
  language: 'en',
  financialMonthStart: 1,
  notifications: {
    budgetAlerts: true,
    billReminders: true,
    weeklyReports: true,
    unusualSpending: true,
  },
};

interface AppState {
  // User settings
  settings: UserSettings;
  updateSettings: (settings: Partial<UserSettings>) => void;

  // UI state
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;

  // Theme
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;

  // Current user ID (for offline-first app)
  currentUserId: string;
  setCurrentUserId: (userId: string) => void;

  // Dashboard selected account (null = all accounts)
  selectedDashboardAccountId: string | null;
  setSelectedDashboardAccountId: (accountId: string | null) => void;

  // Loading states
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  // Modal states
  activeModal: string | null;
  setActiveModal: (modal: string | null) => void;

  // Editing transaction
  editingTransaction: Transaction | null;
  setEditingTransaction: (transaction: Transaction | null) => void;

  // Editing budget
  editingBudget: Budget | null;
  setEditingBudget: (budget: Budget | null) => void;

  // Editing goal
  editingGoal: Goal | null;
  setEditingGoal: (goal: Goal | null) => void;

  // Editing account
  editingAccount: Account | null;
  setEditingAccount: (account: Account | null) => void;

  // Reset store
  resetStore: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // User settings
      settings: defaultUserSettings,
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),

      // UI state
      sidebarOpen: true,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      // Theme
      theme: 'system',
      setTheme: (theme) => set({ theme }),

      // Current user
      currentUserId: DEFAULT_USER_ID,
      setCurrentUserId: (userId) => set({ currentUserId: userId }),

      // Dashboard selected account
      selectedDashboardAccountId: null,
      setSelectedDashboardAccountId: (accountId) => set({ selectedDashboardAccountId: accountId }),

      // Loading
      isLoading: false,
      setIsLoading: (loading) => set({ isLoading: loading }),

      // Modals
      activeModal: null,
      setActiveModal: (modal) => set({ activeModal: modal }),

      // Editing transaction
      editingTransaction: null,
      setEditingTransaction: (transaction) => set({ editingTransaction: transaction }),

      // Editing budget
      editingBudget: null,
      setEditingBudget: (budget) => set({ editingBudget: budget }),

      // Editing goal
      editingGoal: null,
      setEditingGoal: (goal) => set({ editingGoal: goal }),

      // Editing account
      editingAccount: null,
      setEditingAccount: (account) => set({ editingAccount: account }),

      // Reset store to initial state
      resetStore: () =>
        set({
          settings: defaultUserSettings,
          sidebarOpen: true,
          theme: 'system',
          currentUserId: DEFAULT_USER_ID,
          selectedDashboardAccountId: null,
          isLoading: false,
          activeModal: null,
          editingTransaction: null,
          editingBudget: null,
          editingGoal: null,
          editingAccount: null,
        }),
    }),
    {
      name: 'kakeibo-app-store',
      partialize: (state) => ({
        settings: state.settings,
        theme: state.theme,
        currentUserId: state.currentUserId,
        selectedDashboardAccountId: state.selectedDashboardAccountId,
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
);
