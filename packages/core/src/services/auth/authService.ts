/**
 * @fileoverview Authentication services
 * @module @kakeibo/core/services/auth
 *
 * Platform-agnostic authentication utilities.
 * Platforms handle Supabase integration; this provides pure functions.
 *
 * Platform: Platform-agnostic (core)
 */

import { defaultUserSettings } from '../../constants/defaults';
import type { AuthProviderType, AuthUser, GuestUserResult, OAuthUserData } from '../../types/auth';
import type { UserSettings } from '../../types/user';
import { generateId } from '../../utils/generators';

/** Prefix for guest user IDs */
const GUEST_ID_PREFIX = 'guest';

/**
 * Create a new guest user
 *
 * Guest users can use the app without authentication.
 * All data stays local until they sign in.
 *
 * @returns Guest user object
 *
 * @example
 * ```ts
 * const { user, success } = createGuestUser();
 * console.log(user.id); // "guest-1734649200000-abc123"
 * ```
 */
export function createGuestUser(): GuestUserResult {
  try {
    const guestId = `${GUEST_ID_PREFIX}-${generateId()}`;

    const now = new Date();

    const guestUser: AuthUser = {
      id: guestId,
      mode: 'guest',
      displayName: 'Guest User',
      email: '',
      settings: defaultUserSettings,
      createdAt: now,
      updatedAt: now,
    };

    return {
      user: guestUser,
      success: true,
    };
  } catch (error) {
    throw new Error(
      `Failed to create guest user: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Check if a user ID belongs to a guest user
 *
 * @param userId - User ID to check
 * @returns True if user is a guest
 *
 * @example
 * ```ts
 * isGuestUser('guest-1234567890-abc'); // true
 * isGuestUser('supabase-uuid-123');    // false
 * ```
 */
export function isGuestUser(userId: string): boolean {
  return userId.startsWith(GUEST_ID_PREFIX);
}

/**
 * Convert OAuth provider user data to AuthUser
 *
 * Platforms should extract OAuthUserData from their provider-specific objects,
 * then use this function to create a consistent AuthUser.
 *
 * @param userData - OAuth user data from provider
 * @param provider - OAuth provider used
 * @param existingSettings - User's existing settings (optional)
 * @returns AuthUser object
 *
 * @example
 * ```ts
 * // Platform extracts data from Supabase user
 * const userData: OAuthUserData = {
 *   id: supabaseUser.id,
 *   email: supabaseUser.email,
 *   displayName: supabaseUser.user_metadata.full_name,
 *   photoURL: supabaseUser.user_metadata.avatar_url,
 *   createdAt: new Date(supabaseUser.created_at)
 * };
 *
 * const authUser = convertOAuthUser(userData, 'google', settings);
 * ```
 */
export function convertOAuthUser(
  userData: OAuthUserData,
  provider: AuthProviderType,
  existingSettings?: UserSettings
): AuthUser {
  const now = new Date();

  return {
    id: userData.id,
    mode: 'authenticated',
    email: userData.email || '',
    displayName: userData.displayName || 'User',
    photoURL: userData.photoURL,
    authProvider: provider,
    externalId: userData.id,
    settings: existingSettings || defaultUserSettings,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Validate user settings object
 *
 * Ensures settings have all required fields with valid values.
 *
 * @param settings - Settings to validate
 * @returns True if valid
 *
 * @example
 * ```ts
 * if (!isValidUserSettings(settings)) {
 *   settings = { ...defaultUserSettings, ...settings };
 * }
 * ```
 */
export function isValidUserSettings(settings: Partial<UserSettings>): settings is UserSettings {
  if (!settings || typeof settings !== 'object') return false;

  const required: (keyof UserSettings)[] = ['currency', 'financialMonthStart'];

  return required.every((key) => key in settings);
}

/**
 * Merge user settings with defaults
 *
 * Ensures all settings have valid values by filling in defaults.
 *
 * @param settings - Partial settings from user
 * @returns Complete settings object
 *
 * @example
 * ```ts
 * const settings = mergeSettingsWithDefaults({ currency: 'USD' });
 * console.log(settings.financialMonthStart); // 1 (from defaults)
 * ```
 */
export function mergeSettingsWithDefaults(settings: Partial<UserSettings>): UserSettings {
  return {
    ...defaultUserSettings,
    ...settings,
  };
}
