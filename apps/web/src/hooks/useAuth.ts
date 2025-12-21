/**
 * @fileoverview Authentication hook
 * @module @kakeibo/web/hooks
 *
 * Main authentication hook for the web platform.
 * Integrates Supabase with @kakeibo/core auth services.
 */

import type { AuthUser, LoginOptions, SignOutOptions } from '@kakeibo/core';
import { convertOAuthUser, createGuestUser } from '@kakeibo/core';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { useEffect } from 'react';
import { supabase } from '../services/auth/supabaseClient';
import { useAuthStore } from '../store/authStore';

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
    provider: provider as any, // Supabase providers don't exactly match our types
  };

  return convertOAuthUser(oauthUserData, provider as any);
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
  }, [setUser, setSession, setLoading, setError]); // Only run once on mount

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
