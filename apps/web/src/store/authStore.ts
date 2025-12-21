/**
 * @fileoverview Authentication state management
 * @module @kakeibo/web/store
 *
 * Zustand store for authentication state.
 * Uses @kakeibo/core types and services.
 */

import type { AuthError, AuthSession, AuthState, AuthUser } from '@kakeibo/core';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Authentication Store Actions
 * All state mutation methods
 */
interface AuthActions {
  /**
   * Set current user
   * Updates user state and derived flags
   */
  setUser: (user: AuthUser | null) => void;

  /**
   * Set auth session
   * Stores session data for token management
   */
  setSession: (session: AuthSession | null) => void;

  /**
   * Set loading state
   * Indicates auth operations in progress
   */
  setLoading: (loading: boolean) => void;

  /**
   * Set auth error
   * Stores error information for UI display
   */
  setError: (error: AuthError | null) => void;

  /**
   * Clear auth error
   * Removes error state
   */
  clearError: () => void;

  /**
   * Reset entire auth state
   * Returns to initial state (useful for sign out)
   */
  reset: () => void;

  /**
   * Update user profile
   * Partially updates user data
   */
  updateUser: (updates: Partial<AuthUser>) => void;
}

/**
 * Complete auth store interface
 * Combines state and actions
 */
type AuthStore = AuthState & AuthActions;

/**
 * Initial auth state
 * Default values when store is created
 */
const initialState: AuthState = {
  user: null,
  session: null,
  isAuthenticated: false,
  isGuest: true, // Start as guest until we know otherwise
  isLoading: true, // Start as loading until we check session
  error: null,
};

/**
 * Authentication Store
 * Manages user authentication state across the app
 *
 * Features:
 * - Persists to localStorage (session survives page reloads)
 * - Tracks user, session, loading, and error states
 * - Provides actions for all auth operations
 * - Automatically derives isAuthenticated and isGuest flags
 *
 * @example
 * ```tsx
 * const { user, isAuthenticated, setUser } = useAuthStore();
 *
 * if (isAuthenticated) {
 *   console.log('User:', user.displayName);
 * }
 *
 * // Update user
 * setUser(newUser);
 * ```
 */
export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      ...initialState,

      // Actions
      setUser: (user) => {
        console.log('[AuthStore] Setting user:', user?.id, user?.mode);

        set({
          user,
          isAuthenticated: user?.mode === 'authenticated',
          isGuest: user?.mode === 'guest' || user === null,
          error: null, // Clear error on successful user set
        });
      },

      setSession: (session) => {
        console.log('[AuthStore] Setting session:', session?.userId);

        set({
          session,
        });
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      setError: (error) => {
        console.error('[AuthStore] Setting error:', error);

        set({
          error,
          isLoading: false, // Stop loading on error
        });
      },

      clearError: () => {
        set({ error: null });
      },

      reset: () => {
        console.log('[AuthStore] Resetting auth state');

        set({
          ...initialState,
          isLoading: false, // Don't show loading after reset
        });
      },

      updateUser: (updates) => {
        const currentUser = get().user;

        if (!currentUser) {
          console.warn('[AuthStore] Cannot update user: no user set');
          return;
        }

        console.log('[AuthStore] Updating user:', updates);

        set({
          user: {
            ...currentUser,
            ...updates,
            updatedAt: new Date(),
          },
        });
      },
    }),
    {
      name: 'kakeibo-auth-storage', // localStorage key

      /**
       * Partial persistence configuration
       * Only persist essential data, not loading/error states
       */
      partialize: (state) => ({
        user: state.user,
        session: state.session,
        isAuthenticated: state.isAuthenticated,
        isGuest: state.isGuest,
        // Don't persist: isLoading, error
      }),

      /**
       * Custom merge function
       * Handles rehydration from localStorage
       */
      merge: (persisted: Partial<AuthStore>, current: AuthStore) => ({
        ...current,
        ...persisted,
        // Always start fresh with these values
        isLoading: false,
        error: null,
      }),
    }
  )
);
