/**
 * @fileoverview Confirmation Dialog Component
 * @module @kakeibo/web/components/common
 *
 * Reusable confirmation dialog for destructive actions
 */

import { AlertTriangle } from 'lucide-react';
import { Modal } from '../ui/Modal/Modal';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning';
  isLoading?: boolean;
}

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading = false,
}: ConfirmDialogProps) => {
  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" showCloseButton={false}>
      <div className="text-center">
        {/* Icon */}
        <div
          className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
            variant === 'danger' ? 'bg-danger-500/10' : 'bg-warning-500/10'
          }`}
        >
          <AlertTriangle
            className={`w-8 h-8 ${variant === 'danger' ? 'text-danger-400' : 'text-warning-400'}`}
          />
        </div>

        {/* Title */}
        <h2 className="text-lg font-semibold text-surface-50 mb-2">{title}</h2>

        {/* Message */}
        <p className="text-surface-300 text-sm mb-6">{message}</p>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-3 bg-surface-700 hover:bg-surface-600 text-surface-100 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isLoading}
            className={`flex-1 px-4 py-3 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              variant === 'danger'
                ? 'bg-danger-500 hover:bg-danger-600 text-white'
                : 'bg-warning-500 hover:bg-warning-600 text-white'
            }`}
          >
            {isLoading ? 'Deleting...' : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};
