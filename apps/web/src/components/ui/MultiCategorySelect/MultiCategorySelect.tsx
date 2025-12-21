/**
 * @fileoverview Multi-Category Select Component with Search and Checkboxes
 * @module @kakeibo/web/components/ui/MultiCategorySelect
 */

import { cn } from '@kakeibo/core';
import * as Popover from '@radix-ui/react-popover';
import { Check, ChevronDown, X } from 'lucide-react';
import { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import { CategoryIcon } from '../CategoryIcon';

export interface MultiCategoryOption {
  value: string;
  label: string;
  icon?: string;
  color?: string;
  disabled?: boolean;
}

export interface MultiCategorySelectProps {
  label?: string;
  error?: string;
  helperText?: string;
  categories: MultiCategoryOption[];
  placeholder?: string;
  /** Selected category IDs */
  value: string[];
  /** Called when selection changes */
  onChange: (selectedIds: string[]) => void;
  disabled?: boolean;
  className?: string;
  maxDisplay?: number;
}

const MultiCategorySelect = forwardRef<HTMLButtonElement, MultiCategorySelectProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      categories,
      placeholder = 'Select categories...',
      value,
      onChange,
      disabled,
      maxDisplay = 3,
    },
    ref
  ) => {
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    // Filter categories based on search
    const filteredCategories = useMemo(() => {
      const query = searchQuery.toLowerCase().trim();
      if (!query) return categories;
      return categories.filter((cat) => cat.label.toLowerCase().includes(query));
    }, [categories, searchQuery]);

    // Get selected categories for display
    const selectedCategories = useMemo(() => {
      return categories.filter((cat) => value.includes(cat.value));
    }, [categories, value]);

    const handleToggle = (categoryId: string) => {
      if (value.includes(categoryId)) {
        onChange(value.filter((id) => id !== categoryId));
      } else {
        onChange([...value, categoryId]);
      }
    };

    const handleRemove = (categoryId: string, e: React.MouseEvent | React.KeyboardEvent) => {
      e.stopPropagation();
      e.preventDefault();
      onChange(value.filter((id) => id !== categoryId));
    };

    const handleClearAll = (e: React.MouseEvent | React.KeyboardEvent) => {
      e.stopPropagation();
      e.preventDefault();
      onChange([]);
    };

    const handleOpenChange = (newOpen: boolean) => {
      setOpen(newOpen);
      if (!newOpen) {
        setSearchQuery('');
      }
    };

    useEffect(() => {
      if (open) {
        setTimeout(() => inputRef.current?.focus(), 0);
      }
    }, [open]);

    return (
      <div className="w-full">
        {label && (
          <div className="block text-[13px] font-medium text-surface-300 mb-1.5">{label}</div>
        )}

        <Popover.Root open={open} onOpenChange={handleOpenChange}>
          <Popover.Trigger asChild>
            <button
              ref={ref}
              type="button"
              disabled={disabled}
              className={cn(
                'relative flex items-center gap-2 rounded-xl px-3 min-h-12 py-2 w-full text-left transition-colors duration-200',
                'border border-surface-700 bg-surface-800/50',
                'focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 focus:outline-none',
                disabled && 'opacity-50 cursor-not-allowed',
                error && 'border-danger-500 focus:border-danger-500 focus:ring-danger-500/30',
                className
              )}
            >
              <div className="flex-1 flex flex-wrap gap-1.5 min-w-0">
                {selectedCategories.length === 0 ? (
                  <span className="text-surface-500 text-[14px]">{placeholder}</span>
                ) : (
                  <>
                    {selectedCategories.slice(0, maxDisplay).map((cat) => (
                      <span
                        key={cat.value}
                        className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[12px] font-medium bg-surface-700/60 text-surface-200"
                      >
                        {cat.icon && (
                          <span
                            className="w-4 h-4 rounded flex items-center justify-center"
                            style={{
                              backgroundColor: `${cat.color || '#6b7280'}20`,
                            }}
                          >
                            <CategoryIcon icon={cat.icon} color={cat.color} size="sm" />
                          </span>
                        )}
                        <span className="truncate max-w-25">{cat.label}</span>
                        <button
                          type="button"
                          onClick={(e) => handleRemove(cat.value, e)}
                          className="p-0.5 rounded hover:bg-surface-600 text-surface-400 hover:text-surface-200 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    {selectedCategories.length > maxDisplay && (
                      <span className="inline-flex items-center px-2 py-1 rounded-lg text-[12px] font-medium bg-primary-500/20 text-primary-400">
                        +{selectedCategories.length - maxDisplay} more
                      </span>
                    )}
                  </>
                )}
              </div>

              {/* Clear all button */}
              {selectedCategories.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="p-1 rounded-lg hover:bg-surface-700/50 text-surface-500 hover:text-surface-300 transition-colors shrink-0 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {/* Chevron */}
              <ChevronDown
                className={cn(
                  'w-5 h-5 text-surface-500 shrink-0 transition-transform duration-200',
                  open && 'rotate-180'
                )}
              />
            </button>
          </Popover.Trigger>

          <Popover.Portal>
            <Popover.Content
              className={cn(
                'overflow-hidden rounded-xl border border-surface-700/80 bg-surface-800 shadow-2xl',
                'animate-in fade-in-0 zoom-in-95 duration-150',
                'z-50'
              )}
              side="bottom"
              sideOffset={6}
              align="start"
              style={{ width: 'var(--radix-popover-trigger-width)' }}
              onOpenAutoFocus={(e) => e.preventDefault()}
            >
              {/* Search input */}
              <div className="p-2 border-b border-surface-700/50">
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search categories..."
                  className="w-full px-3 py-2 rounded-lg bg-surface-700/50 border border-surface-600/50 text-[13px] text-surface-100 placeholder:text-surface-500 focus:outline-none focus:border-primary-500/50"
                />
              </div>

              <div
                ref={listRef}
                className="p-2 max-h-64 overflow-y-auto overscroll-contain"
                style={{ maxHeight: '16rem' }}
              >
                {filteredCategories.length === 0 ? (
                  <div className="px-3 py-6 text-center text-[13px] text-surface-500">
                    No categories found
                  </div>
                ) : (
                  filteredCategories.map((cat) => {
                    const isSelected = value.includes(cat.value);

                    return (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => handleToggle(cat.value)}
                        disabled={cat.disabled}
                        className={cn(
                          'flex items-center gap-2.5 px-2.5 py-2.5 rounded-lg cursor-pointer select-none w-full text-left',
                          'text-[14px] text-surface-200 transition-colors',
                          'hover:bg-surface-700/60',
                          isSelected && 'bg-primary-500/10 text-primary-400',
                          cat.disabled && 'opacity-50 cursor-not-allowed'
                        )}
                      >
                        {/* Checkbox indicator */}
                        <span
                          className={cn(
                            'w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors',
                            isSelected
                              ? 'bg-primary-500 border-primary-500'
                              : 'border-surface-600 bg-transparent'
                          )}
                        >
                          {isSelected && <Check className="w-3 h-3 text-white" />}
                        </span>

                        {/* Category icon */}
                        {cat.icon && (
                          <span
                            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                            style={{
                              backgroundColor: `${cat.color || '#6b7280'}18`,
                            }}
                          >
                            <CategoryIcon icon={cat.icon} color={cat.color} size="sm" />
                          </span>
                        )}

                        <span className="flex-1 truncate font-medium">{cat.label}</span>
                      </button>
                    );
                  })
                )}
              </div>

              {/* Footer with selection count */}
              {value.length > 0 && (
                <div className="px-3 py-2 border-t border-surface-700/50 bg-surface-800/50">
                  <p className="text-[12px] text-surface-400">
                    {value.length} categor{value.length === 1 ? 'y' : 'ies'} selected
                  </p>
                </div>
              )}
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>

        {error && <p className="mt-1.5 text-[12px] text-danger-400">{error}</p>}
        {!error && helperText && (
          <p className="mt-1.5 text-[12px] text-surface-400">{helperText}</p>
        )}
      </div>
    );
  }
);

MultiCategorySelect.displayName = 'MultiCategorySelect';

export { MultiCategorySelect };
