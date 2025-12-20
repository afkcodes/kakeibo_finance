/**
 * @fileoverview Toast notification types and interface
 * @module @kakeibo/core/utils
 *
 * Provides platform-agnostic toast notification types and interfaces.
 * Implementation will be platform-specific (web vs native).
 *
 * Platform: Platform-agnostic (core)
 */

/**
 * Toast notification variant
 */
export type ToastVariant = 'default' | 'success' | 'error' | 'warning' | 'info';

/**
 * Toast notification payload
 */
export interface ToastPayload {
  /** Toast title */
  title: string;

  /** Optional description */
  description?: string;

  /** Toast variant (styling) */
  variant?: ToastVariant;

  /** Duration in milliseconds (default: 4000) */
  duration?: number;
}

/**
 * Toast notification with ID
 */
export interface Toast extends ToastPayload {
  /** Unique toast ID */
  id: string;
}

/**
 * Toast notification service interface
 *
 * Platforms should implement this interface with their own toast system:
 * - Web: React context + portal
 * - Native: React Native toast library
 */
export interface IToastService {
  /**
   * Show a toast notification
   *
   * @param payload - Toast payload
   * @returns Toast ID for potential dismissal
   */
  show(payload: ToastPayload): string;

  /**
   * Show a success toast
   *
   * @param title - Toast title
   * @param description - Optional description
   */
  success(title: string, description?: string): string;

  /**
   * Show an error toast
   *
   * @param title - Toast title
   * @param description - Optional description
   */
  error(title: string, description?: string): string;

  /**
   * Show a warning toast
   *
   * @param title - Toast title
   * @param description - Optional description
   */
  warning(title: string, description?: string): string;

  /**
   * Show an info toast
   *
   * @param title - Toast title
   * @param description - Optional description
   */
  info(title: string, description?: string): string;

  /**
   * Dismiss a toast by ID
   *
   * @param id - Toast ID to dismiss
   */
  dismiss(id: string): void;

  /**
   * Dismiss all toasts
   */
  dismissAll(): void;
}

/**
 * Helper function to generate toast ID
 *
 * @returns Unique toast ID
 */
export const generateToastId = (): string => {
  return `toast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
};
