import { cn } from '@kakeibo/core';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '../Button';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  footer?: ReactNode;
}

const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  footer,
}: ModalProps) => {
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full mx-4',
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-fade-in"
          onClick={closeOnOverlayClick ? onClose : undefined}
        />
        <Dialog.Content
          onEscapeKeyDown={closeOnEscape ? undefined : (e) => e.preventDefault()}
          className={cn(
            'fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%]',
            'w-full bg-surface-900 rounded-xl squircle shadow-2xl shadow-black/50',
            'max-h-[90vh] overflow-hidden flex flex-col',
            'border border-surface-700',
            'data-[state=open]:animate-fade-in',
            sizeClasses[size]
          )}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-start justify-between p-4 sm:p-6 border-b border-surface-700">
              <div>
                {title && (
                  <Dialog.Title className="text-lg font-semibold text-surface-100">
                    {title}
                  </Dialog.Title>
                )}
                {description && (
                  <Dialog.Description className="mt-1 text-sm text-surface-400">
                    {description}
                  </Dialog.Description>
                )}
              </div>
              {showCloseButton && (
                <Dialog.Close asChild>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="ml-4 -mr-2 -mt-1"
                    aria-label="Close modal"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </Dialog.Close>
              )}
            </div>
          )}

          {/* Content */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6">{children}</div>

          {/* Footer */}
          {footer && (
            <div className="flex items-center justify-end gap-3 p-4 sm:p-6 border-t border-surface-700">
              {footer}
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

Modal.displayName = 'Modal';

export { Modal };
