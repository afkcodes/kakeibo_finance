/**
 * @fileoverview Authentication hook with Supabase integration
 * @module @kakeibo/native/hooks/useAuth
 *
 * Main authentication hook for native platform.
 * Integrates Supabase with @kakeibo/core auth services.
 * TODO: Complete Supabase OAuth implementation for React Native
 */

import type { AuthUser } from '@kakeibo/core';
import {
  createGuestUser,
  getPendingMigrationData,
  getPendingMigrationKey,
  shouldAttemptMigration,
} from '@kakeibo/core';
import { useCallback, useEffect, useState } from 'react';
import { toast } from '../components/ui/Toast/toast';
import { adapter } from '../services/db/SQLiteAdapter';
import { useAppStore } from '../store/appStore';
import { mmkv } from '../store/storage';

export interface UseAuthReturn {
  /** Current authenticated or guest user */
  user: AuthUser | null;
  /** True if user is authenticated via OAuth */
  isAuthenticated: boolean;
  /** True if user is in guest mode */
  isGuest: boolean;
  /** True during auth operations */
  isLoading: boolean;
  /** Sign in with OAuth provider */
  signInWithGoogle: () => Promise<void>;
  /** Sign out and optionally clear local data */
  signOut: (keepLocalData?: boolean) => Promise<void>;
  /** Initialize guest mode */
  startAsGuest: () => void;
}

/**
 * Main authentication hook
 *
 * Manages authentication state and provides auth methods.
 * TODO: Implement Supabase session sync for React Native
 *
 * @example
 * ```tsx
 * const { user, isAuthenticated, signInWithGoogle, signOut } = useAuth();
 *
 * // Sign in with Google
 * await signInWithGoogle();
 *
 * // Sign out (keep local data)
 * await signOut(true);
 * ```
 */
export function useAuth(): UseAuthReturn {
  const { currentUser, setCurrentUser, setHasCompletedOnboarding } = useAppStore();
  const [isLoading, setIsLoading] = useState(true);
  const [_error, setError] = useState<{ code: string; message: string } | null>(null);

  // Derive auth state from currentUser (assumes AuthUser type)
  const user = currentUser as AuthUser | null;
  const isAuthenticated = user?.mode === 'authenticated';
  const isGuest = user?.mode === 'guest';

  /**
   * Attempt to migrate guest data to authenticated user
   */
  const attemptMigration = useCallback(async (toAuthUserId: string) => {
    try {
      // Check for pending migration
      const pendingGuestId = mmkv.getString(getPendingMigrationKey());

      if (!pendingGuestId || !shouldAttemptMigration(pendingGuestId)) {
        return;
      }

      console.log(`Attempting migration from ${pendingGuestId} to ${toAuthUserId}`);

      // Perform migration
      const result = await adapter.migrateGuestDataToUser(pendingGuestId, toAuthUserId);

      if (result.success) {
        // Clear pending migration flag
        mmkv.remove(getPendingMigrationKey());

        // Show success toast with counts
        const { migratedCounts } = result;
        const totalItems =
          migratedCounts.transactions +
          migratedCounts.budgets +
          migratedCounts.goals +
          migratedCounts.accounts +
          migratedCounts.categories;

        if (totalItems > 0) {
          toast.success(
            `Transferred ${totalItems} items to your account: ${migratedCounts.transactions} transactions, ${migratedCounts.budgets} budgets, ${migratedCounts.goals} goals, ${migratedCounts.accounts} accounts, ${migratedCounts.categories} categories`
          );
        }
      } else {
        console.error('Migration failed:', result.error);
        toast.error(result.error || 'Failed to transfer guest data');
      }
    } catch (error) {
      console.error('Migration error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to transfer guest data');
    }
  }, []);

  useEffect(() => {
    // Initialize auth state on mount
    const initializeAuth = async () => {
      // TODO: Check for active Supabase session
      // const session = await supabase.auth.getSession();
      // if (session) {
      //   const authUser = convertSupabaseUser(session);
      //   setCurrentUser(authUser);
      //   await attemptMigration(authUser.id);
      // }
      // For now, if no persisted user, leave as null
      // User will be redirected to welcome screen by route guard
      setIsLoading(false);
    };

    initializeAuth();

    // TODO: Listen for Supabase auth state changes
    // const subscription = supabase.auth.onAuthStateChange(async (event, session) => {
    //   if (session) {
    //     const authUser = convertSupabaseUser(session);
    //     setCurrentUser(authUser);
    //     if (event === 'SIGNED_IN') {
    //       setHasCompletedOnboarding(true);
    //       await attemptMigration(authUser.id);
    //     }
    //   } else if (event === 'SIGNED_OUT') {
    //     const { user: guestUser } = createGuestUser();
    //     setCurrentUser(guestUser as any);
    //   }
    // });
    // return () => subscription.unsubscribe();
  }, []);

  /**
   * Sign in with Google OAuth
   * TODO: Implement Supabase OAuth flow for React Native
   */
  const signInWithGoogle = async () => {
    try {
      setIsLoading(true);

      // TODO: Implement Supabase Google OAuth
      // 1. Use Linking or WebBrowser for OAuth flow
      // 2. Get session from Supabase
      // 3. Convert to AuthUser
      // 4. Update user in database
      // 5. Check for pending migration

      throw new Error('Google OAuth not implemented yet');
    } catch (error) {
      console.error('Sign in failed:', error);
      setError({
        code: 'signin_error',
        message: error instanceof Error ? error.message : 'Sign in failed',
      });
      toast.error(error instanceof Error ? error.message : 'Sign in failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Sign out current user
   */
  const signOut = async (keepLocalData = false) => {
    try {
      setIsLoading(true);

      // TODO: Sign out from Supabase
      // const { error } = await supabase.auth.signOut();
      // if (error) throw error;

      // Create new guest user
      const { user: guestUser } = createGuestUser();
      setCurrentUser(guestUser as any);

      // TODO: Handle keepLocalData option
      // If !keepLocalData, clear all user data from SQLite
      if (!keepLocalData) {
        // Clear can be implemented later
      }

      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Sign out failed:', error);
      setError({
        code: 'signout_error',
        message: error instanceof Error ? error.message : 'Sign out failed',
      });
      toast.error(error instanceof Error ? error.message : 'Sign out failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Start as guest (no auth)
   */
  const startAsGuest = () => {
    // Create guest user
    const { user: guestUser } = createGuestUser();
    setCurrentUser(guestUser as any);
    setIsLoading(false);
    setHasCompletedOnboarding(true);

    // Store guest ID for potential migration when user signs in later
    const { key, value } = getPendingMigrationData(guestUser.id);
    mmkv.set(key, value);

    toast.success('Started as guest');
  };

  return {
    user,
    isAuthenticated,
    isGuest,
    isLoading,
    signInWithGoogle,
    signOut,
    startAsGuest,
  };
}
