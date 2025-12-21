/**
 * @fileoverview Toast root component with portal
 * @module @kakeibo/web/components/ui
 */

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import type { Toast } from '../../../utils/toast';
import { subscribe } from '../../../utils/toast';
import { ToastContainer } from './ToastContainer';

const TOAST_DURATION = 4000; // 4 seconds

export const ToastRoot = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const unsubscribe = subscribe((toast: Toast) => {
      setToasts((prev) => [...prev, toast]);

      // Auto-dismiss after duration
      const timer = setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, TOAST_DURATION);

      return () => clearTimeout(timer);
    });

    return unsubscribe;
  }, []);

  return createPortal(<ToastContainer toasts={toasts} />, document.body);
};
