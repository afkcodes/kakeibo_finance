/**
 * @fileoverview Toast container with animation support
 * @module @kakeibo/web/components/ui
 */

import { AnimatePresence } from 'framer-motion';
import type { Toast } from '../../../utils/toast';
import { ToastView } from './Toast';

interface ToastContainerProps {
  toasts: Toast[];
}

export const ToastContainer = ({ toasts }: ToastContainerProps) => {
  return (
    <div className="fixed left-0 right-0 bottom-8 flex justify-center pointer-events-none z-50">
      <div className="pointer-events-auto">
        <AnimatePresence initial={false}>
          {toasts.map((t) => (
            <div key={t.id} className="mb-2">
              <ToastView toast={t} />
            </div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
