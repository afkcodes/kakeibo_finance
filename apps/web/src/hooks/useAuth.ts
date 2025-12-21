/**
 * @fileoverview Authentication hook
 * @module @kakeibo/web/hooks
 *
 * Main authentication hook for the web platform.
 * Integrates Supabase with @kakeibo/core auth services.
 */

import type { AuthUser, LoginOptions, SignOutOptions } from '@kakeibo/core';
import {
  convertOAuthUser,
  createGuestUser,
  getPendingMigrationData,
  getPendingMigrationKey,
  shouldAttemptMigration,
} from '@kakeibo/core';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { useNavigate } from '@tanstack/react-router';
import { useCallback, useEffect } from 'react';
import { supabase } from '../services/auth/supabaseClient';
import { adapter } from '../services/db/adapter';
import { useAuthStore } from '../store/authStore';
import { toastHelpers } from '../utils/toast';

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
  signIn: (options: LoginOptions) => Promise<void>;
  /** Sign out and optionally clear local data */
  signOut: (options?: SignOutOptions) => Promise<void>;
  /** Initialize guest mode */
  startAsGuest: () => void;
}

/**
 * Convert Supabase session to core AuthSession
 */
function convertSupabaseSession(session: Session | null) {
  if (!session) return null;

  return {
    accessToken: session.access_token,
    refreshToken: session.refresh_token,
    expiresAt: session.expires_at,
    userId: session.user.id,
  };
}

/**
 * Convert Supabase user to core AuthUser
 */
function convertSupabaseUser(session: Session): AuthUser {
  const { user } = session;

  // Determine provider from app_metadata or default to 'google'
  const provider = user.app_metadata?.provider || 'google';

  const oauthUserData = {
    id: user.id,
    email: user.email,
    displayName: user.user_metadata?.full_name || user.user_metadata?.name || 'User',
    photoURL: user.user_metadata?.avatar_url,
    provider: provider as 'google' | 'apple' | 'github',
  };

  return convertOAuthUser(oauthUserData, provider as 'google' | 'apple' | 'github');
}

/**
 * Main authentication hook
 *
 * Manages authentication state and provides auth methods.
 * Automatically syncs with Supabase session changes.
 *
 * @example
 * ```tsx
 * const { user, isAuthenticated, signIn, signOut } = useAuth();
 *
 * // Sign in with Google
 * await signIn({ provider: 'google', redirectTo: '/dashboard' });
 *
 * // Sign out (keep local data)
 * await signOut({ keepLocalData: true });
 * ```
 */
