/**
 * @fileoverview Toast notification utilities
 * @module @kakeibo/native/components/ui/Toast
 *
 * Pub/sub pattern for toast notifications.
 */

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

type ToastListener = (toast: ToastMessage) => void;

class ToastManager {
  private listeners: ToastListener[] = [];

  subscribe(listener: ToastListener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  show(type: ToastType, message: string, duration = 3000) {
    const toast: ToastMessage = {
      id: `toast-${Date.now()}-${Math.random()}`,
      type,
      message,
      duration,
    };
    this.listeners.forEach((listener) => listener(toast));
  }

  success(message: string, duration?: number) {
    this.show('success', message, duration);
  }

  error(message: string, duration?: number) {
    this.show('error', message, duration);
  }

  warning(message: string, duration?: number) {
    this.show('warning', message, duration);
  }

  info(message: string, duration?: number) {
    this.show('info', message, duration);
  }
}

export const toast = new ToastManager();
