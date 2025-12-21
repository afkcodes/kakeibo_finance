/**
 * @fileoverview Toast notification utility
 * @module @kakeibo/web/utils
 *
 * Simple pub-sub pattern for toast notifications.
 * Ported from v1 with improvements.
 */

export type ToastVariant = 'default' | 'success' | 'error' | 'warning' | 'info';

export interface ToastPayload {
  title: string;
  description?: string;
  variant?: ToastVariant;
}

export interface Toast extends ToastPayload {
  id: string;
}

type ToastListener = (toast: Toast) => void;

let listeners: ToastListener[] = [];

/**
 * Show a toast notification
 * @param payload - Toast configuration
 */
export const toast = (payload: ToastPayload): void => {
  const toastWithId: Toast = {
    ...payload,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
  };

  for (const listener of listeners) {
    listener(toastWithId);
  }
};

/**
 * Subscribe to toast notifications
 * @param fn - Listener function
 * @returns Unsubscribe function
 */
export const subscribe = (fn: ToastListener): (() => void) => {
  listeners.push(fn);
  return () => {
    listeners = listeners.filter((l) => l !== fn);
  };
};

/**
 * Convenience methods for different toast variants
 */
export const toastHelpers = {
  success: (title: string, description?: string) =>
    toast({ title, description, variant: 'success' }),

  error: (title: string, description?: string) => toast({ title, description, variant: 'error' }),

  warning: (title: string, description?: string) =>
    toast({ title, description, variant: 'warning' }),

  info: (title: string, description?: string) => toast({ title, description, variant: 'info' }),
};
