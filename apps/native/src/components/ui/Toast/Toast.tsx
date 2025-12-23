/**
 * @fileoverview Toast component
 * @module @kakeibo/native/components/ui/Toast
 *
 * Individual toast notification with auto-dismiss.
 */

import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react-native';
import type React from 'react';
import { useEffect, useRef } from 'react';
import { Animated, Text } from 'react-native';
import type { ToastMessage } from './toast';

export interface ToastProps {
  /** Toast data */
  toast: ToastMessage;

  /** Dismiss handler */
  onDismiss: (id: string) => void;
}

const iconMap = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const colorMap = {
  success: {
    accentBg: '#10b981',
    icon: '#ffffff',
  },
  error: {
    accentBg: '#f43f5e',
    icon: '#ffffff',
  },
  warning: {
    accentBg: '#f59e0b',
    icon: '#ffffff',
  },
  info: {
    accentBg: '#5B6EF5',
    icon: '#ffffff',
  },
};

export const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  const slideAnim = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    // Slide in
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 100,
      friction: 10,
    }).start();

    // Auto dismiss
    const timer = setTimeout(() => {
      handleDismiss();
    }, toast.duration || 3000);

    return () => clearTimeout(timer);
  }, [handleDismiss, slideAnim, toast.duration]);

  const handleDismiss = () => {
    Animated.timing(slideAnim, {
      toValue: -100,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      onDismiss(toast.id);
    });
  };

  const Icon = iconMap[toast.type];
  const colors = colorMap[toast.type];

  return (
    <Animated.View
      style={{
        transform: [{ translateY: slideAnim }],
        alignSelf: 'center',
        maxWidth: 320,
        borderRadius: 999,
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        paddingVertical: 8,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
      }}
    >
      <Animated.View
        style={{
          width: 24,
          height: 24,
          borderRadius: 12,
          backgroundColor: colors.accentBg,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon size={16} color={colors.icon} strokeWidth={2.5} />
      </Animated.View>
      <Text
        style={{
          color: '#f8fafc',
          fontSize: 14,
          lineHeight: 20,
        }}
        numberOfLines={2}
      >
        {toast.message}
      </Text>
    </Animated.View>
  );
};