export const useAuth = (): UseAuthReturn => {
  const { user, isAuthenticated, isGuest, isLoading, setUser, setSession, setLoading, setError } =
    useAuthStore();
  const navigate = useNavigate();

  /**
   * Attempt to migrate guest data to authenticated user
   */
  const attemptMigration = useCallback(async (toAuthUserId: string) => {
    try {
      // Check for pending migration
      const pendingGuestId = localStorage.getItem(getPendingMigrationKey());

      if (!pendingGuestId || !shouldAttemptMigration(pendingGuestId)) {
        return;
      }

      console.log(`Attempting migration from ${pendingGuestId} to ${toAuthUserId}`);

      // Perform migration
      const result = await adapter.migrateGuestDataToUser(pendingGuestId, toAuthUserId);

      if (result.success) {
        // Clear pending migration flag
        localStorage.removeItem(getPendingMigrationKey());

        // Show success toast with counts
        const { migratedCounts } = result;
        const totalItems =
          migratedCounts.transactions +
          migratedCounts.budgets +
          migratedCounts.goals +
          migratedCounts.accounts +
          migratedCounts.categories;

        if (totalItems > 0) {
          toastHelpers.success(
            'Data migrated successfully',
            `Transferred ${totalItems} items to your account: ${migratedCounts.transactions} transactions, ${migratedCounts.budgets} budgets, ${migratedCounts.goals} goals, ${migratedCounts.accounts} accounts, ${migratedCounts.categories} categories`
          );
        }
      } else {
        console.error('Migration failed:', result.error);
        toastHelpers.error('Migration failed', result.error || 'Failed to transfer guest data');
      }
    } catch (error) {
      console.error('Migration error:', error);
      toastHelpers.error(
        'Migration error',
        error instanceof Error ? error.message : 'Failed to transfer guest data'
      );
    }
  }, []);

  useEffect(() => {
    // Check for active session on mount
    const initializeAuth = async () => {
      try {
        const {
          data: { session: currentSession },
        } = await supabase.auth.getSession();

        if (currentSession) {
          const authUser = convertSupabaseUser(currentSession);
          const authSession = convertSupabaseSession(currentSession);

          setUser(authUser);
          setSession(authSession);

          // Check for pending guest data migration
          await attemptMigration(authUser.id);
        }
        // If no session and no persisted user, leave user as null
        // User will be redirected to /welcome by route guard
      } catch (error) {
        console.error('Failed to initialize auth:', error);

        setError({
          code: 'init_error',
          message: error instanceof Error ? error.message : 'Failed to initialize authentication',
        });
        // Don't auto-create guest user on error - let route guard handle redirect
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, newSession: Session | null) => {
        console.log('Auth state changed:', event);

        if (newSession) {
          const authUser = convertSupabaseUser(newSession);
          const authSession = convertSupabaseSession(newSession);

          setUser(authUser);
          setSession(authSession);

          // Check for pending guest data migration
          if (event === 'SIGNED_IN') {
            await attemptMigration(authUser.id);
            // Navigate to dashboard after successful sign-in
            navigate({ to: '/dashboard' });
          }
        } else if (event === 'SIGNED_OUT') {
          // User signed out - create new guest user
          const { user: guestUser } = createGuestUser();
          setUser(guestUser);
          setSession(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser, setSession, setLoading, setError, attemptMigration, navigate]); // Only run once on mount

  /**
   * Sign in with OAuth provider
   */
  const signIn = async (options: LoginOptions) => {
    try {
      setLoading(true);

      // Map our AuthProviderType to Supabase Provider
      // For now we only support 'google', others will be added later
      const supabaseProvider = options.provider as 'google';

      const { error } = await supabase.auth.signInWithOAuth({
        provider: supabaseProvider,
        options: {
          redirectTo: options.redirectTo || `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        setError({
          code: error.status?.toString() || 'auth_error',
          message: error.message || 'Sign in failed',
        });
        throw error;
      }
    } catch (error) {
      console.error('Sign in failed:', error);

      setError({
        code: 'signin_error',
        message: error instanceof Error ? error.message : 'Sign in failed',
      });

      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Sign out current user
   */
  const signOut = async (_options?: SignOutOptions) => {
    try {
      setLoading(true);

      const { error } = await supabase.auth.signOut();
      if (error) {
        setError({
          code: 'signout_error',
          message: error.message || 'Sign out failed',
        });
        throw error;
      }

      // Create new guest user
      const { user: guestUser } = createGuestUser();
      setUser(guestUser);
      setSession(null);

      // TODO: Handle keepLocalData option
      // If !keepLocalData, clear all user data from IndexedDB
    } catch (error) {
      console.error('Sign out failed:', error);

      setError({
        code: 'signout_error',
        message: error instanceof Error ? error.message : 'Sign out failed',
      });

      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Start as guest (no auth)
   */
  const startAsGuest = () => {
    const { user: guestUser } = createGuestUser();
    setUser(guestUser);
    setSession(null);
    setLoading(false);

    // Store guest ID for potential migration when user signs in later
    const { key, value } = getPendingMigrationData(guestUser.id);
    localStorage.setItem(key, value);
  };

  return {
    user,
    isAuthenticated,
    isGuest,
    isLoading,
    signIn,
    signOut,
    startAsGuest,
  };
};
