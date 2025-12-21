/**
 * @fileoverview Toast notification component
 * @module @kakeibo/web/components/ui
 */

import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle, Info, type LucideIcon } from 'lucide-react';
import type { Toast } from '../../../utils/toast';

const variantStyles: Record<string, { icon: LucideIcon; accent: string }> = {
  success: { icon: CheckCircle, accent: 'bg-success-500' },
  error: { icon: AlertCircle, accent: 'bg-danger-500' },
  warning: { icon: AlertCircle, accent: 'bg-warning-500' },
  info: { icon: Info, accent: 'bg-primary-500' },
  default: { icon: Info, accent: 'bg-primary-500' },
};

interface ToastProps {
  toast: Toast;
}

export const ToastView = ({ toast }: ToastProps) => {
  const { title, description, variant = 'default' } = toast;
  const vs = variantStyles[variant] || variantStyles.default;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.18 }}
      role="status"
      aria-live="polite"
      className="max-w-xs w-auto rounded-full bg-surface-900/95 text-surface-50 shadow-2xl px-4 py-2 flex items-center gap-3"
    >
      {vs && (
        <div className={`flex items-center justify-center w-6 h-6 rounded-full ${vs.accent}`}>
          <vs.icon className="w-4 h-4 text-white" />
        </div>
      )}
      <div className="text-sm leading-snug">{description ?? title}</div>
    </motion.div>
  );
};
