/**
 * @fileoverview CategorySelect - Category selection with subcategories and search
 * @module @kakeibo/native/components/ui
 *
 * Features:
 * - Search categories and subcategories
 * - Expandable subcategory sections
 * - Auto-expand on search
 * - Icon display with colors
 * - Selection persistence
 */

import { ChevronDown, ChevronRight, Search, X } from 'lucide-react-native';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, type ListRenderItem, Pressable, Text, TextInput, View } from 'react-native';
import { CategoryIcon } from './CategoryIcon';
import { Modal } from './Modal';

export interface CategoryOption {
  value: string;
  label: string;
  icon?: string;
  color?: string;
  disabled?: boolean;
}

export interface Subcategory {
  id: string;
  name: string;
  categoryId: string;
}

export interface CategorySelection {
  categoryId: string;
  subcategoryId?: string;
}

export interface CategorySelectProps {
  label?: string;
  error?: string;
  helperText?: string;
  options: CategoryOption[];
  subcategories?: Subcategory[];
  placeholder?: string;
  value?: string;
  subcategoryValue?: string;
  onValueChange?: (value: string) => void;
  onSelectionChange?: (selection: CategorySelection) => void;
  disabled?: boolean;
}

interface FilteredCategory {
  category: CategoryOption;
  subcategories: Subcategory[];
  matchType: 'category' | 'subcategory' | 'both';
}

type FlatItem =
  | { type: 'category'; category: CategoryOption; subcategories: Subcategory[] }
  | { type: 'subcategory'; category: CategoryOption; subcategory: Subcategory };

