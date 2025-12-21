/**
 * @fileoverview Multi-Category Select Component
 * @module @kakeibo/web/components/ui/MultiCategorySelect
 */

import { Check, ChevronDown, X } from 'lucide-react';
import { useState } from 'react';
import { CategoryIcon } from '../CategoryIcon';

export interface MultiCategoryOption {
  value: string;
  label: string;
  icon: string;
  color: string;
}

interface MultiCategorySelectProps {
  label?: string;
  categories: MultiCategoryOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  error?: string;
  helperText?: string;
}

export const MultiCategorySelect = ({
  label,
  categories,
  value,
  onChange,
  placeholder = 'Select categories',
  error,
  helperText,
}: MultiCategorySelectProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggleCategory = (categoryId: string) => {
    if (value.includes(categoryId)) {
      onChange(value.filter((id) => id !== categoryId));
    } else {
      onChange([...value, categoryId]);
    }
  };

  const handleClearAll = () => {
    onChange([]);
  };

  const selectedCategories = categories.filter((c) => value.includes(c.value));

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-surface-200 text-[13px] font-medium mb-1.5">{label}</label>
      )}

      {/* Selected Categories Display */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`
						w-full px-3 py-2.5 rounded-lg
						bg-surface-800/60 border
						${error ? 'border-danger-500' : 'border-surface-700/30'}
						text-surface-200 text-[14px]
						hover:border-surface-600/50 transition-colors
						flex items-center justify-between gap-2
					`}
        >
          <div className="flex items-center gap-2 flex-1 overflow-x-auto scrollbar-hide">
            {selectedCategories.length === 0 ? (
              <span className="text-surface-400">{placeholder}</span>
            ) : (
              <div className="flex items-center gap-2">
                {selectedCategories.map((cat) => (
                  <div
                    key={cat.value}
                    className="flex items-center gap-1.5 px-2 py-1 bg-surface-700/40 rounded-md"
                  >
                    <CategoryIcon icon={cat.icon} color={cat.color} size="sm" />
                    <span className="text-[12px]">{cat.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {selectedCategories.length > 0 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClearAll();
                }}
                className="p-0.5 hover:bg-surface-700 rounded transition-colors"
              >
                <X className="w-4 h-4 text-surface-400" />
              </button>
            )}
            <ChevronDown
              className={`w-4 h-4 text-surface-400 transition-transform ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </div>
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-surface-800 border border-surface-700 rounded-lg shadow-xl max-h-60 overflow-y-auto">
            {categories.length === 0 ? (
              <div className="p-3 text-center text-surface-400 text-[13px]">
                No categories available
              </div>
            ) : (
              categories.map((category) => {
                const isSelected = value.includes(category.value);

                return (
                  <button
                    key={category.value}
                    type="button"
                    onClick={() => handleToggleCategory(category.value)}
                    className={`
											w-full flex items-center gap-3 px-3 py-2.5
											hover:bg-surface-700/40 transition-colors
											${isSelected ? 'bg-surface-700/20' : ''}
										`}
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <CategoryIcon icon={category.icon} color={category.color} size="sm" />
                      <span className="text-surface-200 text-[14px]">{category.label}</span>
                    </div>

                    {isSelected && <Check className="w-4 h-4 text-primary-400" />}
                  </button>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Helper Text or Error */}
      {(helperText || error) && (
        <p className={`text-[12px] ${error ? 'text-danger-400' : 'text-surface-400'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};
