/**
 * @fileoverview ID generation utilities
 * @module @kakeibo/core/utils
 *
 * Provides utility functions for generating unique identifiers.
 * Platform-agnostic implementation without external dependencies.
 *
 * Platform: Platform-agnostic (core)
 */

/**
 * Generate a unique ID
 *
 * Creates a unique identifier using timestamp and random values.
 * Format: `{timestamp}-{random}`
 *
 * @returns Unique ID string
 *
 * @example
 * ```ts
 * generateId(); // "1703097600000-a3f8d2e1"
 * ```
 */
export function generateId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 10);
  return `${timestamp}-${random}`;
}

/**
 * Generate a UUID v4 (simplified)
 *
 * Creates a UUID-like string. Not cryptographically secure,
 * but sufficient for client-side IDs.
 *
 * @returns UUID string
 *
 * @example
 * ```ts
 * generateUUID(); // "a3f8d2e1-4b5c-4d6e-8f9a-1b2c3d4e5f6g"
 * ```
 */
export function generateUUID(): string {
  // Simple UUID v4 implementation
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Generate a short ID
 *
 * Creates a short random identifier (8 characters).
 * Useful for display purposes or short-lived references.
 *
 * @param length - Length of the ID (default: 8)
 * @returns Short ID string
 *
 * @example
 * ```ts
 * generateShortId(); // "a3f8d2e1"
 * generateShortId(12); // "a3f8d2e1b4c5"
 * ```
 */
export function generateShortId(length: number = 8): string {
  return Math.random()
    .toString(36)
    .substring(2, 2 + length)
    .padEnd(length, '0');
}

/**
 * Generate a numeric ID
 *
 * Creates a random numeric identifier.
 *
 * @param digits - Number of digits (default: 8)
 * @returns Numeric ID
 *
 * @example
 * ```ts
 * generateNumericId(); // 12345678
 * generateNumericId(6); // 123456
 * ```
 */
export function generateNumericId(digits: number = 8): number {
  const min = 10 ** (digits - 1);
  const max = 10 ** digits - 1;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Check if a string is a valid UUID format
 *
 * @param id - String to validate
 * @returns True if valid UUID format
 */
export function isValidUUID(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}
