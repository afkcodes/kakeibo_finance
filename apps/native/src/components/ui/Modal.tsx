/**
 * @fileoverview Modal component with UniWind styling
 * @module @kakeibo/native/components/ui
 *
 * Modal dialog with backdrop and slide-up animation.
 * Custom implementation without HeroUI.
 */

import { X } from 'lucide-react-native';
import type React from 'react';
import { Pressable, Modal as RNModal, ScrollView, Text, View } from 'react-native';

export interface ModalProps {
  /** Modal visibility */
  visible: boolean;

  /** Close handler */
  onClose: () => void;

  /** Modal title */
  title?: string;

  /** Modal content */
  children: React.ReactNode;

  /** Footer content (typically buttons) */
  footer?: React.ReactNode;

  /** Disable backdrop dismiss */
  disableBackdropDismiss?: boolean;

  /** Enable scrollable content (default: true) */
  scrollable?: boolean;

  /** Full screen mode (default: false) */
  fullScreen?: boolean;
}

/**
 * Modal component
 *
 * @example
 * <Modal
 *   visible={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="Add Transaction"
 *   footer={
 *     <Button onPress={handleSave}>Save</Button>
 *   }
 * >
 *   <Text>Modal content</Text>
 * </Modal>
 */
export const Modal: React.FC<ModalProps> = ({
  visible,
  onClose,
  title,
  children,
  footer,
  disableBackdropDismiss = false,
  scrollable = true,
  fullScreen = false,
}) => {
  const handleBackdropPress = () => {
    if (!disableBackdropDismiss) {
      onClose();
    }
  };

  if (fullScreen) {
    return (
      <RNModal visible={visible} animationType="slide" onRequestClose={onClose}>
        <View className="flex-1 bg-surface-900">
          {/* Header */}
          {title && (
            <View className="flex-row items-center justify-between px-4 pt-12 pb-3 border-b border-surface-700/30">
              <Text className="text-surface-100 text-lg font-semibold flex-1">{title}</Text>
              <Pressable
                className="w-8 h-8 items-center justify-center rounded-lg active:bg-surface-800"
                onPress={onClose}
              >
                <X size={20} color="#e2e8f0" />
              </Pressable>
            </View>
          )}

          {/* Content */}
          {scrollable ? (
            <ScrollView className="flex-1">{children}</ScrollView>
          ) : (
            <View className="flex-1">{children}</View>
          )}

          {/* Footer */}
          {footer && <View className="p-4 border-t border-surface-700/30">{footer}</View>}
        </View>
      </RNModal>
    );
  }

  return (
    <RNModal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable className="flex-1 bg-black/50 justify-end" onPress={handleBackdropPress}>
        <Pressable
          className="bg-surface-900 rounded-t-3xl max-h-[90%]"
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header */}
          {title && (
            <View className="flex-row items-center justify-between p-4 border-b border-surface-700/30">
              <Text className="text-surface-100 text-lg font-semibold flex-1">{title}</Text>
              <Pressable
                className="w-8 h-8 items-center justify-center rounded-lg active:bg-surface-800"
                onPress={onClose}
              >
                <X size={20} color="#e2e8f0" />
              </Pressable>
            </View>
          )}

          {/* Content */}
          {scrollable ? (
            <ScrollView className="p-4">{children}</ScrollView>
          ) : (
            <View className="p-4">{children}</View>
          )}

          {/* Footer */}
          {footer && <View className="p-4 border-t border-surface-700/30">{footer}</View>}
        </Pressable>
      </Pressable>
    </RNModal>
  );
};
