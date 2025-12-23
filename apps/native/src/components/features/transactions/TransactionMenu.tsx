/**
 * @fileoverview TransactionMenu component
 * @module @kakeibo/native/components/features/transactions
 */

import { MoreVertical, Pencil, Trash2 } from 'lucide-react-native';
import type React from 'react';
import { Pressable, Text, View } from 'react-native';

interface TransactionMenuProps {
  menuOpen: boolean;
  onToggle: () => void;
  onEdit?: () => void;
  onDelete: () => void;
  onClose: () => void;
}

export const TransactionMenu: React.FC<TransactionMenuProps> = ({
  menuOpen,
  onToggle,
  onEdit,
  onDelete,
  onClose,
}) => {
  const handleEdit = () => {
    onClose();
    onEdit?.();
  };

  const handleDelete = () => {
    onClose();
    onDelete();
  };

  return (
    <>
      {/* Menu Button */}
      <Pressable onPress={onToggle} className="p-1 rounded-lg active:bg-surface-700/50 shrink-0">
        <MoreVertical size={20} color="#94a3b8" />
      </Pressable>

      {/* Dropdown Menu */}
      {menuOpen && (
        <View className="absolute right-2 top-full mt-1 z-50 bg-surface-800 border border-surface-700 rounded-xl overflow-hidden">
          {onEdit !== undefined && (
            <Pressable
              onPress={handleEdit}
              className="flex-row items-center gap-2 px-4 py-2.5 active:bg-surface-700/50"
            >
              <Pencil size={16} color="#e2e8f0" />
              <Text className="text-[13px] text-surface-200">Edit</Text>
            </Pressable>
          )}
          {onDelete !== undefined && (
            <Pressable
              onPress={handleDelete}
              className="flex-row items-center gap-2 px-4 py-2.5 active:bg-danger-500/10"
            >
              <Trash2 size={16} color="#f87171" />
              <Text className="text-[13px] text-danger-400">Delete</Text>
            </Pressable>
          )}
        </View>
      )}
    </>
  );
};