export const CategorySelect = ({
  label,
  error,
  helperText,
  options,
  subcategories = [],
  placeholder = 'Search categories...',
  value,
  subcategoryValue,
  onValueChange,
  onSelectionChange,
  disabled = false,
}: CategorySelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const searchInputRef = useRef<TextInput>(null);
  const isMountedRef = useRef(true);

  // Track mount/unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Focus search input when modal opens
  useEffect(() => {
    if (isOpen) {
      const timeoutId = setTimeout(() => {
        if (isMountedRef.current) {
          searchInputRef.current?.focus();
        }
      }, 100);

      // Cleanup timeout on unmount or when isOpen changes
      return () => clearTimeout(timeoutId);
    }
  }, [isOpen]);

  const selectedOption = options.find((opt) => opt.value === value);
  const selectedSubcategory = subcategoryValue
    ? subcategories.find((s) => s.categoryId === value && s.id === subcategoryValue)
    : undefined;

  // Auto-expand categories with subcategories on mount
  useEffect(() => {
    if (subcategories.length > 0) {
      const categoriesWithSubs = new Set<string>();
      for (const option of options) {
        const hasSubs = subcategories.some((s) => s.categoryId === option.value);
        if (hasSubs) {
          categoriesWithSubs.add(option.value);
        }
      }
      setExpandedCategories(categoriesWithSubs);
    }
  }, [subcategories, options]);

  // Smart filter: search both categories AND subcategories
  const filteredResults = useMemo((): FilteredCategory[] => {
    const query = searchQuery.toLowerCase().trim();

    const results = options
      .map((category) => {
        const allSubcategories = subcategories.filter((s) => s.categoryId === category.value);
        const categoryMatches = !query || category.label.toLowerCase().includes(query);

        if (!query) {
          return {
            category,
            subcategories: allSubcategories,
            matchType: 'category' as const,
          };
        }

        const matchingSubcategories = allSubcategories.filter((sub) =>
          sub.name.toLowerCase().includes(query)
        );

        if (categoryMatches && matchingSubcategories.length > 0) {
          return {
            category,
            subcategories: allSubcategories,
            matchType: 'both' as const,
          };
        }
        if (categoryMatches) {
          return {
            category,
            subcategories: allSubcategories,
            matchType: 'category' as const,
          };
        }
        if (matchingSubcategories.length > 0) {
          return {
            category,
            subcategories: matchingSubcategories,
            matchType: 'subcategory' as const,
          };
        }

        return null;
      })
      .filter((result): result is FilteredCategory => result !== null);

    // Sort: put "others" or "other" at the bottom
    return results.sort((a, b) => {
      const aIsOther = a.category.label.toLowerCase().includes('other');
      const bIsOther = b.category.label.toLowerCase().includes('other');
      if (aIsOther && !bIsOther) return 1;
      if (!aIsOther && bIsOther) return -1;
      return 0;
    });
  }, [options, searchQuery, subcategories]);

  // Auto-expand categories when searching
  useEffect(() => {
    if (searchQuery) {
      const categoriesToExpand = new Set(filteredResults.map((r) => r.category.value));
      setExpandedCategories(categoriesToExpand);
    }
  }, [searchQuery, filteredResults]);

  // Build flat list for rendering
  const flatItems = useMemo((): FlatItem[] => {
    const items: FlatItem[] = [];

    for (const { category, subcategories: subs } of filteredResults) {
      items.push({ type: 'category', category, subcategories: subs });

      if (searchQuery || expandedCategories.has(category.value)) {
        for (const sub of subs) {
          items.push({ type: 'subcategory', category, subcategory: sub });
        }
      }
    }

    return items;
  }, [filteredResults, expandedCategories, searchQuery]);

  const handleSelectCategory = (category: CategoryOption) => {
    onValueChange?.(category.value);
    onSelectionChange?.({ categoryId: category.value, subcategoryId: undefined });
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleSelectSubcategory = (category: CategoryOption, subcategory: Subcategory) => {
    onValueChange?.(category.value);
    onSelectionChange?.({
      categoryId: category.value,
      subcategoryId: subcategory.id,
    });
    setIsOpen(false);
    setSearchQuery('');
  };

  const toggleExpand = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  const handleClear = () => {
    onValueChange?.('');
    onSelectionChange?.({ categoryId: '', subcategoryId: undefined });
    setSearchQuery('');
  };

  const getDisplayValue = () => {
    if (!selectedOption) return '';
    if (selectedSubcategory) {
      return `${selectedOption.label} / ${selectedSubcategory.name}`;
    }
    return selectedOption.label;
  };

  // Render category row
  const renderCategoryItem = (category: CategoryOption, subs: Subcategory[]) => {
    const isExpanded = expandedCategories.has(category.value);
    const isSelected = value === category.value && !subcategoryValue;
    const hasSubs = subs.length > 0;

    return (
      <View className="px-2">
        <Pressable
          className={`flex-row items-center px-2 py-3 rounded-lg ${
            isSelected ? 'bg-primary-500/10' : 'active:bg-surface-700/30'
          }`}
          onPress={() => (hasSubs ? toggleExpand(category.value) : handleSelectCategory(category))}
        >
          {hasSubs && (
            <View className="mr-2">
              {isExpanded ? (
                <ChevronDown size={16} color="#94a3b8" />
              ) : (
                <ChevronRight size={16} color="#94a3b8" />
              )}
            </View>
          )}
          <View className="mr-3">
            <CategoryIcon
              icon={category.icon || 'tag'}
              color={category.color || '#94a3b8'}
              size="md"
            />
          </View>
          <Text
            className={`flex-1 text-[15px] ${isSelected ? 'text-primary-400 font-semibold' : 'text-surface-100'}`}
          >
            {category.label}
          </Text>
          {hasSubs && (
            <Pressable
              className="ml-2 px-3 py-1 bg-surface-700 rounded-lg active:bg-surface-600"
              onPress={() => handleSelectCategory(category)}
            >
              <Text className="text-surface-300 text-xs">Select</Text>
            </Pressable>
          )}
        </Pressable>
      </View>
    );
  };

  // Render subcategory row
  const renderSubcategoryItem = (category: CategoryOption, subcategory: Subcategory) => {
    const isSelected = value === category.value && subcategoryValue === subcategory.id;
    return (
      <View className="px-2">
        <Pressable
          className={`flex-row items-center pl-10 pr-2 py-2.5 rounded-lg ${isSelected ? 'bg-primary-500/10' : 'active:bg-surface-700/30'}`}
          onPress={() => handleSelectSubcategory(category, subcategory)}
        >
          <View className="w-1.5 h-1.5 rounded-full bg-surface-500 mr-3" />
          <Text
            className={`flex-1 text-[14px] ${isSelected ? 'text-primary-400 font-semibold' : 'text-surface-300'}`}
          >
            {subcategory.name}
          </Text>
        </Pressable>
      </View>
    );
  };

  const renderItem: ListRenderItem<FlatItem> = ({ item }) => {
    if (item.type === 'category') {
      return renderCategoryItem(item.category, item.subcategories);
    }
    return renderSubcategoryItem(item.category, item.subcategory);
  };

  return (
    <View className="w-full">
      {label && <Text className="text-surface-200 text-sm font-medium mb-1.5">{label}</Text>}

      {/* Trigger */}
      <Pressable
        className={`bg-surface-800/60 border rounded-lg px-3 py-2.5 flex-row items-center justify-between ${
          error ? 'border-danger-500' : 'border-surface-700'
        } ${disabled ? 'opacity-50' : ''}`}
        onPress={() => !disabled && setIsOpen(true)}
        disabled={disabled}
      >
        {selectedOption ? (
          <View className="flex-row items-center flex-1 mr-2">
            <CategoryIcon
              icon={selectedOption.icon || 'tag'}
              color={selectedOption.color || '#94a3b8'}
              size="sm"
            />
            <Text className="text-surface-100 text-base ml-2 flex-1" numberOfLines={1}>
              {getDisplayValue()}
            </Text>
            <Pressable onPress={handleClear} className="p-1">
              <X size={16} color="#94a3b8" />
            </Pressable>
          </View>
        ) : (
          <Text className="text-surface-500 text-base flex-1">{placeholder}</Text>
        )}
        <ChevronDown size={20} color="#64748b" />
      </Pressable>

      {error && <Text className="text-danger-400 text-xs mt-1">{error}</Text>}
      {helperText && !error && <Text className="text-surface-500 text-xs mt-1">{helperText}</Text>}

      {/* Full Screen Modal */}
      <Modal
        visible={isOpen}
        onClose={() => setIsOpen(false)}
        title={label || 'Select category'}
        scrollable={false}
        fullScreen={true}
      >
        {/* Search Input */}
        <View className="px-4 py-3 border-b border-surface-800">
          <View className="flex-row items-center bg-surface-800/30 rounded-lg px-3 py-2.5">
            <Search size={16} color="#64748b" />
            <TextInput
              ref={searchInputRef}
              className="flex-1 ml-2 text-surface-100 text-sm py-0"
              placeholder="Search categories..."
              placeholderTextColor="#475569"
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery('')} className="p-1 active:opacity-50">
                <X size={14} color="#64748b" />
              </Pressable>
            )}
          </View>
        </View>

        {/* Category List */}
        <FlatList
          data={flatItems}
          renderItem={renderItem}
          keyExtractor={(item, index) =>
            item.type === 'category' ? item.category.value : `${item.subcategory.id}-${index}`
          }
          className="flex-1"
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <View className="py-12 items-center">
              <Text className="text-surface-400 text-sm">No categories found</Text>
            </View>
          }
        />
      </Modal>
    </View>
  );
};
