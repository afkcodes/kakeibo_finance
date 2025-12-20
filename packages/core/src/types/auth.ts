/**
 * @fileoverview Authentication type definitions (platform-agnostic)
 * @module @kakeibo/core/types
 *
 * Defines authentication types without platform-specific dependencies.
 * Platforms (web/native) will convert their specific auth types to these generic types.
 *
 * Platform: Platform-agnostic (core)
 *
 * NOTE: This file intentionally does NOT import Supabase types to remain
 * platform-independent. Each platform will handle Supabase conversions separately.
 */

import type { User } from './user';

/**
 * User mode types
 * - guest: User is using the app without authentication (local-only data)
 * - authenticated: User is signed in via OAuth (data can be synced)
 */
export type UserMode = 'guest' | 'authenticated';

/**
 * Supported OAuth providers
 * Designed to be extensible for future providers
 */
export type AuthProviderType = 'google' | 'apple' | 'github' | 'email';

/**
 * OAuth provider configuration
 * Used for rendering provider buttons and managing provider state
 */
export interface AuthProvider {
  /** Provider identifier */
  id: AuthProviderType;

  /** Display name */
  name: string;

  /** Icon name from icon library (e.g., Lucide) */
  icon: string;

  /** Whether this provider is enabled */
  enabled: boolean;
}

/**
 * Platform-agnostic session representation
 *
 * Platforms should convert their specific session types to this format:
 * - Web: Convert Supabase JS SDK Session → AuthSession
 * - Native: Convert Supabase React Native SDK Session → AuthSession
 */
export interface AuthSession {
  /** Access token for API calls */
  accessToken: string;

  /** Refresh token for renewing access */
  refreshToken: string;

  /** Unix timestamp when access token expires */
  expiresAt?: number;

  /** User ID associated with this session */
  userId: string;
}

/**
 * Main authentication state
 * Tracks user authentication status and session
 */
export interface AuthState {
  /** Current user (null if not authenticated) */
  user: AuthUser | null;

  /** Current session (null if not authenticated) */
  session: AuthSession | null;

  /** True if user is authenticated */
  isAuthenticated: boolean;

  /** True if user is in guest mode */
  isGuest: boolean;

  /** True during auth operations */
  isLoading: boolean;

  /** Auth error if any */
  error: AuthError | null;
}

/**
 * Extended user type for authentication
 * Extends existing User type with auth-specific fields
 */
export interface AuthUser extends User {
  /** User mode */
  mode: UserMode;

  /** OAuth provider used (undefined for guests) */
  authProvider?: AuthProviderType;

  /** External auth provider user ID (undefined for guests) */
  externalId?: string;
}

/**
 * Authentication error type
 * Provides structured error information
 */
export interface AuthError {
  /** Error code from provider or app */
  code: string;

  /** Human-readable error message */
  message: string;

  /** Provider that caused the error (if applicable) */
  provider?: AuthProviderType;
}

/**
 * Login options for OAuth providers
 */
export interface LoginOptions {
  /** OAuth provider to use */
  provider: AuthProviderType;

  /** URL to redirect to after successful auth (web only) */
  redirectTo?: string;
}

/**
 * Sign out options
 */
export interface SignOutOptions {
  /** Whether to keep local data or clear it */
  keepLocalData?: boolean;
}

/**
 * Guest user creation result
 */
export interface GuestUserResult {
  /** Created guest user */
  user: AuthUser;

  /** Whether creation was successful */
  success: boolean;
}

/**
 * Platform-agnostic user data from OAuth providers
 *
 * Platforms should extract this data from their provider-specific user objects
 */
export interface OAuthUserData {
  /** Unique ID from OAuth provider */
  id: string;

  /** User email */
  email?: string;

  /** Display name */
  displayName?: string;

  /** Avatar URL */
  photoURL?: string;

  /** Provider that authenticated the user */
  provider: AuthProviderType;
}
