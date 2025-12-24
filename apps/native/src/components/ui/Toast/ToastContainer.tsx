/**
 * @fileoverview ToastContainer component
 * @module @kakeibo/native/components/ui/Toast
 *
 * Container for rendering toast notifications.
 */

import type React from 'react';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Toast } from './Toast';
import { type ToastMessage, toast } from './toast';

export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const unsubscribe = toast.subscribe((newToast) => {
      setToasts((prev) => [...prev, newToast]);
    });

    return unsubscribe;
  }, []);

  const handleDismiss = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <View
      className="absolute top-0 left-0 right-0 z-50"
      style={{ paddingTop: insets.top }}
      pointerEvents="box-none"
    >
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} onDismiss={handleDismiss} />
      ))}
    </View>
  );
};
