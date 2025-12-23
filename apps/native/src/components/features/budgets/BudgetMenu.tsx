/**
 * @fileoverview BudgetMenu - Edit/delete dropdown menu
 * @module @kakeibo/native/components/features/budgets
 */

import { MoreVertical, Pencil, Trash2 } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

interface BudgetMenuProps {
  onEdit?: () => void;
  onDelete: () => void;
}

export const BudgetMenu = ({ onEdit, onDelete }: BudgetMenuProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <Pressable onPress={() => setMenuOpen(!menuOpen)} className="p-1.5 -mr-1.5 active:opacity-50">
        <MoreVertical size={18} color="#94a3b8" />
      </Pressable>

      {menuOpen && (
        <View className="absolute right-3 top-14 bg-surface-800 border border-surface-700 rounded-xl shadow-lg z-10 min-w-35 overflow-hidden">
          {onEdit && (
            <Pressable
              onPress={() => {
                setMenuOpen(false);
                onEdit();
              }}
              className="flex-row items-center gap-3 px-4 py-2.5 active:bg-surface-700/50"
            >
              <Pencil size={16} color="#cbd5e1" />
              <Text className="text-surface-200 text-[13px]">Edit Budget</Text>
            </Pressable>
          )}
          <View className="h-px bg-surface-700" />
          <Pressable
            onPress={() => {
              setMenuOpen(false);
              onDelete();
            }}
            className="flex-row items-center gap-3 px-4 py-2.5 active:bg-danger-500/10"
          >
            <Trash2 size={16} color="#f43f5e" />
            <Text className="text-danger-400 text-[13px]">Delete</Text>
          </Pressable>
        </View>
      )}
    </>
  );
};
