/**
 * @fileoverview AccountMenu - Transfer/edit/delete dropdown menu
 * @module @kakeibo/native/components/features/accounts
 */

import { ArrowLeftRight, MoreVertical, Pencil, Trash2 } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

interface AccountMenuProps {
  onTransfer: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const AccountMenu = ({ onTransfer, onEdit, onDelete }: AccountMenuProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <Pressable onPress={() => setMenuOpen(!menuOpen)} className="p-1.5 -mr-1 active:opacity-50">
        <MoreVertical size={20} color="#94a3b8" />
      </Pressable>

      {menuOpen && (
        <View className="absolute right-0 top-8 bg-surface-800 border border-surface-700 rounded-xl shadow-lg z-10 min-w-40 overflow-hidden">
          <Pressable
            onPress={() => {
              setMenuOpen(false);
              onTransfer();
            }}
            className="flex-row items-center gap-3 px-4 py-2.5 active:bg-surface-700/50"
          >
            <ArrowLeftRight size={16} color="#94a3b8" />
            <Text className="text-surface-200 text-sm">Transfer</Text>
          </Pressable>

          <Pressable
            onPress={() => {
              setMenuOpen(false);
              onEdit();
            }}
            className="flex-row items-center gap-3 px-4 py-2.5 active:bg-surface-700/50"
          >
            <Pencil size={16} color="#94a3b8" />
            <Text className="text-surface-200 text-sm">Edit Account</Text>
          </Pressable>

          <View className="h-px bg-surface-700 my-1" />

          <Pressable
            onPress={() => {
              setMenuOpen(false);
              onDelete();
            }}
            className="flex-row items-center gap-3 px-4 py-2.5 active:bg-surface-700/50"
          >
            <Trash2 size={16} color="#f87171" />
            <Text className="text-danger-400 text-sm">Delete</Text>
          </Pressable>
        </View>
      )}
    </>
  );
};
